/* ==========================================================================
   Správa blogu (admin.html)
   Web je statický, proto se články ukládají přímo do GitHub repozitáře webu
   (přes GitHub API, s přístupovým klíčem). GitHub Pages pak web sám přegeneruje
   – změna je na webu za 1–2 minuty. Nic dalšího se neinstaluje.
   ========================================================================== */
(function () {
  'use strict';

  const S = window.SITE;
  const PV = window.PV;
  const cfg = (S && S.blog) || {};
  const B = PV && PV.blog;
  const app = document.getElementById('app');
  if (!S || !PV || !B || !app) return;

  const { esc, icon } = PV;
  const API = 'https://api.github.com';
  const KEY = 'pk_admin_token';

  const store = {
    get() { try { return localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || ''; } catch (e) { return ''; } },
    set(v, remember) {
      try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); (remember ? localStorage : sessionStorage).setItem(KEY, v); } catch (e) { /* bez uložení */ }
    },
    clear() { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); } catch (e) { /* nic */ } },
  };

  let token = store.get();
  let posts = [];
  let sha = '';
  let dirty = false;
  let busy = false;

  window.addEventListener('beforeunload', (e) => { if (dirty || busy) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- GitHub API ---------- */
  async function gh(path, { method = 'GET', body } = {}) {
    let res;
    try {
      res = await fetch(API + path, {
        method,
        headers: Object.assign({
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        }, body ? { 'Content-Type': 'application/json' } : {}),
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      const err = new Error('Nepodařilo se připojit. Zkontrolujte připojení k internetu a zkuste to znovu.');
      err.network = true;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(`GitHub ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  function explain(e) {
    if (e.network) return e.message;
    if (e.status === 401) return 'Přístupový klíč není platný nebo vypršel. Přihlaste se prosím znovu.';
    if (e.status === 403) return 'Klíč nemá oprávnění zapisovat do webu (nebo je dočasně zablokovaný). Zkontrolujte, že má právo „Contents: Read and write“.';
    if (e.status === 404) return 'Web (repozitář) nebyl nalezen nebo k němu klíč nemá přístup.';
    if (e.status === 409 || e.status === 422) return 'Někdo jiný právě měnil web. Zkuste to prosím ještě jednou.';
    return e.message || 'Něco se nepovedlo. Zkuste to prosím znovu.';
  }

  const filePath = (p) => `/repos/${cfg.repo}/contents/${p.split('/').map(encodeURIComponent).join('/')}`;

  const b64 = (str) => {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  const unb64 = (b) => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g, '')), (c) => c.charCodeAt(0)));

  async function loadPosts() {
    try {
      const f = await gh(`${filePath(cfg.dataFile)}?ref=${encodeURIComponent(cfg.branch)}`);
      sha = f.sha;
      const text = unb64(f.content);
      const start = text.indexOf('=', text.indexOf('BLOG_POSTS')) + 1;
      const json = text.slice(start).trim().replace(/;\s*$/, '');
      posts = JSON.parse(json);
      if (!Array.isArray(posts)) posts = [];
    } catch (e) {
      if (e.status === 404) { posts = []; sha = ''; return; }
      throw e;
    }
  }

  const serialize = () => `/* Články blogu. Tento soubor spravuje administrace (admin.html), ručně ho needitujte. */\nwindow.BLOG_POSTS = ${JSON.stringify(posts, null, 2)};\n`;

  // Vždy se znovu načte aktuální stav, změna se přidá a uloží (při souběhu se zopakuje)
  async function commitPosts(mutate, message) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await loadPosts();
      mutate();
      try {
        const r = await gh(filePath(cfg.dataFile), {
          method: 'PUT',
          body: { message, content: b64(serialize()), branch: cfg.branch, sha: sha || undefined },
        });
        sha = r.content.sha;
        return;
      } catch (e) {
        if ((e.status === 409 || e.status === 422) && attempt < 2) continue;
        throw e;
      }
    }
  }

  async function uploadImage(dataUrl, hint) {
    const m = /^data:image\/jpeg;base64,(.+)$/.exec(dataUrl);
    if (!m) throw new Error('Obrázek se nepodařilo zpracovat.');
    const name = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}-${B.slugify(hint || 'obrazek').slice(0, 30)}.jpg`;
    const path = `${cfg.imageDir}/${name}`;
    await gh(filePath(path), { method: 'PUT', body: { message: `Blog: obrázek ${name}`, content: m[1], branch: cfg.branch } });
    return path;
  }

  // Zmenšení fotky (max 1600 px, JPEG) – web je rychlý a repozitář nenabobtná
  function processImage(file, max = 1600) {
    return new Promise((resolve, reject) => {
      if (!/^image\//.test(file.type)) { reject(new Error('Vyberte prosím obrázek (JPG nebo PNG).')); return; }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Soubor se nepodařilo přečíst.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Tento formát obrázku nelze zpracovat. Zkuste JPG nebo PNG.'));
        img.onload = () => {
          const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
          const c = document.createElement('canvas');
          c.width = Math.round(img.naturalWidth * k);
          c.height = Math.round(img.naturalHeight * k);
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- Okna ---------- */
  function dialog(html) {
    const d = document.createElement('dialog');
    d.className = 'adm-dialog';
    d.innerHTML = html;
    document.body.appendChild(d);
    d.addEventListener('close', () => d.remove());
    d.showModal();
    return d;
  }

  const confirmBox = (title, text, okLabel) => new Promise((resolve) => {
    const d = dialog(`<form method="dialog"><h2>${esc(title)}</h2><p>${esc(text)}</p><div class="adm-dialog__actions"><button class="btn btn--ghost btn--sm btn--noicon" value="no">Zrušit</button><button class="btn btn--danger btn--sm btn--noicon" value="yes">${esc(okLabel)}</button></div></form>`);
    d.addEventListener('close', () => resolve(d.returnValue === 'yes'));
  });

  const askLink = (current) => new Promise((resolve) => {
    const d = dialog(`<form method="dialog"><h2>Odkaz</h2><div class="field"><label class="field__label" for="adm-url">Adresa odkazu</label><input class="field__input" id="adm-url" type="text" inputmode="url" placeholder="https://…" value="${esc(current || '')}" autocomplete="off"></div><div class="adm-dialog__actions"><button class="btn btn--ghost btn--sm btn--noicon" value="no" formnovalidate>Zrušit</button><button class="btn btn--primary btn--sm btn--noicon" value="yes">Vložit odkaz</button></div></form>`);
    const input = d.querySelector('input');
    input.focus();
    input.select();
    d.addEventListener('close', () => resolve(d.returnValue === 'yes' ? input.value.trim() : null));
  });

  /* ---------- Obecné šablony ---------- */
  const today = () => new Date().toLocaleDateString('sv-SE'); // RRRR-MM-DD
  const siteUrl = (p) => `clanek.html?c=${encodeURIComponent(p.slug)}`;

  function topbar(loggedIn) {
    return `
    <header class="adm-top">
      <div class="adm-top__in">
        <a class="logo" href="index.html" aria-label="Na web">${PV.archMark('logo__mark')}<span class="logo__text"><span class="logo__name">${esc(S.brand.name)}</span><span class="logo__role">Správa webu</span></span></a>
        <span class="adm-top__space"></span>
        <a class="adm-link" href="index.html" target="_blank" rel="noopener">Zobrazit web</a>
        ${loggedIn ? '<button class="adm-link" type="button" data-logout>Odhlásit se</button>' : ''}
      </div>
    </header>`;
  }

  const shell = (inner, loggedIn) => {
    app.innerHTML = `${topbar(loggedIn)}<main class="adm-wrap" id="main" tabindex="-1">${inner}</main>`;
    const out = app.querySelector('[data-logout]');
    if (out) out.addEventListener('click', async () => {
      if (dirty && !(await confirmBox('Odhlásit se?', 'Rozepsaný článek není uložený a ztratí se.', 'Odhlásit'))) return;
      dirty = false; store.clear(); token = ''; viewLogin();
    });
    window.scrollTo(0, 0);
  };

  const alertBox = (msg) => `<p class="adm-alert" role="alert">${icon('alert')}<span>${esc(msg)}</span></p>`;

  /* ---------- Přihlášení ---------- */
  function viewLogin(message) {
    shell(`
    <div class="adm-login">
      <h1 class="adm-title">Správa <em>webu</em></h1>
      <p class="adm-lead">Tady můžete psát a upravovat články blogu. Přihlaste se přístupovým klíčem.</p>
      <form class="adm-card" data-login novalidate>
        <div data-msg>${message ? alertBox(message) : ''}</div>
        <div class="field">
          <label class="field__label" for="adm-token">Přístupový klíč</label>
          <input class="field__input" id="adm-token" type="password" autocomplete="current-password" placeholder="github_pat_…" spellcheck="false">
        </div>
        <label class="adm-check"><input type="checkbox" data-remember checked><span>Zapamatovat si na tomto zařízení</span></label>
        <button class="btn btn--primary" type="submit"><span>Přihlásit se</span><span class="btn__icon" aria-hidden="true">${icon('arrow-right')}</span></button>
      </form>
      <details class="adm-help">
        <summary>Kde vezmu přístupový klíč?</summary>
        <ol>
          <li>Přihlaste se na <a href="https://github.com/login" target="_blank" rel="noopener">github.com</a> účtem, který má k webu přístup.</li>
          <li>Otevřete <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com/settings/personal-access-tokens/new</a>.</li>
          <li>Jako název napište <strong>Správa webu</strong> a platnost nastavte na <strong>1 rok</strong>.</li>
          <li>U <strong>Repository access</strong> zvolte <strong>Only select repositories</strong> a vyberte <strong>${esc(cfg.repo.split('/')[1] || cfg.repo)}</strong>.</li>
          <li>V <strong>Repository permissions</strong> nastavte <strong>Contents</strong> na <strong>Read and write</strong>.</li>
          <li>Klikněte na <strong>Generate token</strong> a klíč zkopírujte sem. Zobrazí se jen jednou.</li>
        </ol>
        <p>Klíč je jako heslo – nikomu ho neposílejte. Uložený je jen ve vašem prohlížeči.</p>
      </details>
    </div>`, false);

    const form = app.querySelector('[data-login]');
    const msg = app.querySelector('[data-msg]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = form.querySelector('#adm-token').value.trim();
      if (!val) { msg.innerHTML = alertBox('Vložte prosím přístupový klíč.'); return; }
      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      msg.innerHTML = '';
      token = val;
      try {
        const repo = await gh(`/repos/${cfg.repo}`);
        if (!repo.permissions || !repo.permissions.push) {
          const err = new Error('no-push'); err.status = 403; throw err;
        }
        store.set(val, form.querySelector('[data-remember]').checked);
        await viewList();
      } catch (err) {
        token = '';
        submit.disabled = false;
        msg.innerHTML = alertBox(explain(err));
      }
    });
  }

  /* ---------- Seznam článků ---------- */
  async function viewList(notice) {
    shell('<p class="adm-loading">Načítám články…</p>', true);
    try {
      await loadPosts();
    } catch (e) {
      if (e.status === 401) { store.clear(); token = ''; viewLogin(explain(e)); return; }
      shell(`${alertBox(explain(e))}<p><button class="btn btn--primary btn--sm btn--noicon" type="button" data-retry>Zkusit znovu</button></p>`, true);
      app.querySelector('[data-retry]').addEventListener('click', () => viewList());
      return;
    }

    const list = posts.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id)));
    const rows = list.map((p) => `
      <li class="adm-row" data-id="${esc(p.id)}">
        <div class="adm-row__main">
          <p class="adm-row__title">${esc(p.title)}</p>
          <p class="adm-row__meta"><span class="adm-chip ${p.published === false ? 'adm-chip--draft' : 'adm-chip--live'}">${p.published === false ? 'Koncept' : 'Zveřejněno'}</span><time datetime="${esc(p.date)}">${esc(B.dateLabel(p.date))}</time></p>
        </div>
        <div class="adm-row__actions">
          <button class="btn btn--ghost btn--sm btn--noicon" type="button" data-edit>Upravit</button>
          ${p.published === false ? '' : `<a class="adm-link" href="${siteUrl(p)}" target="_blank" rel="noopener">Zobrazit</a>`}
          <button class="adm-link adm-link--danger" type="button" data-del>Smazat</button>
        </div>
      </li>`).join('');

    shell(`
    <div class="adm-head">
      <div>
        <h1 class="adm-title">Články</h1>
        <p class="adm-lead">${list.length ? `Celkem ${list.length} ${PV.plural(list.length, 'článek', 'články', 'článků')}.` : 'Zatím tu nic není. Napište první článek.'}</p>
      </div>
      <button class="btn btn--primary" type="button" data-new><span>Nový článek</span><span class="btn__icon" aria-hidden="true">${icon('plus')}</span></button>
    </div>
    ${notice ? `<p class="adm-notice" role="status">${icon('check')}<span>${notice}</span></p>` : ''}
    ${list.length ? `<ul class="adm-list adm-card">${rows}</ul>` : ''}`, true);

    app.querySelector('[data-new]').addEventListener('click', () => viewEditor(null));
    app.querySelectorAll('.adm-row').forEach((row) => {
      const p = list.find((x) => x.id === row.dataset.id);
      row.querySelector('[data-edit]').addEventListener('click', () => viewEditor(p));
      row.querySelector('[data-del]').addEventListener('click', async () => {
        if (!(await confirmBox('Smazat článek?', `Článek „${p.title}“ se smaže z webu. Tuto akci nelze vrátit.`, 'Smazat článek'))) return;
        busy = true;
        row.classList.add('is-busy');
        try {
          await commitPosts(() => { posts = posts.filter((x) => x.id !== p.id); }, `Blog: smazání – ${p.title}`);
          busy = false;
          viewList('Článek je smazaný. Z webu zmizí do 1–2 minut.');
        } catch (e) {
          busy = false;
          row.classList.remove('is-busy');
          PV.toast(explain(e), 'alert');
        }
      });
    });
  }

  /* ---------- Editor článku ---------- */
  function viewEditor(existing) {
    const post = existing
      ? Object.assign({}, existing)
      : { id: '', slug: '', title: '', date: today(), excerpt: '', cover: '', coverAlt: '', body: '', published: true };
    dirty = false;

    const tools = [
      ['h2', 'Nadpis', 'Nadpis'],
      ['h3', 'Podnadpis', 'Podnadpis'],
      ['bold', '<b>B</b>', 'Tučně'],
      ['italic', '<i>I</i>', 'Kurzíva'],
      ['ul', 'Odrážky', 'Odrážkový seznam'],
      ['ol', '1. 2.', 'Číslovaný seznam'],
      ['quote', '„ “', 'Citace'],
      ['link', 'Odkaz', 'Vložit odkaz'],
      ['unlink', 'Zrušit odkaz', 'Odebrat odkaz'],
      ['image', 'Obrázek', 'Vložit obrázek'],
      ['clear', 'Vyčistit', 'Odstranit formátování'],
    ];

    shell(`
    <button class="link-arrow link-arrow--back adm-back" type="button" data-back><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-left')}</span><span class="link-arrow__text">Zpět na články</span></button>
    <h1 class="adm-title">${existing ? 'Upravit článek' : 'Nový článek'}</h1>
    <form class="adm-card adm-form" data-form novalidate>
      <div data-msg></div>

      <div class="field">
        <label class="field__label" for="f-title">Nadpis článku<span class="req" aria-hidden="true">*</span></label>
        <input class="field__input adm-input--title" id="f-title" type="text" maxlength="140" value="${esc(post.title)}" placeholder="Např. Jak se připravit na schůzku k hypotéce">
        <p class="field__error" data-err="title"></p>
      </div>

      <div class="adm-two">
        <div class="field">
          <label class="field__label" for="f-date">Datum</label>
          <input class="field__input" id="f-date" type="date" value="${esc(post.date)}">
        </div>
        <div class="field">
          <span class="field__label">Stav</span>
          <label class="switch adm-switch"><input type="checkbox" id="f-pub" ${post.published === false ? '' : 'checked'}><span class="switch__track" aria-hidden="true"></span><span data-pub-label></span></label>
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="f-excerpt">Krátký úvod<span class="opt"> (nepovinné)</span></label>
        <textarea class="field__input" id="f-excerpt" rows="3" maxlength="260" placeholder="Pár vět, které se ukážou ve výpisu článků. Když nic nenapíšete, vezme se začátek textu.">${esc(post.excerpt)}</textarea>
      </div>

      <div class="field">
        <span class="field__label">Titulní obrázek<span class="opt"> (nepovinné)</span></span>
        <div class="adm-cover" data-cover>
          <div class="adm-cover__preview" data-cover-preview></div>
          <div class="adm-cover__actions">
            <button class="btn btn--ghost btn--sm btn--noicon" type="button" data-cover-pick>Vybrat obrázek</button>
            <button class="adm-link adm-link--danger" type="button" data-cover-remove hidden>Odebrat</button>
          </div>
        </div>
        <input type="file" accept="image/*" hidden data-cover-file>
        <input class="field__input" id="f-alt" type="text" maxlength="140" placeholder="Stručný popis obrázku (pro nevidomé a vyhledávače)" value="${esc(post.coverAlt)}" data-alt hidden>
      </div>

      <div class="field">
        <span class="field__label" id="f-body-label">Text článku<span class="req" aria-hidden="true">*</span></span>
        <div class="adm-toolbar" role="toolbar" aria-label="Úprava textu">
          ${tools.map(([id, label, title]) => `<button class="adm-tool" type="button" data-tool="${id}" title="${esc(title)}" aria-label="${esc(title)}">${label}</button>`).join('')}
        </div>
        <div class="adm-editor prose" contenteditable="true" role="textbox" aria-multiline="true" aria-labelledby="f-body-label" data-editor spellcheck="true" lang="cs"></div>
        <input type="file" accept="image/*" multiple hidden data-body-file>
        <p class="field__error" data-err="body"></p>
      </div>

      <div class="adm-actions">
        <button class="btn btn--primary" type="submit" data-save><span data-save-label>Uložit</span><span class="btn__icon" aria-hidden="true">${icon('check')}</span></button>
        <button class="btn btn--ghost btn--noicon" type="button" data-cancel>Zrušit</button>
      </div>
    </form>`, true);

    const form = app.querySelector('[data-form]');
    const msg = form.querySelector('[data-msg]');
    const editor = form.querySelector('[data-editor]');
    const pub = form.querySelector('#f-pub');
    const altField = form.querySelector('[data-alt]');
    const coverPreview = form.querySelector('[data-cover-preview]');
    const coverRemove = form.querySelector('[data-cover-remove]');
    let cover = post.cover || '';

    editor.innerHTML = B.sanitize(post.body, { allowData: true });
    try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) { /* nevadí */ }

    const touch = () => { dirty = true; };
    form.addEventListener('input', touch);

    const syncPub = () => {
      form.querySelector('[data-pub-label]').textContent = pub.checked ? 'Zveřejněno na webu' : 'Koncept (na webu se nezobrazí)';
      form.querySelector('[data-save-label]').textContent = pub.checked ? 'Uložit a zveřejnit' : 'Uložit koncept';
    };
    pub.addEventListener('change', syncPub);
    syncPub();

    const drawCover = () => {
      const src = PV.safeUrl(cover, { allowData: true });
      coverPreview.innerHTML = src ? `<img src="${esc(src)}" alt="">` : `<span>${icon('camera')}Bez obrázku</span>`;
      coverRemove.hidden = !src;
      altField.hidden = !src;
    };
    drawCover();

    const fail = (text) => { msg.innerHTML = alertBox(text); msg.scrollIntoView({ block: 'center', behavior: 'smooth' }); };

    /* Titulní obrázek */
    const coverFile = form.querySelector('[data-cover-file]');
    form.querySelector('[data-cover-pick]').addEventListener('click', () => coverFile.click());
    coverFile.addEventListener('change', async () => {
      const f = coverFile.files[0];
      coverFile.value = '';
      if (!f) return;
      try { cover = await processImage(f, 1800); touch(); drawCover(); } catch (e) { fail(e.message); }
    });
    coverRemove.addEventListener('click', () => { cover = ''; touch(); drawCover(); });

    /* Panel nástrojů */
    let saved = null;
    const keepSel = () => {
      const s = window.getSelection();
      if (s.rangeCount && editor.contains(s.anchorNode)) saved = s.getRangeAt(0).cloneRange();
    };
    const backSel = () => {
      editor.focus();
      if (saved) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(saved); }
    };
    const block = () => String(document.queryCommandValue('formatBlock') || '').toLowerCase().replace(/[<>]/g, '');

    const refreshTools = () => {
      const s = window.getSelection();
      if (!s.rangeCount || !editor.contains(s.anchorNode)) return;
      const on = {
        h2: block() === 'h2', h3: block() === 'h3', quote: block() === 'blockquote',
        bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'),
        ul: document.queryCommandState('insertUnorderedList'), ol: document.queryCommandState('insertOrderedList'),
      };
      form.querySelectorAll('[data-tool]').forEach((b) => b.classList.toggle('is-on', !!on[b.dataset.tool]));
    };
    const onSel = () => { keepSel(); refreshTools(); };
    document.addEventListener('selectionchange', onSel);
    // po opuštění editoru se posluchač odstraní (viewEditor se při návratu vykreslí znovu)
    form.addEventListener('adm-leave', () => document.removeEventListener('selectionchange', onSel));

    const exec = (cmd, val) => { backSel(); document.execCommand(cmd, false, val); touch(); refreshTools(); };
    const toggleBlock = (tag) => exec('formatBlock', block() === tag ? 'p' : tag);

    const insertImages = async (files) => {
      for (const f of files) {
        try {
          const url = await processImage(f);
          backSel();
          document.execCommand('insertImage', false, url);
          touch();
        } catch (e) { fail(e.message); }
      }
    };

    form.querySelector('.adm-toolbar').addEventListener('mousedown', (e) => { if (e.target.closest('[data-tool]')) e.preventDefault(); });
    form.querySelector('.adm-toolbar').addEventListener('click', async (e) => {
      const b = e.target.closest('[data-tool]');
      if (!b) return;
      keepSel();
      switch (b.dataset.tool) {
        case 'h2': toggleBlock('h2'); break;
        case 'h3': toggleBlock('h3'); break;
        case 'quote': toggleBlock('blockquote'); break;
        case 'bold': exec('bold'); break;
        case 'italic': exec('italic'); break;
        case 'ul': exec('insertUnorderedList'); break;
        case 'ol': exec('insertOrderedList'); break;
        case 'unlink': exec('unlink'); break;
        case 'clear': exec('removeFormat'); exec('formatBlock', 'p'); break;
        case 'image': form.querySelector('[data-body-file]').click(); break;
        case 'link': {
          const s = window.getSelection();
          const a = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement).closest('a');
          if (!a && (!saved || saved.collapsed)) { PV.toast('Nejdřív označte text, který má být odkazem.', 'info'); break; }
          let url = await askLink(a ? a.getAttribute('href') : '');
          if (url === null) { editor.focus(); break; }
          if (!url) { exec('unlink'); break; }
          if (!/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith('#')) url = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url) ? `mailto:${url}` : `https://${url}`;
          exec('createLink', url);
          break;
        }
        default:
      }
    });
    form.querySelector('[data-body-file]').addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      e.target.value = '';
      await insertImages(files);
    });

    // Vložený text se vyčistí (z Wordu a webu se jinak táhne hromada cizího formátování)
    editor.addEventListener('paste', (e) => {
      e.preventDefault();
      const cd = e.clipboardData;
      const html = cd.getData('text/html');
      const text = cd.getData('text/plain');
      const clean = html
        ? B.sanitize(html)
        : text.split(/\n{1,}/).filter((l) => l.trim()).map((l) => `<p>${esc(l.trim())}</p>`).join('');
      document.execCommand('insertHTML', false, clean);
      touch();
    });
    ['dragover', 'drop'].forEach((ev) => editor.addEventListener(ev, (e) => { if (e.dataTransfer && e.dataTransfer.types.includes('Files')) e.preventDefault(); }));

    /* Zpět / zrušit */
    const leave = async () => {
      if (dirty && !(await confirmBox('Zahodit změny?', 'Změny v článku nejsou uložené a ztratí se.', 'Zahodit'))) return;
      dirty = false;
      form.dispatchEvent(new Event('adm-leave'));
      viewList();
    };
    app.querySelector('[data-back]').addEventListener('click', leave);
    form.querySelector('[data-cancel]').addEventListener('click', leave);

    /* Uložení */
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.innerHTML = '';
      form.querySelectorAll('[data-err]').forEach((p) => { p.textContent = ''; });
      form.querySelector('#f-title').removeAttribute('aria-invalid');

      const title = form.querySelector('#f-title').value.trim();
      const bodyHtml = B.sanitize(editor.innerHTML, { allowData: true });
      const probe = document.createElement('div');
      probe.innerHTML = bodyHtml;
      let bad = false;
      if (!title) {
        form.querySelector('[data-err="title"]').textContent = 'Napište prosím nadpis článku.';
        form.querySelector('#f-title').setAttribute('aria-invalid', 'true');
        bad = true;
      }
      if (!probe.textContent.trim() && !probe.querySelector('img')) {
        form.querySelector('[data-err="body"]').textContent = 'Článek zatím nemá žádný text.';
        bad = true;
      }
      if (bad) { (form.querySelector('[aria-invalid]') || editor).focus(); return; }

      const save = form.querySelector('[data-save]');
      const label = form.querySelector('[data-save-label]');
      const prev = label.textContent;
      save.disabled = true;
      busy = true;
      try {
        // 1) obrázky, které jsou zatím jen v prohlížeči, se nahrají do webu
        let n = 0;
        const imgs = Array.from(probe.querySelectorAll('img')).filter((i) => i.getAttribute('src').startsWith('data:'));
        const total = imgs.length + (cover.startsWith('data:') ? 1 : 0);
        const step = () => { n += 1; label.textContent = `Nahrávám obrázky (${n}/${total})…`; };
        let coverPath = cover;
        if (cover.startsWith('data:')) { step(); coverPath = await uploadImage(cover, title); }
        for (const img of imgs) { step(); img.setAttribute('src', await uploadImage(img.getAttribute('src'), title)); }

        // 2) text článku
        label.textContent = 'Ukládám článek…';
        const body = B.sanitize(probe.innerHTML);
        const date = form.querySelector('#f-date').value || today();
        const isPub = pub.checked;
        const excerpt = form.querySelector('#f-excerpt').value.trim();
        const coverAlt = altField.value.trim();

        let saved2;
        await commitPosts(() => {
          const old = posts.find((x) => x.id === post.id);
          const slug = old ? old.slug : uniqueSlug(B.slugify(title));
          saved2 = {
            id: old ? old.id : `${date}-${slug}`,
            slug, title, date, excerpt, cover: coverPath, coverAlt, body, published: isPub,
          };
          const i = posts.findIndex((x) => x.id === saved2.id);
          if (i >= 0) posts[i] = saved2; else posts.push(saved2);
        }, `Blog: ${isPub ? 'zveřejnění' : 'koncept'} – ${title}`);

        busy = false;
        dirty = false;
        form.dispatchEvent(new Event('adm-leave'));
        viewList(isPub
          ? `Uloženo a zveřejněno. Na webu se článek ukáže do 1–2 minut (<a href="${siteUrl(saved2)}" target="_blank" rel="noopener">zobrazit</a>).`
          : 'Koncept je uložený. Na webu se nezobrazuje, dokud ho nezveřejníte.');
      } catch (err) {
        busy = false;
        save.disabled = false;
        label.textContent = prev;
        if (err.status === 401) { store.clear(); token = ''; dirty = false; viewLogin(explain(err)); return; }
        fail(explain(err));
      }
    });

    form.querySelector('#f-title').focus();
  }

  // Adresa článku (slug) musí být jedinečná
  function uniqueSlug(base) {
    let slug = base;
    let i = 2;
    while (posts.some((p) => p.slug === slug)) { slug = `${base}-${i}`; i += 1; }
    return slug;
  }

  /* ---------- Start ---------- */
  if (token) viewList(); else viewLogin();
})();
