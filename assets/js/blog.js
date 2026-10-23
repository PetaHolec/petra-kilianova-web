/* ==========================================================================
   Blog – výpis článků, detail článku, ukázka na úvodní stránce.
   Články jsou v content/blog/posts.js (window.BLOG_POSTS), zapisuje je administrace.
   Tento soubor načítá i admin.html kvůli čištění HTML (PV.blog.sanitize).
   ========================================================================== */
(function () {
  'use strict';

  const S = window.SITE;
  const PV = window.PV;
  if (!S || !PV) return;

  const cfg = S.blog || {};
  const { esc, fmt, icon } = PV;
  const page = document.body.dataset.page || '';

  /* ---------- Čištění HTML (povolená je jen jednoduchá úprava textu) ---------- */
  const KEEP = new Set(['P', 'H2', 'H3', 'H4', 'STRONG', 'EM', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'BR', 'HR', 'A', 'IMG', 'FIGURE', 'FIGCAPTION']);
  const RENAME = { B: 'strong', I: 'em', DIV: 'p', H1: 'h2', H5: 'h4', H6: 'h4' };
  const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT']);

  function safeHref(url) {
    const u = String(url || '').trim();
    if (/^(mailto:|tel:)[^\s"'<>]+$/i.test(u)) return u;
    if (u.startsWith('#')) return u;
    return PV.safeUrl(u);
  }

  function sanitize(html, { allowData = false } = {}) {
    const doc = new DOMParser().parseFromString(`<body>${html || ''}`, 'text/html');
    const out = document.createElement('div');

    const walk = (src, dest) => {
      src.childNodes.forEach((node) => {
        if (node.nodeType === 3) { dest.appendChild(document.createTextNode(node.nodeValue)); return; }
        if (node.nodeType !== 1) return;
        const tag = node.tagName.toUpperCase();
        if (DROP.has(tag)) return;
        const name = RENAME[tag] || tag.toLowerCase();
        if (!KEEP.has(name.toUpperCase())) { walk(node, dest); return; } // neznámý prvek: necháme jen jeho obsah

        const el = document.createElement(name);
        if (name === 'a') {
          const href = safeHref(node.getAttribute('href'));
          if (!href) { walk(node, dest); return; }
          el.setAttribute('href', href);
          if (/^https?:/i.test(href)) { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
        } else if (name === 'img') {
          const src = PV.safeUrl(node.getAttribute('src'), { allowData });
          if (!src) return;
          el.setAttribute('src', src);
          el.setAttribute('alt', node.getAttribute('alt') || '');
          el.setAttribute('loading', 'lazy');
        }
        if (name !== 'img' && name !== 'br' && name !== 'hr') walk(node, el);
        dest.appendChild(el);
      });
    };
    walk(doc.body, out);

    // Samotný text na nejvyšší úrovni zabalíme do odstavce, prázdné odstavce zahodíme
    const BLOCK = new Set(['P', 'H2', 'H3', 'H4', 'UL', 'OL', 'BLOCKQUOTE', 'HR', 'FIGURE']);
    let run = null;
    Array.from(out.childNodes).forEach((n) => {
      const isBlock = n.nodeType === 1 && BLOCK.has(n.tagName);
      if (isBlock) { run = null; return; }
      if (n.nodeType === 3 && !n.nodeValue.trim()) { n.remove(); return; }
      if (!run) { run = document.createElement('p'); out.insertBefore(run, n); }
      run.appendChild(n);
    });
    out.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.querySelector('img')) p.remove();
    });
    return out.innerHTML;
  }

  /* ---------- Data ---------- */
  const all = () => (Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : []);
  const byDate = (a, b) => String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id));
  const published = () => all().filter((p) => p && p.published !== false && p.slug && p.title).sort(byDate);

  const slugify = (s) => String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'clanek';

  const dateLabel = (iso) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    if (!m) return '';
    return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const plain = (html) => {
    const d = document.createElement('div');
    d.innerHTML = String(html || '').replace(/<\/(p|h[1-6]|li|blockquote|div|figcaption)>/gi, ' </$1>').replace(/<br\s*\/?>/gi, ' ');
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  };
  const readMin = (html) => Math.max(1, Math.ceil(plain(html).split(' ').length / 200));
  const excerptOf = (p) => (p.excerpt && p.excerpt.trim()) || (plain(p.body).slice(0, 170).replace(/\s+\S*$/, '') + '…');
  const url = (p) => `clanek.html?c=${encodeURIComponent(p.slug)}`;
  const cover = (p) => PV.safeUrl(p.cover);

  /* ---------- Šablony ---------- */
  function card(p, i = 0) {
    const img = cover(p);
    const media = img
      ? `<img src="${esc(img)}" alt="${esc(p.coverAlt || '')}" loading="lazy" decoding="async">`
      : `<span class="blog-card__mark" aria-hidden="true">${PV.archMark()}</span>`;
    return `
    <article class="blog-card" data-reveal style="--d:${Math.min(i, 5) * 70}ms">
      <div class="blog-card__media">${media}</div>
      <div class="blog-card__body">
        <p class="blog-card__meta"><time datetime="${esc(p.date)}">${esc(dateLabel(p.date))}</time><span aria-hidden="true">·</span><span>${readMin(p.body)} min čtení</span></p>
        <h2 class="blog-card__title"><a href="${url(p)}">${PV.text(p.title)}</a></h2>
        <p class="blog-card__excerpt">${PV.text(excerptOf(p))}</p>
        <span class="link-arrow" aria-hidden="true"><span class="link-arrow__text">Číst článek</span><span class="link-arrow__icon">${icon('arrow-right')}</span></span>
      </div>
    </article>`;
  }

  const back = (label, href) => `<a class="link-arrow link-arrow--back" href="${href}"><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-left')}</span><span class="link-arrow__text">${esc(label)}</span></a>`;

  function renderList() {
    const posts = published();
    return `
    <section class="blog-page">
      <div class="container">
        <header class="blog-head">
          <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span><span>${esc(cfg.eyebrow || 'Blog')}</span></p>
          <h1 class="h2" data-reveal>${fmt(cfg.title || 'Blog')}</h1>
          <p class="blog-head__intro" data-reveal style="--d:100ms">${fmt(cfg.intro || '')}</p>
        </header>
        ${posts.length
    ? `<div class="blog-grid">${posts.map(card).join('')}</div>`
    : `<div class="blog-empty" data-reveal>${PV.archMark('blog-empty__mark')}<h2>${esc(cfg.emptyTitle || 'Články se připravují')}</h2><p>${fmt(cfg.emptyText || '')}</p><a class="btn btn--primary" href="index.html#rezervace" data-book><span>${esc(S.navCta)}</span><span class="btn__icon" aria-hidden="true">${icon('arrow-right')}</span></a></div>`}
      </div>
    </section>`;
  }

  function renderPost() {
    const slug = new URLSearchParams(window.location.search).get('c');
    const list = published();
    const p = list.find((x) => x.slug === slug);
    if (!p) {
      document.title = `Článek nenalezen – ${S.brand.name}`;
      return `
      <section class="blog-page">
        <div class="container">
          <div class="blog-empty" data-reveal>${PV.archMark('blog-empty__mark')}<h1>Tento článek jsem nenašla</h1><p>Možná byl přesunut nebo odstraněn. Podívejte se na ostatní články.</p>${back('Všechny články', 'blog.html')}</div>
        </div>
      </section>`;
    }

    const lead = excerptOf(p);
    document.title = `${p.title} – ${S.brand.name}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', lead);
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, datePublished: p.date,
      description: lead, image: cover(p) || undefined, author: { '@type': 'Person', name: S.brand.name },
    });
    document.head.appendChild(ld);

    const img = cover(p);
    const others = list.filter((x) => x.slug !== p.slug).slice(0, 2);
    return `
    <article class="post">
      <div class="container post__wrap">
        ${back('Všechny články', 'blog.html')}
        <header class="post__head">
          <p class="post__meta"><time datetime="${esc(p.date)}">${esc(dateLabel(p.date))}</time><span aria-hidden="true">·</span><span>${readMin(p.body)} min čtení</span></p>
          <h1 class="h2 post__title">${PV.text(p.title)}</h1>
          ${lead ? `<p class="post__lead">${PV.text(lead)}</p>` : ''}
        </header>
        ${img ? `<figure class="post__cover"><img src="${esc(img)}" alt="${esc(p.coverAlt || '')}" decoding="async"></figure>` : ''}
        <div class="prose">${sanitize(p.body)}</div>
        <aside class="post__cta">
          <div>
            <h2>${esc(cfg.ctaTitle || 'Chcete to probrat osobně?')}</h2>
            <p>${esc(cfg.ctaText || '')}</p>
          </div>
          <a class="btn btn--primary" href="index.html#rezervace" data-book><span>${esc(S.navCta)}</span><span class="btn__icon" aria-hidden="true">${icon('arrow-right')}</span></a>
        </aside>
      </div>
      ${others.length ? `<div class="container post__more"><h2 class="post__more-title">Další články</h2><div class="blog-grid blog-grid--two">${others.map(card).join('')}</div></div>` : ''}
    </article>`;
  }

  // Ukázka na úvodní stránce – bez článků se nezobrazí vůbec
  function teaser(eyebrowHtml) {
    const posts = published().slice(0, 3);
    if (!posts.length) return '';
    return `
<section class="section blog-teaser" id="blog" aria-labelledby="blog-title">
  <div class="container">
    <header class="section-head section-head--split">
      <div>${eyebrowHtml}<h2 class="h2" id="blog-title" data-reveal>${fmt(cfg.teaserTitle || 'Blog')}</h2></div>
      <div class="section-head__intro" data-reveal style="--d:120ms"><p>${fmt(cfg.teaserText || '')}</p><a class="link-arrow" href="blog.html"><span class="link-arrow__text">${esc(cfg.allLabel || 'Všechny články')}</span><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-right')}</span></a></div>
    </header>
    <div class="blog-grid">${posts.map(card).join('')}</div>
  </div>
</section>`;
  }

  PV.blog = { sanitize, slugify, published, hasPosts: () => published().length > 0, teaser, dateLabel };

  const main = document.getElementById('main');
  if (main && page === 'blog') main.innerHTML = renderList();
  if (main && page === 'post') main.innerHTML = renderPost();
})();
