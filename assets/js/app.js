/* ==========================================================================
   Vykreslení webu z obsahu (content/site.js) a interakce.
   Texty se upravují v obsahovém souboru – tady je jen šablona a chování.
   ========================================================================== */
(function () {
  'use strict';

  const S = window.SITE;
  const PV = window.PV;
  if (!S || !PV) return;

  const { $, $$, esc, fmt, icon, media } = PV;
  const page = document.body.dataset.page || 'home';
  const isHome = page === 'home';
  const proto = !!(S.settings && S.settings.prototype);
  const on = (key) => !S.settings || S.settings[key] !== false;
  const C = S.contact;

  // Sekce, které lze vypnout v settings – jejich odkazy v navigaci se pak skryjí
  const optional = { 'proc-se-mnou': 'showWhy', tym: 'showTeam', kalkulacka: 'showTools', reference: 'showTestimonials', otazky: 'showFaq' };
  const hasPosts = !!(PV.blog && PV.blog.hasPosts());
  const navItems = S.nav
    .filter((n) => !optional[n.target] || on(optional[n.target]))
    .filter((n) => !n.needsPosts || hasPosts);
  const mainNav = navItems.filter((n) => n.main);

  const href = (id) => (isHome ? '#' : 'index.html#') + id;
  const notesOn = proto && PV.store.get('pv_notes') === true;
  if (notesOn) document.documentElement.classList.add('show-notes');

  /* ---------- Malé šablony ---------- */
  const note = (t) => (proto && t ? `<aside class="proto-note">${icon('edit')}<span><strong>Poznámka k návrhu:</strong> ${fmt(t)}</span></aside>` : '');

  let sectionNo = 0;
  const eyebrow = (label) => {
    sectionNo += 1;
    return `<p class="eyebrow"><span class="eyebrow__idx">${PV.pad(sectionNo)}</span><span class="eyebrow__line" aria-hidden="true"></span><span>${esc(label)}</span></p>`;
  };

  const btn = (label, { to = '#', cls = 'btn--primary', iconName = 'arrow-right', attrs = '' } = {}) =>
    `<a class="btn ${cls}" href="${to}" ${attrs}><span>${esc(label)}</span><span class="btn__icon" aria-hidden="true">${icon(iconName)}</span></a>`;

  const linkArrow = (label, to, attrs = '', iconName = 'arrow-right') =>
    `<a class="link-arrow" href="${to}" ${attrs}><span class="link-arrow__text">${esc(label)}</span><span class="link-arrow__icon" aria-hidden="true">${icon(iconName)}</span></a>`;

  // Odkaz, který zatím nemá cíl → po kliknutí vysvětlí, co se doplní
  const extLink = (url, phMessage) => {
    const safe = PV.safeUrl(url);
    return safe ? `href="${esc(safe)}" target="_blank" rel="noopener"` : `href="#" data-ph-link="${esc(phMessage)}"`;
  };

  const social = (id) => S.social.find((s) => s.id === id) || {};
  const socialLink = (s) => extLink(s.url, `Odkaz na ${s.label} doplníme, jakmile bude znám profil.`);

  const phoneValue = () => (C.phoneHref ? `<a href="tel:${esc(C.phoneHref)}" data-track="contact_phone">${fmt(C.phone)}</a>` : fmt(C.phone));
  const emailValue = () => (C.emailHref ? `<a href="mailto:${esc(C.emailHref)}" data-track="contact_email">${fmt(C.email)}</a>` : fmt(C.email));

  const logo = () =>
    `<a class="logo" href="${isHome ? '#uvod' : 'index.html'}" aria-label="${esc(S.brand.name)}, ${esc(S.brand.role.toLowerCase())} – na úvod">${PV.archMark('logo__mark')}<span class="logo__text"><span class="logo__name">${esc(S.brand.name)}</span><span class="logo__role">${esc(S.brand.role)}</span></span></a>`;

  const phBlock = (t) => (PV.isPh(t)
    ? `<div class="ph-block" data-reveal>${icon('edit')}<p style="margin:0">${PV.text(PV.stripPh(t))}</p></div>`
    : `<p data-reveal>${fmt(t)}</p>`);

  const sectionHead = (eyebrowText, title, intro, id) => `
    <header class="section-head section-head--split">
      <div>${eyebrow(eyebrowText)}<h2 class="h2" id="${id}" data-reveal>${fmt(title)}</h2></div>
      <p class="section-head__intro" data-reveal style="--d:120ms">${fmt(intro)}</p>
    </header>`;

  // Nadpis rozdělený na slova kvůli úvodní animaci; slovo v *hvězdičkách* se může střídat s dalšími (rotate)
  function splitWords(title, rotate) {
    let i = 0;
    return String(title).split(/(\*[^*]+\*)/g).filter(Boolean).map((part) => {
      const italic = part.startsWith('*') && part.endsWith('*');
      if (italic && rotate && rotate.length) {
        const html = rotator(part.slice(1, -1), rotate, i);
        if (html) { i += 1; return html; }
      }
      return (italic ? part.slice(1, -1) : part).split(/(\s+)/).map((w) => {
        if (!w.trim()) return w ? ' ' : '';
        const inner = italic ? `<em>${esc(w)}</em>` : esc(w);
        return `<span class="w"><span style="--i:${i++}">${inner}</span></span>`;
      }).join('');
    }).join('');
  }

  // Střídající se slovo: první je vždy slovo z nadpisu, za ním slova z rotate
  function rotator(word, rotate, i) {
    const words = [word].concat(rotate.filter((w) => w && w !== word));
    if (words.length < 2) return '';
    const list = words.concat(words[0]).map((w) => `<em>${esc(w)}</em>`).join('');
    return `<span class="rot-wrap" style="--i:${i}"><span class="visually-hidden">${esc(word)}</span><span class="rot" aria-hidden="true"><span class="rot__in"><span class="rot__track" data-rot="${words.length}">${list}</span></span></span><svg class="rot-line" viewBox="0 0 220 16" preserveAspectRatio="none" aria-hidden="true"><path d="M4 11.5C46 6.6 110 3.9 216 6.3" pathLength="1"/><path class="rot-line__thin" d="M22 14.4C74 10.9 132 10 204 11.8" pathLength="1"/></svg></span>`;
  }

  /* ---------- Hlavička ---------- */
  function renderHeader() {
    const links = mainNav.map((n) => `<li><a class="nav__link${n.target === 'blog' && (page === 'blog' || page === 'post') ? ' is-active' : ''}" href="${n.url || href(n.target)}" data-nav="${esc(n.target)}">${esc(n.label)}</a></li>`).join('');
    return `
<a class="skip-link" href="#main">Přeskočit na obsah</a>
<header class="site-header" data-header>
  <div class="container header__inner">
    <div class="header__brand">
      ${logo()}
      ${proto ? renderProtoBadge() : ''}
    </div>
    <nav class="nav" aria-label="Hlavní navigace"><ul class="nav__list">${links}</ul></nav>
    ${btn(S.navCta, { to: href('rezervace'), cls: 'btn--primary btn--sm header__cta', attrs: 'data-book data-track="cta_header"' })}
    <button class="menu-toggle" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="mobile-menu" aria-label="Otevřít menu"><span class="menu-toggle__text" aria-hidden="true">Menu</span><span class="menu-toggle__lines" aria-hidden="true"><span></span><span></span></span></button>
  </div>
</header>`;
  }

  function renderProtoBadge() {
    return `
<div class="proto">
  <button class="proto__badge" type="button" aria-expanded="false" aria-controls="proto-panel"><span class="proto__dot" aria-hidden="true"></span><span class="proto__label">Prototyp</span></button>
  <div class="proto__panel" id="proto-panel" hidden>
    <p class="proto__title">Designový prototyp</p>
    <p class="proto__text">Fotografie, texty a údaje jsou zástupné – <span class="ph">takto zvýrazněné</span> části doplníme po ověření s klientkou. Rezervace a formuláře běží v ukázkovém režimu.</p>
    <div class="proto__row"><label class="switch"><input type="checkbox" data-proto-notes${notesOn ? ' checked' : ''}><span class="switch__track" aria-hidden="true"></span><span>Zobrazit poznámky k návrhu</span></label></div>
    <ul class="proto__list">
      <li><button class="proto__action" type="button" data-open-consent>${icon('cookie')}Znovu zobrazit nastavení cookies</button></li>
      <li><button class="proto__action" type="button" data-proto-reset>${icon('refresh')}Vymazat uložená demo data</button></li>
    </ul>
  </div>
</div>`;
  }

  /* ---------- Úvod ---------- */
  function renderHero() {
    const h = S.hero;
    return `
<section class="hero" id="uvod" aria-labelledby="hero-title">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow hero__eyebrow hero__fade"><span class="eyebrow__line" aria-hidden="true"></span><span>${fmt(h.eyebrow)}</span></p>
      <h1 class="hero__title" id="hero-title">${splitWords(h.title, h.rotate)}</h1>
      <p class="hero__text hero__fade" style="--d:520ms">${fmt(h.text)}</p>
      <div class="hero__actions hero__fade" style="--d:660ms">
        ${btn(h.primaryCta, { to: href('rezervace'), attrs: 'data-book data-track="cta_hero_primary"' })}
        ${linkArrow(h.secondaryCta, href('sluzby'), 'data-track="cta_hero_secondary"', 'arrow-down')}
      </div>
    </div>

    <div class="hero__visual">
      <div class="hero__frame">
        <div class="hero__arch-line" aria-hidden="true">
          <svg viewBox="0 0 400 500" preserveAspectRatio="none" fill="none"><path d="M1 500V200a199 199 0 0 1 398 0v300" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" pathLength="1"/></svg>
        </div>
        ${media(h.portrait, { ratio: '4/5', shape: 'arch', className: 'hero__portrait', eager: true })}
      </div>
      <div class="hero__card">
        <div class="hero__card-head"><span class="hero__card-icon" aria-hidden="true">${icon('calendar')}</span><p class="hero__card-title">${esc(h.card.title)}</p></div>
        <p class="hero__card-text">${fmt(h.card.text)}</p>
        ${linkArrow(h.card.cta, href('rezervace'), 'data-book data-track="cta_hero_card"')}
      </div>
      <p class="hero__vertical" aria-hidden="true">${esc(S.brand.role)} – ${esc(PV.stripPh(S.brand.city))}</p>
    </div>
  </div>
  <div class="container">${note(h.note)}</div>
</section>`;
  }

  /* ---------- Služby ---------- */
  function renderServices() {
    const s = S.services;
    const situations = s.situations && s.situations.length ? `
    <div class="situations" data-reveal>
      <p class="situations__title">${esc(s.situationsTitle)}</p>
      <ul class="situations__list" role="list">${s.situations.map((x) => `<li class="situations__chip">${esc(x)}</li>`).join('')}</ul>
    </div>
    ${note(s.situationsNote)}` : '';
    return `
<section class="section services" id="sluzby" aria-labelledby="services-title">
  <div class="container">
    ${sectionHead(s.eyebrow, s.title, s.intro, 'services-title')}
    ${note(s.note)}
    <div class="services__grid">
      ${s.items.map((it, i) => `
      <article class="service-card" data-reveal data-stack style="--d:${(i % 2) * 120}ms;--n:${i}">
        <div class="service-card__top"><span class="service-card__num">${PV.pad(i + 1)}</span><span class="service-card__line" aria-hidden="true"></span>${it.tag ? `<span class="service-card__tag">${esc(it.tag)}</span>` : ''}</div>
        <h3 class="service-card__title">${fmt(it.title)}</h3>
        <p class="service-card__text">${fmt(it.text)}</p>
        <div class="service-card__more">
          <button class="service-card__toggle" type="button" aria-expanded="false" aria-controls="svc-${esc(it.id)}">${esc(s.detailsLabel)}<span class="plus" aria-hidden="true"></span></button>
          <div class="service-card__details" id="svc-${esc(it.id)}"><div><ul class="service-card__list">${it.points.map((p) => `<li>${fmt(p)}</li>`).join('')}</ul></div></div>
        </div>
        <div class="service-card__cta">${linkArrow(s.cta, href('rezervace'), `data-book data-book-topic="${esc(it.id)}" data-track="cta_service" aria-label="${esc(s.cta)}: ${esc(it.title)}"`)}</div>
      </article>`).join('')}
    </div>
    ${situations}
  </div>
</section>`;
  }

  /* ---------- Proč se mnou (volitelné) ---------- */
  function renderWhy() {
    if (!on('showWhy') || !S.why) return '';
    const w = S.why;
    const rows = w.rows.map((r) => `
          <tr>
            <th scope="row">${esc(r.label)}</th>
            <td class="why__self"><span class="why__icon" aria-hidden="true">${icon('minus')}</span><span class="visually-hidden">${esc(w.selfLabel)}: </span>${fmt(r.self)}</td>
            <td class="why__me"><span class="why__icon" aria-hidden="true">${icon('check')}</span><span class="visually-hidden">${esc(w.meLabel)}: </span>${fmt(r.me)}</td>
          </tr>`).join('');
    return `
<section class="section section--ink why" id="proc-se-mnou" aria-labelledby="why-title">
  <div class="container">
    ${sectionHead(w.eyebrow, w.title, w.intro, 'why-title')}
    ${note(w.note)}
    <p class="why__legend" aria-hidden="true"><span>${icon('minus')}${esc(w.selfLabel)}</span><span>${icon('check')}${esc(w.meLabel)}</span></p>
    <div class="why__wrap" data-reveal>
      <table class="why__table">
        <caption class="visually-hidden">Srovnání: ${esc(w.selfLabel)} a ${esc(w.meLabel)}</caption>
        <thead><tr><td></td><th scope="col">${esc(w.selfLabel)}</th><th scope="col" class="why__me-head">${PV.archMark('why__mark')}${esc(w.meLabel)}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="why__cards" data-reveal data-why-cards>
      <ul class="why__track" role="list" aria-label="Srovnání: ${esc(w.selfLabel)} a ${esc(w.meLabel)}">
        ${w.rows.map((r) => `
        <li class="why-card">
          <p class="why-card__label">${esc(r.label)}</p>
          <div class="why-card__cols">
            <div class="why-card__col why-card__col--self"><p class="why-card__who">${esc(w.selfLabel)}</p><p class="why-card__text">${fmt(r.self)}</p></div>
            <div class="why-card__col why-card__col--me"><p class="why-card__who">${PV.archMark('why__mark')}${esc(w.meLabel)}</p><p class="why-card__text">${fmt(r.me)}</p></div>
          </div>
        </li>`).join('')}
      </ul>
      <div class="why__dots" aria-hidden="true">${w.rows.map((_, i) => `<span class="why__dot${i === 0 ? ' is-on' : ''}"></span>`).join('')}</div>
    </div>
  </div>
</section>
<section class="section banks-section" aria-label="${esc(w.banksTitle)}">
  <div class="container">
    <div class="banks" data-reveal>
      <p class="banks__title">${esc(w.banksTitle)}</p>
      <ul class="banks__list" role="list">${w.banks.map((b) => `<li class="banks__logo"><img src="${esc(b.logo)}" alt="${esc(b.name)}" loading="lazy" decoding="async"></li>`).join('')}</ul>
      ${w.banksNote ? `<p class="banks__note"><span class="ph">${PV.text(w.banksNote)}</span></p>` : ''}
    </div>
  </div>
</section>`;
  }

  /* ---------- O mně ---------- */
  function renderAbout() {
    const a = S.about;
    return `
<section class="section section--sand about" id="o-mne" aria-labelledby="about-title">
  <div class="container about__grid">
    <div class="about__visual" data-reveal>
      ${media(a.portrait, { ratio: '3/4', shape: 'arch', className: 'about__portrait' })}
    </div>
    <div class="about__content">
      ${eyebrow(a.eyebrow)}
      <h2 class="h2" id="about-title" data-reveal>${fmt(a.title)}</h2>
      <p class="about__lead" data-reveal>${fmt(a.lead)}</p>
      ${a.paragraphs.map((p) => `<p data-reveal>${fmt(p)}</p>`).join('')}
      ${phBlock(a.story)}
      <blockquote class="about__quote" data-reveal><p>„${PV.text(a.quote)}“</p></blockquote>
      <ul class="values">
        ${a.values.map((v, i) => `<li class="value" data-reveal style="--d:${i * 90}ms"><span class="value__num">${PV.pad(i + 1)}</span><div><h3 class="value__title">${fmt(v.title)}</h3><p class="value__text">${fmt(v.text)}</p></div></li>`).join('')}
      </ul>
      <div class="about__sign" data-reveal>
        <p class="signature">${esc(a.signature)}<small>${esc(S.brand.role)}</small></p>
        ${btn(a.cta, { to: href('rezervace'), cls: 'btn--ghost', attrs: 'data-book data-track="cta_about"' })}
      </div>
      ${note(a.note)}
    </div>
  </div>
</section>`;
  }

  /* ---------- Tým (volitelné) ---------- */
  function renderTeam() {
    if (!on('showTeam')) return '';
    const t = S.team;
    return `
<section class="section section--sand team" id="tym" aria-labelledby="team-title">
  <div class="container"><div class="team__inner">
    ${sectionHead(t.eyebrow, t.title, t.intro, 'team-title')}
    ${note(t.note)}
    <div class="team__grid${t.members.length === 1 ? ' team__grid--single' : ''}">
      ${t.members.map((m, i) => `
      <article class="member" data-reveal style="--d:${i * 110}ms">
        ${media(m.photo, { ratio: '4/5' })}
        <h3 class="member__name">${fmt(m.name)}</h3>
        <p class="member__role">${fmt(m.role)}</p>
        <p class="member__text">${fmt(m.text)}</p>
      </article>`).join('')}
    </div>
  </div></div>
</section>`;
  }

  /* ---------- Spolupráce ---------- */
  function renderProcess() {
    const p = S.process;
    const sparkle = icon('sparkle');
    return `
<section class="section process" id="spoluprace" aria-labelledby="process-title">
  <div class="container process__grid">
    <div class="process__intro">
      ${eyebrow(p.eyebrow)}
      <h2 class="h2" id="process-title" data-reveal>${fmt(p.title)}</h2>
      <p data-reveal>${fmt(p.intro)}</p>
      <div data-reveal>${btn(p.cta, { to: href('rezervace'), attrs: 'data-book data-track="cta_process"' })}</div>
    </div>
    <ol class="process__steps" data-process>
      ${p.steps.map((s, i) => `
      <li class="step" data-reveal>
        <span class="step__num" aria-hidden="true">${PV.pad(i + 1)}</span>
        <h3 class="step__title"><span class="visually-hidden">Krok ${i + 1}: </span>${fmt(s.title)}</h3>
        <p class="step__text">${fmt(s.text)}</p>
        <p class="step__tip">${sparkle}${fmt(s.tip)}</p>
      </li>`).join('')}
    </ol>
  </div>
</section>`;
  }

  /* ---------- Kalkulačka a hlídání fixace (volitelné) ---------- */
  const MONTHS = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

  function renderTools() {
    if (!on('showTools') || !S.calculator) return '';
    const c = S.calculator;
    const slider = (key) => {
      const o = c[key];
      return `
        <div class="calc__field">
          <div class="calc__row">
            <label class="calc__label" for="calc-${key}">${esc(o.label)}${key === 'rate' ? ` <span class="calc__hint">(${esc(c.rateNote)})</span>` : ''}</label>
            <span class="calc__value" data-out="${key}"></span>
          </div>
          <input class="range" type="range" id="calc-${key}" min="${o.min}" max="${o.max}" step="${o.step}" value="${o.value}" data-calc="${key}">
          <div class="calc__scale" aria-hidden="true"><span data-min="${key}"></span><span data-max="${key}"></span></div>
        </div>`;
    };
    return `
<section class="section section--sand tools" id="kalkulacka" aria-labelledby="tools-title">
  <div class="container">
    ${sectionHead(c.eyebrow, c.title, c.intro, 'tools-title')}
    ${note(c.note)}
    <div class="tools__grid">
      <div class="calc" data-reveal data-calculator>
        <div class="calc__layout">
          <div class="calc__inputs">
            <p class="calc__title">${icon('calculator')}${esc(c.cardTitle)}</p>
            ${slider('amount')}${slider('years')}${slider('rate')}
          </div>
          <div class="calc__result">
            <p class="calc__result-label">Měsíční splátka</p>
            <p class="calc__payment" data-out="payment">–</p>
            <dl class="calc__stats">
              <div><dt>Celkem zaplatíte</dt><dd data-out="total"></dd></div>
              <div><dt>Z toho úroky</dt><dd data-out="interest"></dd></div>
            </dl>
            <div class="calc__bar" aria-hidden="true"><span class="calc__bar-principal" data-bar="principal"></span><span class="calc__bar-interest" data-bar="interest"></span></div>
            <p class="calc__legend" aria-hidden="true"><span><i class="calc__dot calc__dot--principal"></i>Jistina</span><span><i class="calc__dot calc__dot--interest"></i>Úroky</span></p>
            <p class="calc__sens" data-out="sens"></p>
            ${btn(c.cta, { to: href('rezervace'), attrs: 'data-book data-track="cta_calculator"' })}
            <p class="calc__disclaimer">${fmt(c.disclaimer)}</p>
            <p class="visually-hidden" aria-live="polite" data-calc-live></p>
          </div>
        </div>
      </div>
      ${S.fixWatch ? renderFixWatch() : ''}
    </div>
  </div>
</section>`;
  }

  function renderFixWatch() {
    const f = S.fixWatch;
    const year = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => ({ id: String(year + i), label: String(year + i) }));
    const months = MONTHS.map((m, i) => ({ id: String(i + 1), label: m }));
    return `
      <div class="fixwatch" data-reveal style="--d:140ms">
        <div data-fw-body>
          <span class="fixwatch__icon" aria-hidden="true">${icon('bell')}</span>
          <h3 class="fixwatch__title">${fmt(f.title)}</h3>
          <p class="fixwatch__text">${fmt(f.text)}</p>
          <form class="fixwatch__form" novalidate data-fw-form>
            ${PV.field({ id: 'fw-email', name: 'email', label: 'E-mail', type: 'email', required: true, autocomplete: 'email', validate: 'email' })}
            <div class="fixwatch__row">
              ${PV.field({ id: 'fw-month', name: 'month', label: 'Fixace končí – měsíc', required: true, options: months })}
              ${PV.field({ id: 'fw-year', name: 'year', label: 'Rok', required: true, options: years })}
            </div>
            <div class="field">
              <label class="check"><input type="checkbox" id="fw-consent" name="consent" required aria-required="true" data-field aria-describedby="fw-consent-error"><span>${esc(f.consent)} Více v <a href="ochrana-osobnich-udaju.html">zásadách ochrany osobních údajů</a>.</span></label>
              <p class="field__error" id="fw-consent-error"></p>
            </div>
            <div class="hp-field" aria-hidden="true"><label for="fw-company">Toto pole nevyplňujte</label><input id="fw-company" name="company" tabindex="-1" autocomplete="off"></div>
            <button class="btn btn--light btn--block" type="submit"><span>${esc(f.cta)}</span><span class="btn__icon" aria-hidden="true">${icon('arrow-right')}</span></button>
          </form>
        </div>
        <div class="fixwatch__success" data-fw-success tabindex="-1" hidden>
          ${PV.checkSvg()}
          <h3>Fixaci máme pod dohledem</h3>
          <p>${esc(f.success)}</p>
          <button class="btn btn--light btn--sm btn--noicon" type="button" data-fw-reset>Zadat další fixaci</button>
        </div>
      </div>`;
  }

  /* ---------- Rezervace ---------- */
  function renderBooking() {
    const b = S.booking;
    const row = (kind) => {
      const isPhone = kind === 'phone';
      const hasHref = isPhone ? C.phoneHref : C.emailHref;
      const inner = `<span class="alt-contact__icon" aria-hidden="true">${icon(isPhone ? 'phone' : 'mail')}</span><span>${fmt(isPhone ? C.phone : C.email)}</span>`;
      return hasHref
        ? `<a class="alt-contact" href="${isPhone ? 'tel:' : 'mailto:'}${esc(hasHref)}" data-track="contact_${kind}">${inner}</a>`
        : `<p class="alt-contact">${inner}</p>`;
    };
    return `
<section class="section section--ink booking-section" id="rezervace" aria-labelledby="booking-title">
  <div class="container booking-section__grid">
    <div class="booking-section__intro">
      ${eyebrow(b.eyebrow)}
      <h2 class="h2" id="booking-title" data-reveal>${fmt(b.title)}</h2>
      <p class="booking-section__lead" data-reveal>${fmt(b.intro)}</p>
    </div>
    <div class="booking-section__widget" data-reveal style="--d:150ms"><div id="booking-widget"></div></div>
    <div class="booking-section__aside">
      <p class="expect__title">${esc(b.expectTitle)}</p>
      <ul class="expect">${b.expect.map((e, i) => `<li data-reveal style="--d:${i * 90}ms"><span class="expect__icon" aria-hidden="true">${icon('check')}</span><span>${fmt(e)}</span></li>`).join('')}</ul>
      <div class="alt-contacts" data-reveal>
        <p class="alt-contacts__title">${esc(b.altTitle)}</p>
        ${row('phone')}
        ${row('mail')}
      </div>
      ${note(b.note)}
    </div>
  </div>
</section>`;
  }

  /* ---------- Ze života poradkyně – odkaz na Instagram ---------- */
  function renderInsta() {
    const i = S.insta;
    if (!i) return '';
    const ig = social('instagram');
    const li = social('linkedin');
    return `
<section class="section insta" id="ze-zivota" aria-labelledby="insta-title">
  <div class="container insta__grid">
    <div class="insta__text">
      ${eyebrow(i.eyebrow)}
      <h2 class="h2" id="insta-title" data-reveal>${fmt(i.title)}</h2>
      <p data-reveal>${fmt(i.text)}</p>
      <div class="insta__actions" data-reveal>
        <a class="btn btn--primary" ${socialLink(ig)} data-track="social_instagram"><span>${esc(ig.cta)}</span><span class="btn__icon" aria-hidden="true">${icon('instagram')}</span></a>
        ${li.label ? `<a class="link-arrow" ${socialLink(li)} data-track="social_linkedin"><span class="link-arrow__text">${esc(li.cta)}</span><span class="link-arrow__icon" aria-hidden="true">${icon('linkedin')}</span></a>` : ''}
      </div>
      ${note(i.note)}
    </div>
    <a class="ig-card" ${socialLink(ig)} data-track="social_instagram_card" data-reveal style="--d:140ms" aria-label="${esc(ig.cta)}: ${esc(PV.stripPh(ig.handle))}">
      <span class="ig-card__head">
        <span class="ig-card__avatar" aria-hidden="true"><span>${PV.archMark()}</span></span>
        <span class="ig-card__who">
          <span class="ig-card__handle">${fmt(ig.handle)}</span>
          <span class="ig-card__name">${esc(S.brand.name)}</span>
          <span class="ig-card__bio">${esc(i.bio)}</span>
        </span>
        <span class="ig-card__follow" aria-hidden="true">Sledovat</span>
      </span>
      <span class="ig-card__highlights" aria-hidden="true">
        ${i.highlights.map((h) => `<span class="ig-card__hl"><span class="ig-card__ring">${icon(h.icon)}</span>${esc(h.label)}</span>`).join('')}
      </span>
      <span class="ig-card__tiles" aria-hidden="true"><span class="ig-card__tile ig-card__tile--navy"></span><span class="ig-card__tile ig-card__tile--sand"></span><span class="ig-card__tile ig-card__tile--copper"></span></span>
    </a>
  </div>
</section>`;
  }

  function renderBlogTeaser() {
    return PV.blog ? PV.blog.teaser(eyebrow((S.blog || {}).teaserEyebrow || 'Blog')) : '';
  }

  /* ---------- Reference (volitelné) ---------- */
  function reviewLink(link) {
    const url = PV.safeUrl(link.url);
    return `<a class="link-arrow" ${url ? `href="${esc(url)}" target="_blank" rel="noopener"` : 'href="#" data-ph-link="Odkaz na hodnocení (např. Google profil firmy) doplníme po jeho založení."'} data-track="review_link"><span class="link-arrow__text">${esc(link.label)}</span><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-up-right')}</span></a>`;
  }

  function renderTestimonials() {
    if (!on('showTestimonials')) return '';
    const t = S.testimonials;
    const mark = '<svg class="t-card__mark" viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="M0 32V19.6C0 8.7 5.6 2 15.6 0l1.6 4.2C11.4 6 8.6 9.7 8.4 15H16v17zm22.8 0V19.6C22.8 8.7 28.4 2 38.4 0L40 4.2C34.2 6 31.4 9.7 31.2 15h7.6v17z"/></svg>';
    return `
<section class="section section--sand testimonials" id="reference" aria-labelledby="t-title">
  <div class="container">
    ${sectionHead(t.eyebrow, t.title, t.intro, 't-title')}
    ${note(t.note)}
  </div>
  <div class="t-marquee" data-marquee data-reveal role="region" aria-label="Reference klientů – posouvejte do stran, najetím myší se pás zastaví" tabindex="0">
    <div class="t-track">
      ${t.items.map((it) => `
      <figure class="t-card">
        ${mark}
        <blockquote class="t-card__text"><p>${PV.text(it.text || t.placeholder)}</p></blockquote>
        <figcaption class="t-card__meta">
          <span class="t-card__who"><span class="t-card__name">${fmt(it.name)}</span><span class="t-card__context">${fmt(it.context)}</span></span>
          <span class="t-card__source">${fmt(it.source)}</span>
        </figcaption>
      </figure>`).join('')}
    </div>
  </div>
  <div class="container">
    <div class="testimonials__foot" data-reveal>
      <p class="testimonials__ask">${fmt(t.ask)}</p>
      ${reviewLink(t.reviewLink)}
    </div>
  </div>
</section>`;
  }

  /* ---------- Časté otázky (volitelné) ---------- */
  function renderFaq() {
    if (!on('showFaq') || !S.faq) return '';
    const f = S.faq;
    return `
<section class="section faq" id="otazky" aria-labelledby="faq-title">
  <div class="container faq__grid">
    <div class="faq__intro">
      ${eyebrow(f.eyebrow)}
      <h2 class="h2" id="faq-title" data-reveal>${fmt(f.title)}</h2>
      <p data-reveal>${fmt(f.intro)}</p>
      <div class="faq__actions" data-reveal>
        ${btn(S.navCta, { to: href('rezervace'), attrs: 'data-book data-track="cta_faq"' })}
        ${linkArrow('Kontakty', href('kontakt'), 'data-track="faq_contact"')}
      </div>
      ${note(f.note)}
    </div>
    <div class="faq__list">
      ${f.items.map((it, i) => `
      <details class="faq__item" name="faq" data-reveal style="--d:${Math.min(i, 5) * 60}ms">
        <summary class="faq__q"><span>${fmt(it.q)}</span><span class="plus" aria-hidden="true"></span></summary>
        <div class="faq__a">${PV.isPh(it.a) ? `<p class="ph-inline"><span class="ph">${PV.text(PV.stripPh(it.a))}</span></p>` : `<p>${fmt(it.a)}</p>`}</div>
      </details>`).join('')}
    </div>
  </div>
  <div class="container">
    <div class="glossary-teaser" data-reveal>
      <div>
        <h3 class="glossary-teaser__title">${esc(f.glossaryTitle)}</h3>
        <p class="glossary-teaser__text">${fmt(f.glossaryText)}</p>
      </div>
      ${btn(f.glossaryCta, { to: 'slovnicek.html', cls: 'btn--ghost', attrs: 'data-track="glossary_open"' })}
    </div>
  </div>
</section>`;
  }

  /* ---------- Slovníček pojmů (podstránka) ---------- */
  function renderGlossaryPage() {
    const f = S.faq || { glossary: [] };
    return `
<section class="blog-page">
  <div class="container">
    <a class="link-arrow link-arrow--back" href="index.html#otazky"><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-left')}</span><span class="link-arrow__text">Zpět na časté otázky</span></a>
    <header class="blog-head">
      <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span><span>Srozumitelně</span></p>
      <h1 class="h2" data-reveal>${esc(f.glossaryTitle)}</h1>
      <p class="blog-head__intro" data-reveal style="--d:100ms">${fmt(f.glossaryIntro || '')}</p>
    </header>
    <dl class="glossary__list glossary__list--page">${f.glossary.map((g, i) => `<div class="glossary__item" data-reveal style="--d:${Math.min(i, 5) * 60}ms"><dt>${esc(g.term)}</dt><dd>${PV.text(g.def)}</dd></div>`).join('')}</dl>
    <div class="post__cta">
      <div><h2>Něco tu chybí?</h2><p>Zeptejte se mě, vysvětlím vám to osobně a bez zkratek.</p></div>
      ${btn(S.navCta, { to: href('rezervace'), attrs: 'data-book data-track="cta_glossary"' })}
    </div>
  </div>
</section>`;
  }

  /* ---------- Kancelář a kontakt ---------- */
  const mapArt = `
    <svg class="map__art" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="400" fill="#E4EBD8"/>
      <g fill="#D8E2C8">
        <rect x="30" y="24" width="180" height="120" rx="12"/><rect x="250" y="24" width="140" height="78" rx="12"/>
        <rect x="500" y="20" width="230" height="96" rx="12"/><rect x="40" y="246" width="210" height="126" rx="12"/>
        <rect x="300" y="236" width="150" height="150" rx="12"/><rect x="610" y="232" width="170" height="146" rx="12"/>
        <rect x="250" y="126" width="120" height="50" rx="10"/>
      </g>
      <path d="M470 140c44-22 120-12 140 22s-12 74-64 74-118-12-118-44 0-36 42-52z" fill="#CFDDB6"/>
      <path d="M-20 334C120 302 186 372 324 352S566 262 820 304" stroke="#CBD3D2" stroke-width="22" fill="none" stroke-linecap="round"/>
      <g stroke="#FDFEFC" stroke-linecap="round" fill="none">
        <path d="M0 200H800" stroke-width="16"/><path d="M432 0V400" stroke-width="14"/>
        <path d="M228 0 300 400" stroke-width="9"/><path d="M0 116c200 22 300-30 432 4s268 48 368 28" stroke-width="8"/>
        <path d="M560 200 720 400" stroke-width="7"/><path d="M110 200 86 400" stroke-width="6"/>
      </g>
    </svg>`;

  function detail(iconName, label, value) {
    return `<div class="detail"><span class="detail__icon" aria-hidden="true">${icon(iconName)}</span><div><p class="detail__label">${esc(label)}</p><p class="detail__value">${value}</p></div></div>`;
  }

  function officePanel(o, i, multi) {
    const c = S.contactSection;
    const call = C.phoneHref
      ? linkArrow(c.callCta, `tel:${esc(C.phoneHref)}`, 'data-track="contact_phone_cta"', 'phone')
      : '';
    return `
    <div class="office" id="office-${i}"${multi ? ` role="tabpanel" aria-labelledby="office-tab-${i}" tabindex="0"` : ''}${i > 0 ? ' hidden' : ''}>
      <div class="office__card">
        <h3 class="office__name">${fmt(o.name || c.officeTitle)}</h3>
        <div class="office__details">
          ${detail('pin', 'Adresa', `${fmt(o.street)}<br>${fmt(o.city)}<br><span class="detail__muted">${fmt(o.access)}</span>`)}
          ${detail('clock', 'Schůzky', fmt(o.hours))}
          ${detail('phone', 'Telefon', phoneValue())}
          ${detail('mail', 'E-mail', emailValue())}
        </div>
        <div class="office__actions">
          ${btn(S.navCta, { to: href('rezervace'), attrs: 'data-book data-track="cta_contact"' })}
          ${call}
        </div>
      </div>
      <div class="map">
        ${mapArt}
        <span class="map__pulse" aria-hidden="true"></span><span class="map__pin" aria-hidden="true"></span>
        <div class="map__overlay">
          <p>${icon('info')}${esc(S.contactSection.mapNote)}</p>
          <div class="map__actions">
            <button class="btn btn--primary btn--sm btn--noicon" type="button" data-map-load>Načíst mapu</button>
            <a class="btn btn--ghost btn--sm btn--noicon" ${extLink(o.mapUrl, 'Odkaz do Mapy.cz doplníme po potvrzení adresy kanceláře.')}>Otevřít v Mapy.cz</a>
          </div>
        </div>
      </div>
    </div>`;
  }

  function renderContact() {
    const c = S.contactSection;
    const offices = S.offices || [];
    const multi = offices.length > 1;
    return `
<section class="section section--sand contact" id="kontakt" aria-labelledby="contact-title">
  <div class="container">
    ${sectionHead(c.eyebrow, c.title, c.intro, 'contact-title')}
    <div class="contact__offices" data-reveal>
      ${multi ? `<div class="office-tabs" role="tablist" aria-label="Kanceláře">${offices.map((o, i) => `<button class="office-tab" type="button" role="tab" id="office-tab-${i}" aria-controls="office-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(PV.stripPh(o.name || `${c.officeTitle} ${i + 1}`))}</button>`).join('')}</div>` : ''}
      ${offices.map((o, i) => officePanel(o, i, multi)).join('')}
    </div>
  </div>
</section>`;
  }

  /* ---------- Patička ---------- */
  function renderFooter() {
    const f = S.footer;
    const legalLinks = f.legalLinks.map((l) => (l.action === 'cookies'
      ? `<li><button type="button" data-open-consent>${esc(l.label)}</button></li>`
      : `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)).join('');
    return `
<footer class="site-footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        ${logo()}
        <p class="footer__claim">${esc(S.brand.claim)}</p>
        <div class="footer__social">${S.social.map((s) => `<a ${socialLink(s)} aria-label="${esc(s.label)}" data-track="social_${esc(s.id)}">${icon(s.id)}</a>`).join('')}</div>
      </div>
      <div class="footer__nav">
        <p class="footer__title">Navigace</p>
        <ul class="footer__links footer__links--nav">${navItems.map((n) => `<li><a href="${n.url || href(n.target)}">${esc(n.label)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <p class="footer__title">Kontakt</p>
        <ul class="footer__links"><li>${phoneValue()}</li><li>${emailValue()}</li><li>${fmt(C.hours)}</li></ul>
      </div>
      <div>
        <p class="footer__title">Informace</p>
        <ul class="footer__links">${legalLinks}</ul>
      </div>
    </div>
    <dl class="footer__legal">${f.legal.map((l) => `<div class="legal-item"><dt>${esc(l.label)}</dt><dd>${fmt(l.value)}</dd></div>`).join('')}</dl>
  </div>
  <div class="footer__wordmark" aria-hidden="true"><span>${esc(S.brand.name)}</span></div>
  <div class="container footer__bottom">
    <p>© ${new Date().getFullYear()} ${esc(S.brand.name)}${proto ? ` · ${esc(f.prototypeNote)}` : ''}</p>
    <button class="to-top" type="button" data-to-top>Zpět nahoru${icon('arrow-up')}</button>
  </div>
</footer>`;
  }

  /* ---------- Překryvné prvky ---------- */
  function renderOverlays() {
    const contacts = [
      C.phoneHref ? `<a href="tel:${esc(C.phoneHref)}">${icon('phone')}${fmt(C.phone)}</a>` : `<p class="menu__contact">${icon('phone')}${fmt(C.phone)}</p>`,
      C.emailHref ? `<a href="mailto:${esc(C.emailHref)}">${icon('mail')}${fmt(C.email)}</a>` : `<p class="menu__contact">${icon('mail')}${fmt(C.email)}</p>`,
    ].join('');
    return `
<dialog class="menu" id="mobile-menu" aria-label="Menu">
  <div class="menu__inner">
    <div class="menu__top">${logo()}<button class="round-btn" type="button" data-menu-close aria-label="Zavřít menu" autofocus>${icon('close')}</button></div>
    <nav aria-label="Mobilní navigace">
      <ol class="menu__list" style="--rows:${Math.ceil(mainNav.length / 2)}">${mainNav.map((n, i) => `<li style="--i:${i}"><a class="menu__link" href="${n.url || href(n.target)}" data-menu-link>${esc(n.label)}<span class="menu__num">${PV.pad(i + 1)}</span></a></li>`).join('')}</ol>
    </nav>
    <div class="menu__cta">${btn(S.navCta, { to: href('rezervace'), cls: 'btn--primary btn--block', attrs: 'data-book data-menu-link data-track="cta_menu"' })}</div>
    <div class="menu__contacts">${contacts}</div>
  </div>
</dialog>
<div class="mobile-cta" data-mobile-cta>
  ${btn(S.navCta, { to: href('rezervace'), cls: 'btn--light', attrs: 'data-book data-track="cta_mobile_bar"' })}
  ${C.phoneHref ? `<a class="mobile-cta__call" href="tel:${esc(C.phoneHref)}" aria-label="Zavolat" data-track="call_mobile_bar">${icon('phone')}</a>` : ''}
</div>`;
  }

  /* ======================================================================
     Interakce
     ====================================================================== */
  const afterScroll = (cb) => {
    let done = false;
    const finish = () => { if (!done) { done = true; cb(); } };
    const timer = window.setTimeout(finish, 900);
    if ('onscrollend' in window) window.addEventListener('scrollend', () => { clearTimeout(timer); finish(); }, { once: true });
  };

  function closeDialog(dlg, after) {
    if (!dlg || !dlg.open) return;
    const finish = () => {
      dlg.classList.remove('is-closing');
      dlg.close();
      if (after) after();
    };
    if (PV.reducedMotion.matches) { finish(); return; }
    dlg.classList.add('is-closing');
    let ended = false;
    const onEnd = (e) => {
      if (e.target !== dlg || ended) return;
      ended = true;
      dlg.removeEventListener('animationend', onEnd);
      finish();
    };
    dlg.addEventListener('animationend', onEnd);
    window.setTimeout(() => { if (!ended) { ended = true; dlg.removeEventListener('animationend', onEnd); finish(); } }, 450);
  }

  function initHeader() {
    const header = $('[data-header]');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const menu = $('#mobile-menu');
    const toggle = $('.menu-toggle');
    if (!menu || !toggle) return;
    const close = () => closeDialog(menu, () => toggle.setAttribute('aria-expanded', 'false'));
    toggle.addEventListener('click', () => {
      menu.showModal();
      toggle.setAttribute('aria-expanded', 'true');
    });
    $('[data-menu-close]', menu).addEventListener('click', close);
    menu.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('[data-menu-link]') || e.target.closest('.logo')) close();
    });
    window.addEventListener('resize', PV.debounce(() => { if (window.innerWidth >= 1100) close(); }, 200));
  }

  function initScrollSpy() {
    const links = $$('.nav__link[data-nav]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    const sections = $$('main > section[id]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => {
          const active = l.dataset.nav === en.target.id;
          l.classList.toggle('is-active', active);
          if (active) l.setAttribute('aria-current', 'location');
          else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  function initReveal() {
    const els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || PV.reducedMotion.matches) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.06 });
    els.forEach((el) => io.observe(el));
  }

  function initIntro() {
    const ready = () => {
      void document.documentElement.offsetHeight; // výchozí stav musí být spočítaný, aby animace proběhla
      document.documentElement.classList.add('is-ready');
    };
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 900))]).then(ready);
  }

  // Střídání slov v hlavním nadpisu (domov → byt → dům): šířka se plynule přizpůsobí slovu, podtržení se překreslí
  function initRotator() {
    const track = $('[data-rot]');
    if (!track) return;
    const rot = track.closest('.rot');
    const paths = $$('.rot-line path', track.closest('.rot-wrap'));
    const items = $$(':scope > em', track);
    const count = Number(track.dataset.rot);
    const slot = parseFloat(getComputedStyle(rot).getPropertyValue('--slot')) || 1.24;
    const ease = 'cubic-bezier(.16, 1, .3, 1)';
    let i = 0;
    let inView = true;

    const fit = (animate) => {
      if (!animate) rot.style.transition = 'none';
      rot.style.width = `${items[i].getBoundingClientRect().width}px`;
      if (!animate) { void rot.offsetWidth; rot.style.transition = ''; }
    };
    const draw = (delay) => paths.forEach((p, k) => p.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { duration: 1000, delay: delay + k * 160, easing: ease, fill: 'both' },
    ));
    const erase = () => paths.forEach((p) => p.animate(
      [{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }],
      { duration: 380, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'forwards' },
    ));

    fit(false);
    window.addEventListener('resize', PV.debounce(() => fit(false), 150));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fit(false));

    if (PV.reducedMotion.matches || !paths[0] || !paths[0].animate) {
      paths.forEach((p) => { p.style.strokeDashoffset = '0'; });
      return;
    }
    draw(1400);
    if (count < 2) return;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; }).observe(rot);
    }
    const next = () => {
      if (document.hidden || !inView) return;
      erase();
      window.setTimeout(() => {
        i += 1;
        track.style.transition = `transform .9s ${ease}`;
        track.style.transform = `translateY(${-i * slot}em)`;
        fit(true);
        draw(420);
        if (i === count) {
          window.setTimeout(() => {
            track.style.transition = 'none';
            track.style.transform = 'none';
            i = 0;
          }, 950);
        }
      }, 300);
    };
    window.setTimeout(() => window.setInterval(next, 3200), 1800);
  }

  function initServices() {
    $$('.service-card__toggle').forEach((b) => b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      if (!open) PV.track('service_details_open', { service: b.getAttribute('aria-controls') });
    }));
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('[data-spotlight]').forEach((card) => card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
  }

  /* ---------- Služby na mobilu: karty se skládají na sebe ---------- */
  function initServiceStack() {
    const cards = $$('[data-stack]');
    const mq = window.matchMedia('(max-width: 920px)');
    if (cards.length < 2 || PV.reducedMotion.matches) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!mq.matches || !next) { card.style.removeProperty('--sc'); return; }
        const stick = parseFloat(window.getComputedStyle(card).top) || 0;
        const h = card.offsetHeight || 1;
        const pinned = card.getBoundingClientRect().top <= stick + 1;
        const p = pinned ? Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - stick) / h)) : 0;
        card.style.setProperty('--sc', (1 - p * 0.06).toFixed(4));
      });
    };
    const req = () => { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
  }

  /* ---------- Proč se mnou na mobilu: posuvné karty banka / já ---------- */
  function initWhyCards() {
    const root = $('[data-why-cards]');
    if (!root) return;
    const track = $('.why__track', root);
    const dots = $$('.why__dot', root);
    const cards = Array.from(track.children);
    const sync = () => {
      const first = cards[0];
      const step = cards.length > 1 ? cards[1].offsetLeft - first.offsetLeft : first.offsetWidth;
      const i = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / (step || 1))));
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    };
    track.addEventListener('scroll', PV.debounce(sync, 40), { passive: true });
  }

  /* ---------- Reference: pás, který pomalu jede zleva doprava ---------- */
  function initMarquee() {
    const m = $('[data-marquee]');
    if (!m) return;
    const track = $('.t-track', m);
    const items = Array.from(track.children);
    if (!items.length) return;
    const reduce = PV.reducedMotion.matches;

    // Kopie karet, aby pás nikdy nedojel na konec
    const addSet = () => items.forEach((it) => {
      const c = it.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
    addSet();
    const setW = () => track.children[items.length].offsetLeft - items[0].offsetLeft;
    let W = setW();
    const fill = () => {
      W = setW();
      const need = Math.ceil(m.clientWidth / (W || 1)) + 2;
      while (track.children.length < items.length * need) addSet();
    };
    fill();

    let pos = W;
    m.scrollLeft = pos;
    let hover = false;
    let userUntil = 0;
    let visible = true;
    let last = performance.now();
    const speed = 36; // px za vteřinu; obsah jede doprava

    const wrap = () => {
      if (m.scrollLeft < 1) { m.scrollLeft += W; pos = m.scrollLeft; }
      else if (m.scrollLeft > W * 2) { m.scrollLeft -= W; pos = m.scrollLeft; }
    };
    m.addEventListener('scroll', () => {
      if (Math.abs(m.scrollLeft - Math.round(pos)) > 1) { pos = m.scrollLeft; userUntil = performance.now() + 2200; }
      wrap();
    }, { passive: true });

    m.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover = true; });
    m.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hover = false; });
    m.addEventListener('focusin', () => { hover = true; });
    m.addEventListener('focusout', () => { hover = false; });
    ['touchstart', 'wheel'].forEach((ev) => m.addEventListener(ev, () => { userUntil = performance.now() + 2600; }, { passive: true }));

    // Tažení myší
    let drag = null;
    m.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: m.scrollLeft };
      m.classList.add('is-drag');
    });
    window.addEventListener('pointermove', (e) => { if (drag) { m.scrollLeft = drag.left - (e.clientX - drag.x); pos = m.scrollLeft; } });
    window.addEventListener('pointerup', () => { drag = null; m.classList.remove('is-drag'); });

    // Šipky na klávesnici
    m.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      m.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * 320, behavior: 'smooth' });
    });

    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(m);
    window.addEventListener('resize', PV.debounce(fill, 200));

    if (reduce) return;
    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (visible && !hover && !drag && now > userUntil && !document.hidden) {
        pos -= speed * dt;
        m.scrollLeft = Math.round(pos);
      }
      window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  }

  function initProcess() {
    const list = $('[data-process]');
    if (!list) return;
    const steps = $$('.step', list);
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.58;
      const p = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
      list.style.setProperty('--p', p.toFixed(4));
      steps.forEach((s) => s.classList.toggle('is-active', s.getBoundingClientRect().top + 30 < anchor));
    };
    const onScroll = () => { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  // Orientační kalkulačka splátky (anuitní splácení)
  function initCalculator() {
    const root = $('[data-calculator]');
    if (!root) return;
    const czk = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 });
    const pct = new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const input = (k) => $(`[data-calc="${k}"]`, root);
    const out = (k) => $(`[data-out="${k}"]`, root);
    const live = $('[data-calc-live]', root);
    const yearsWord = (n) => PV.plural(n, 'rok', 'roky', 'let');
    const label = { amount: (v) => czk.format(v), years: (v) => `${v} ${yearsWord(v)}`, rate: (v) => `${pct.format(v)} %` };
    const payment = (P, years, ratePct) => {
      const n = years * 12;
      const r = ratePct / 100 / 12;
      return r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n));
    };

    ['amount', 'years', 'rate'].forEach((k) => {
      const el = input(k);
      $(`[data-min="${k}"]`, root).textContent = label[k](Number(el.min));
      $(`[data-max="${k}"]`, root).textContent = label[k](Number(el.max));
    });

    let used = false;
    const announce = PV.debounce((text) => { live.textContent = text; }, 700);
    const update = () => {
      const P = Number(input('amount').value);
      const Y = Number(input('years').value);
      const R = Number(input('rate').value);
      ['amount', 'years', 'rate'].forEach((k) => {
        const el = input(k);
        const v = Number(el.value);
        out(k).textContent = label[k](v);
        el.setAttribute('aria-valuetext', label[k](v));
        el.style.setProperty('--fill', `${((v - el.min) / (el.max - el.min)) * 100}%`);
      });
      const m = payment(P, Y, R);
      const total = m * Y * 12;
      const interest = total - P;
      const higher = payment(P, Y, R + 1);
      out('payment').textContent = czk.format(Math.round(m));
      out('total').textContent = czk.format(Math.round(total));
      out('interest').textContent = czk.format(Math.round(interest));
      $('[data-bar="principal"]', root).style.width = `${(P / total) * 100}%`;
      $('[data-bar="interest"]', root).style.width = `${(interest / total) * 100}%`;
      out('sens').textContent = `Při sazbě o 1 procentní bod vyšší by splátka vzrostla o ${czk.format(Math.round(higher - m))} měsíčně.`;
      announce(`Orientační měsíční splátka ${czk.format(Math.round(m))}.`);
    };
    root.addEventListener('input', () => {
      update();
      if (!used) { used = true; PV.track('calculator_used'); }
    });
    update();
  }

  // Hlídání konce fixace – demo formulář pro sběr kontaktů
  function initFixWatch() {
    const form = $('[data-fw-form]');
    if (!form) return;
    const body = $('[data-fw-body]');
    const success = $('[data-fw-success]');
    PV.forms.bindLive(form);
    let sending = false;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (sending || form.elements.namedItem('company').value) return;
      if (!PV.forms.validate(form)) { PV.track('fixwatch_form_error'); return; }
      sending = true;
      const submit = form.querySelector('[type="submit"]');
      submit.classList.add('is-loading');
      window.setTimeout(() => {
        sending = false;
        submit.classList.remove('is-loading');
        PV.track('fixwatch_submit_demo', Object.assign({ fix_end: `${form.elements.namedItem('year').value}-${PV.pad(form.elements.namedItem('month').value)}` }, PV.attribution()));
        body.hidden = true;
        success.hidden = false;
        success.focus();
      }, 800);
    });
    $('[data-fw-reset]').addEventListener('click', () => {
      PV.forms.reset(form);
      success.hidden = true;
      body.hidden = false;
      form.querySelector('input').focus();
    });
  }

  function initFaq() {
    $$('.faq__item').forEach((d) => d.addEventListener('toggle', () => {
      if (d.open) PV.track('faq_open', { question: d.querySelector('summary').textContent.trim().slice(0, 80) });
    }));
  }

  // Všechna tlačítka „Domluvit schůzku“ vedou k rezervaci (případně s předvybraným tématem)
  function initBookLinks() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-book]');
      if (!a || !isHome) return;
      e.preventDefault();
      PV.booking.preselect({ type: a.dataset.bookType, topic: a.dataset.bookTopic });
      PV.track('booking_cta_click', { cta: a.dataset.track || 'unknown' });
      // Na mobilu rovnou k formuláři, na desktopu k celé sekci
      const target = window.matchMedia('(max-width: 920px)').matches
        ? document.querySelector('.booking-section__widget')
        : document.getElementById('rezervace');
      const go = () => {
        target.scrollIntoView({ behavior: PV.reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
        if (window.location.hash !== '#rezervace') window.history.replaceState(null, '', '#rezervace');
        afterScroll(() => PV.booking.focus());
      };
      if (a.closest('dialog')) window.setTimeout(go, 60);
      else go();
    });
  }

  function initContact() {
    const tabs = $$('.office-tab');
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        t.setAttribute('aria-selected', String(i === j));
        t.tabIndex = i === j ? 0 : -1;
        const panel = document.getElementById(`office-${j}`);
        if (panel) panel.hidden = i !== j;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i, false));
      t.addEventListener('keydown', (e) => {
        const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select((map[e.key] + tabs.length) % tabs.length, true);
      });
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-map-load]')) {
        PV.toast('Ukázka: v ostré verzi se po souhlasu s obsahem třetích stran načte interaktivní mapa (Mapy.cz).', 'map');
      }
    });
  }

  function initMobileCTA() {
    const bar = $('[data-mobile-cta]');
    if (!bar) return;
    const targets = isHome
      ? ['uvod', 'rezervace', 'kontakt'].map((id) => document.getElementById(id)).filter(Boolean)
      : [];
    const footer = $('.site-footer');
    if (footer) targets.push(footer);
    if (!isHome) { const m = $('main'); if (m) targets.push(m.firstElementChild || m); }
    const inView = new Set();
    const mq = window.matchMedia('(max-width: 760px)');
    const apply = () => {
      const show = inView.size === 0;
      bar.classList.toggle('is-visible', show);
      document.body.classList.toggle('has-mobile-cta', show && mq.matches);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? inView.add(en.target) : inView.delete(en.target)));
      apply();
    });
    targets.forEach((t) => io.observe(t));
  }

  function initProto() {
    const badge = $('.proto__badge');
    if (!badge) return;
    const panel = $('#proto-panel');
    const setOpen = (open) => { badge.setAttribute('aria-expanded', String(open)); panel.hidden = !open; };
    badge.addEventListener('click', (e) => { e.stopPropagation(); setOpen(panel.hidden); });
    document.addEventListener('click', (e) => { if (!panel.hidden && !e.target.closest('.proto')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); badge.focus(); } });

    $('[data-proto-notes]', panel).addEventListener('change', (e) => {
      const isOn = e.target.checked;
      document.documentElement.classList.toggle('show-notes', isOn);
      PV.store.set('pv_notes', isOn);
      PV.toast(isOn ? 'Poznámky k návrhu jsou zobrazené přímo v sekcích.' : 'Poznámky k návrhu jsou skryté.', 'edit');
    });
    $('[data-proto-reset]', panel).addEventListener('click', () => {
      ['pv_consent_v1', 'pv_notes'].forEach((k) => PV.store.remove(k));
      PV.toast('Demo data jsou vymazaná. Stránka se znovu načte…', 'refresh');
      window.setTimeout(() => window.location.reload(), 1200);
    });
    $('[data-open-consent]', panel).addEventListener('click', () => setOpen(false));
  }

  function initGlobalClicks() {
    document.addEventListener('click', (e) => {
      const ph = e.target.closest('[data-ph-link]');
      if (ph) { e.preventDefault(); PV.toast(ph.dataset.phLink, 'info'); return; }
      if (e.target.closest('[data-open-consent]') && window.PVConsent) window.PVConsent.open();
      if (e.target.closest('[data-to-top]')) {
        window.scrollTo({ top: 0, behavior: PV.reducedMotion.matches ? 'auto' : 'smooth' });
        const l = $('.site-header .logo');
        if (l) afterScroll(() => l.focus({ preventScroll: true }));
      }
      const t = e.target.closest('[data-track]');
      if (t && !t.hasAttribute('data-book')) PV.track('click', { element: t.dataset.track });
    });
  }

  function initMagnetic() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || PV.reducedMotion.matches) return;
    $$('[data-magnetic]').forEach((el) => {
      const k = parseFloat(el.dataset.magnetic) || 0.18;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${(e.clientX - r.left - r.width / 2) * k}px ${(e.clientY - r.top - r.height / 2) * k}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }

  function fitWordmark() {
    const wrap = $('.footer__wordmark');
    if (!wrap) return;
    const span = wrap.firstElementChild;
    const fit = () => {
      span.style.setProperty('--wm-size', '100px');
      const w = span.getBoundingClientRect().width || 1;
      const size = Math.min(300, Math.max(48, (100 * wrap.clientWidth * 0.94) / w));
      span.style.setProperty('--wm-size', `${size.toFixed(1)}px`);
    };
    fit();
    window.addEventListener('resize', PV.debounce(fit, 150));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  // SEO: titulek, popis a strukturovaná data (JSON-LD) z obsahového souboru
  function initSEO() {
    if (!isHome) return;
    document.title = PV.stripPh(S.seo.title);
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', S.seo.description);
    const clean = (v) => (v && !PV.hasPh(v) ? v : undefined);
    const office = (S.offices || [])[0] || {};
    const sameAs = S.social.map((s) => PV.safeUrl(s.url)).filter(Boolean);
    const graph = [
      {
        '@type': 'FinancialService',
        name: `${S.brand.name} – ${S.brand.role}`,
        description: S.seo.description,
        url: clean(S.seo.url),
        telephone: clean(C.phoneHref),
        email: clean(C.emailHref),
        areaServed: clean(S.brand.city),
        address: clean(office.street) ? { '@type': 'PostalAddress', streetAddress: office.street, addressLocality: clean(office.city) } : undefined,
      },
      { '@type': 'Person', name: S.brand.name, jobTitle: S.brand.role, sameAs: sameAs.length ? sameAs : undefined },
    ];
    if (on('showFaq') && S.faq) {
      const qa = S.faq.items.filter((it) => !PV.hasPh(it.a)).map((it) => ({
        '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a },
      }));
      if (qa.length) graph.push({ '@type': 'FAQPage', mainEntity: qa });
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    document.head.appendChild(script);
  }

  /* ---------- Start ---------- */
  function mount(selector, html) {
    const el = $(selector);
    if (el) el.outerHTML = html;
  }

  mount('[data-render="header"]', renderHeader());
  if (isHome) {
    $('#main').innerHTML = [
      renderHero(), renderServices(), renderWhy(), renderAbout(), renderTeam(),
      renderProcess(), renderTools(), renderBooking(), renderInsta(), renderBlogTeaser(), renderTestimonials(), renderFaq(), renderContact(),
    ].join('');
  }
  if (page === 'glossary') $('#main').innerHTML = renderGlossaryPage();
  mount('[data-render="footer"]', renderFooter() + renderOverlays());

  if (isHome) PV.booking.init(document.getElementById('booking-widget'), S.booking, S);

  initHeader();
  initScrollSpy();
  initReveal();
  initIntro();
  initRotator();
  initServices();
  initServiceStack();
  initWhyCards();
  initMarquee();
  initProcess();
  initCalculator();
  initFixWatch();
  initFaq();
  initBookLinks();
  initContact();
  initMobileCTA();
  initProto();
  initGlobalClicks();
  initMagnetic();
  fitWordmark();
  initSEO();
  PV.attribution();

  // Po načtení se posuneme na kotvu z adresy (obsah se vykresluje skriptem)
  if (isHome && window.location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) window.requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto', block: 'start' }));
  }
})();
