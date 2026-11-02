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
  const optional = { 'proc-se-mnou': 'showWhy', tym: 'showTeam', kalkulacka: 'showTools', reference: 'showTestimonials', 'ze-zivota': 'showInsta', otazky: 'showFaq' };
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

  // Krátký nadpis nad nadpisem sekce
  const eyebrow = (label) => `<p class="kicker">${esc(label)}</p>`;

  const btn = (label, { to = '#', cls = 'btn--primary', attrs = '', iconName = 'arrow-right' } = {}) =>
    `<a class="btn ${cls}" href="${to}" ${attrs}><span>${esc(label)}</span>${iconName ? icon(iconName, 'btn__arrow') : ''}</a>`;

  const linkArrow = (label, to, attrs = '', iconName = 'arrow-right') =>
    `<a class="link-arrow" href="${to}" ${attrs}><span class="link-arrow__text">${esc(label)}</span><span class="link-arrow__icon" aria-hidden="true">${icon(iconName)}</span></a>`;

  // Ručně psaná poznámka se šipkou (dir = kam šipka míří)
  const ARROWS = {
    left: '<path d="M52 22C40 8 24 6 8 14"/><path d="M17 7 7 14l9 7"/>',
  };
  const hand = (text, dir = 'left', cls = '') => (text
    ? `<p class="hand hand--${dir}${cls ? ' ' + cls : ''}"><span>${esc(text)}</span><svg class="hand__arrow" viewBox="0 0 56 44" aria-hidden="true">${ARROWS[dir]}</svg></p>`
    : '');

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
    `<a class="logo" href="${isHome ? '#uvod' : 'index.html'}" aria-label="${esc(S.brand.name)}, ${esc(S.brand.role.toLowerCase())} – na úvod"><span class="logo__text"><span class="logo__name">${esc(S.brand.name)}</span><span class="logo__role">${esc(S.brand.role)}</span></span></a>`;

  const phBlock = (t) => (PV.isPh(t)
    ? `<div class="ph-block">${icon('edit')}<p>${PV.text(PV.stripPh(t))}</p></div>`
    : `<p>${fmt(t)}</p>`);

  const sectionHead = (label, title, intro, id, extra = '') => `
    <header class="sec-head">
      ${eyebrow(label)}
      <h2 class="h2" id="${id}">${fmt(title)}</h2>
      ${intro ? `<p class="sec-head__intro">${fmt(intro)}</p>` : ''}
      ${extra}
    </header>`;

  // Kresba domu bílou linkou (jako na gpf.cz)
  const houseArt = `
    <svg class="house-art" viewBox="0 0 480 560" fill="none" aria-hidden="true">
      <g stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 470h444"/>
        <path d="M60 470V250l150-118 150 118v220"/>
        <path d="M34 270 210 128l176 142"/>
        <path d="M290 186v-54h34v80"/>
        <path d="M172 470V372a38 38 0 0 1 76 0v98"/>
        <path d="M98 300h52v52H98zM124 300v52M98 326h52"/>
        <path d="M270 300h52v52h-52zM296 300v52M270 326h52"/>
        <path d="M186 232a24 24 0 1 1 48 0 24 24 0 0 1-48 0zM210 208v48M186 232h48"/>
        <path d="M410 470V378"/><path d="M410 400c-30-8-38-46-14-66-10-30 22-52 44-34 26-12 50 16 34 40 18 24-2 56-30 52-8 8-22 10-34 8z"/>
        <path d="M60 64c18-10 38-10 52 4 12-10 34-8 40 8" opacity=".7"/>
        <path d="M330 52c14-8 30-8 40 2 10-8 26-6 32 6" opacity=".7"/>
      </g>
    </svg>`;

  /* ---------- Hlavička ---------- */
  function renderHeader() {
    const links = mainNav.map((n) => `<li><a class="nav__link${(n.target === 'blog' && (page === 'blog' || page === 'post')) || (n.target === 'slovnicek' && page === 'glossary') || (n.target === 'certifikace' && page === 'certifications') ? ' is-active" aria-current="page' : ''}" href="${n.url || href(n.target)}" data-nav="${esc(n.target)}">${esc(n.label)}</a></li>`).join('');
    return `
<a class="skip-link" href="#main">Přeskočit na obsah</a>
<header class="site-header" data-header>
  <div class="container header__inner">
    ${logo()}
    <nav class="nav" aria-label="Hlavní navigace"><ul class="nav__list">${links}</ul></nav>
    ${btn(S.navCta, { to: href('rezervace'), cls: 'btn--primary btn--sm header__cta', attrs: 'data-book data-track="cta_header"' })}
    <button class="menu-toggle" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="mobile-menu"><span class="menu-toggle__lines" aria-hidden="true"><span></span><span></span></span>Menu</button>
  </div>
</header>`;
  }

  /* ---------- Úvod ---------- */
  function renderHero() {
    const h = S.hero;
    return `
<section class="hero" id="uvod" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__copy">
      ${h.eyebrow ? `<p class="hero__kicker">${fmt(h.eyebrow)}</p>` : ''}
      <h1 class="hero__title" id="hero-title">${fmt(h.title)}</h1>
      <p class="hero__text">${fmt(h.text)}</p>
      <div class="hero__actions">
        ${btn(h.primaryCta, { to: href('rezervace'), cls: 'btn--primary btn--lg', attrs: 'data-book data-track="cta_hero_primary"' })}
        ${linkArrow(h.secondaryCta, href('sluzby'), 'data-track="cta_hero_secondary"', 'arrow-down')}
      </div>
    </div>
    <div class="hero__visual">
      <div class="hero__panel">
        ${houseArt}
      </div>
    </div>
  </div>
  <div class="container">${note(h.note)}</div>
</section>
${renderPartners()}`;
  }

  /* ---------- Partneři – barevná loga ---------- */
  function renderPartners() {
    const w = S.why;
    if (!w || !w.banks || !w.banks.length) return '';
    const list = (hidden) => `<ul class="partners__list" role="list"${hidden ? ' aria-hidden="true"' : ''}>${w.banks.map((b) => (typeof b === 'string'
      ? `<li class="partners__item partners__item--text">${esc(b)}</li>`
      : `<li class="partners__item"><img src="${esc(b.logo)}" alt="${hidden ? '' : esc(b.name)}"${hidden ? '' : ` title="${esc(b.name)}"`} decoding="async" draggable="false"></li>`)).join('')}</ul>`;
    return `
<section class="partners" aria-labelledby="partners-title">
  <div class="container partners__inner" data-partners>
    <p class="partners__title" id="partners-title">${esc(w.banksTitle)}</p>
    <div class="partners__marquee">
      <div class="partners__track">${list(false)}${list(true)}${list(true)}${list(true)}</div>
    </div>
    <button class="partners__pause" type="button" data-partners-pause aria-pressed="false" aria-label="Pozastavit pás partnerů">${icon('pause', 'partners__pause-off')}${icon('play-line', 'partners__pause-on')}</button>
    ${w.banksNote ? `<p class="partners__note"><span class="ph">${PV.text(w.banksNote)}</span></p>` : ''}
  </div>
</section>`;
  }

  /* ---------- Služby: výběr situace ---------- */
  function renderServices() {
    const s = S.services;
    const situations = s.situations && s.situations.length ? `
    <div class="situations">
      <p class="situations__title">${esc(s.situationsTitle)}</p>
      <ul class="situations__list" role="list">${s.situations.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      ${note(s.situationsNote)}
    </div>` : '';
    return `
<section class="section services" id="sluzby" aria-labelledby="services-title">
  <div class="container">
    ${sectionHead(s.eyebrow, s.title, s.intro, 'services-title')}
    ${note(s.note)}
    <div class="picker" data-picker>
      <div class="picker__tabs" role="tablist" aria-label="${esc(s.eyebrow)}" aria-orientation="vertical">
        ${s.items.map((it, i) => `
        <button class="picker__tab" type="button" role="tab" id="svc-tab-${esc(it.id)}" aria-controls="svc-${esc(it.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
          <span class="picker__icon" aria-hidden="true">${icon(it.icon || 'home')}</span>
          <span class="picker__label">${esc(it.tag || it.title)}</span>
        </button>`).join('')}
      </div>
      ${s.items.map((it, i) => `
      <div class="picker__panel" role="tabpanel" id="svc-${esc(it.id)}" aria-labelledby="svc-tab-${esc(it.id)}" tabindex="0"${i ? ' hidden' : ''}>
        <span class="picker__big-icon" aria-hidden="true">${icon(it.icon || 'home')}</span>
        <h3 class="picker__title">${fmt(it.title)}</h3>
        <p class="picker__text">${fmt(it.text)}</p>
        <p class="picker__sub">${esc(s.detailsLabel)}</p>
        <ul class="ticks">${it.points.map((p) => `<li>${icon('check')}<span>${fmt(p)}</span></li>`).join('')}</ul>
        ${btn(s.cta, { to: href('rezervace'), attrs: `data-book data-book-topic="${esc(it.id)}" data-track="cta_service"` })}
      </div>`).join('')}
    </div>
    ${situations}
  </div>
</section>`;
  }

  /* ---------- Proč se mnou (volitelné) ---------- */
  function renderWhy() {
    if (!on('showWhy') || !S.why) return '';
    const w = S.why;
    const col = (who, key, iconName) => `
        <ul class="versus__list" role="list">${w.rows.map((r) => `
          <li><span class="versus__icon" aria-hidden="true">${icon(iconName)}</span><span><span class="versus__label">${esc(r.label)}</span>${fmt(r[key])}</span></li>`).join('')}
        </ul>`;
    return `
<section class="section section--soft why" id="proc-se-mnou" aria-labelledby="why-title">
  <div class="container">
    ${sectionHead(w.eyebrow, w.title, w.intro, 'why-title')}
    ${note(w.note)}
    <div class="versus">
      <div class="versus__card versus__card--self">
        <h3 class="versus__who">${esc(w.selfLabel)}</h3>
        ${col(w.selfLabel, 'self', 'minus')}
      </div>
      <div class="versus__card versus__card--me">
        <h3 class="versus__who">${esc(w.meLabel)}</h3>
        ${col(w.meLabel, 'me', 'check')}
        ${btn(S.navCta, { to: href('rezervace'), cls: 'btn--lime', attrs: 'data-book data-track="cta_why"' })}
      </div>
    </div>
  </div>
</section>`;
  }

  /* ---------- O mně ---------- */
  function renderAbout() {
    const a = S.about;
    return `
<section class="section about" id="o-mne" aria-labelledby="about-title">
  <div class="container about__grid">
    <div class="about__visual">
      <div class="about__frame">${media(a.portrait, { ratio: '4/5', className: 'about__portrait' })}</div>
      ${hand(a.photoNote, 'left', 'about__hand')}
    </div>
    <div class="about__content">
      ${eyebrow(a.eyebrow)}
      <h2 class="h2" id="about-title">${fmt(a.title)}</h2>
      <p class="about__lead">${fmt(a.lead)}</p>
      ${a.paragraphs.map((p) => `<p>${fmt(p)}</p>`).join('')}
      ${a.story ? phBlock(a.story) : '<div class="about__story" aria-hidden="true"></div>'}
      <blockquote class="about__quote"><p>${fmt(a.quote)}</p></blockquote>
      <div class="about__sign">
        <p class="signature">${esc(a.signature)}</p>
        ${btn(a.cta, { to: href('rezervace'), cls: 'btn--outline', attrs: 'data-book data-track="cta_about"' })}
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
<section class="section section--slim team" id="tym" aria-labelledby="team-title">
  <div class="container team__inner">
    <div>
      ${eyebrow(t.eyebrow)}
      <h2 class="h3" id="team-title">${fmt(t.title)}</h2>
      <p class="team__intro">${fmt(t.intro)}</p>
      ${note(t.note)}
    </div>
    ${t.members.map((m) => `
    <article class="member">
      ${media(m.photo, { ratio: '1/1' })}
      <div>
        <h3 class="member__name">${fmt(m.name)}</h3>
        <p class="member__role">${fmt(m.role)}</p>
        <p class="member__text">${fmt(m.text)}</p>
      </div>
    </article>`).join('')}
  </div>
</section>`;
  }

  /* ---------- Spolupráce: cesta k domovu ---------- */
  function renderProcess() {
    const p = S.process;
    return `
<section class="section section--lime process" id="spoluprace" aria-labelledby="process-title">
  <div class="container">
    ${sectionHead(p.eyebrow, p.title, p.intro, 'process-title')}
    <ol class="road" role="list" data-road>
      ${p.steps.map((s, i) => {
        const last = i === p.steps.length - 1;
        const num = last ? i + 2 : i + 1;   // klíče jsou krok před posledním
        return `${last ? `
      <li class="road__step road__step--finish">
        <span class="road__dot" aria-hidden="true">${icon('key')}</span>
        <p class="road__finish"><span class="visually-hidden">Krok ${i + 1}: </span>${esc(p.finish || '')}</p>
      </li>` : ''}
      <li class="road__step">
        <span class="road__dot" aria-hidden="true">${num}</span>
        <h3 class="road__title"><span class="visually-hidden">Krok ${num}: </span>${fmt(s.title)}</h3>
        <p class="road__text">${fmt(s.text)}</p>
        ${last ? btn(p.cta, { to: href('rezervace'), attrs: 'data-book data-track="cta_process"' }) : ''}
      </li>`;
      }).join('')}
    </ol>
  </div>
</section>`;
  }

  /* ---------- Kalkulačka (volitelná) ---------- */
  function renderTools() {
    if (!on('showTools') || !S.calculator) return '';
    const c = S.calculator;
    const money = (key, label) => `
          <div class="calc__field">
            <div class="calc__row">
              <label class="calc__label" for="calc-${key}">${esc(label)}</label>
              <span class="calc__money"><input class="calc__money-input" type="text" inputmode="numeric" autocomplete="off" data-calc-text="${key}" aria-label="${esc(label)} v korunách">Kč</span>
            </div>
            <input class="range" type="range" id="calc-${key}" step="50000" data-calc-range="${key}" aria-label="${esc(label)}">
            <div class="calc__scale" aria-hidden="true"><span data-min="${key}"></span><span data-max="${key}"></span></div>
            <p class="calc__error" data-calc-error="${key}" hidden></p>
          </div>`;
    return `
<section class="section tools" id="kalkulacka" aria-labelledby="tools-title">
  <div class="container">
    ${sectionHead(c.eyebrow, c.title, c.intro, 'tools-title')}
    ${note(c.note)}
    <div class="calc" data-calculator>
      <div class="calc__inputs">
        <div class="calc__modes" role="group" aria-label="Druh hypotéky">
          ${c.modes.map((m) => `<button class="calc__mode" type="button" data-calc-mode="${esc(m.id)}" aria-pressed="false">${esc(m.label)}</button>`).join('')}
        </div>
        ${money('guarantee', c.guaranteeLabel)}${money('credit', c.creditLabel)}
        <div class="calc__selects">
          <div><label class="calc__label calc__label--block" for="calc-years">${esc(c.yearsLabel)}</label><select class="field__input" id="calc-years" data-calc-select="years"></select></div>
          <div><label class="calc__label calc__label--block" for="calc-fixation">${esc(c.fixationLabel)}</label><select class="field__input" id="calc-fixation" data-calc-select="fixation">${c.fixations.map((f) => `<option value="${f}"${f === c.fixation ? ' selected' : ''}>${f} ${PV.plural(f, 'rok', 'roky', 'let')}</option>`).join('')}</select></div>
        </div>
        <div class="calc__insurance" role="group" aria-label="${esc(c.insuranceLabel)}">
          <span class="calc__label">${esc(c.insuranceLabel)}</span>
          <span class="calc__modes calc__modes--small">
            <button class="calc__mode" type="button" data-calc-insurance="1" aria-pressed="true">Ano</button>
            <button class="calc__mode" type="button" data-calc-insurance="0" aria-pressed="false">Ne</button>
          </span>
        </div>
      </div>
      <div class="calc__result" data-calc-result>
        <p class="calc__result-label">${esc(c.resultLabel)}</p>
        <p class="calc__payment" data-out="payment">–</p>
        <dl class="calc__stats">
          <div><dt>Úroková sazba</dt><dd data-out="rate">–</dd></div>
          <div><dt>RPSN</dt><dd data-out="apr">–</dd></div>
          <div data-out-wrap="insurance"><dt>Pojištění měsíčně</dt><dd data-out="insurance">–</dd></div>
          <div><dt>Náklady za dobu fixace</dt><dd data-out="costs">–</dd></div>
        </dl>
        <p class="calc__message" data-calc-message hidden></p>
        <div class="calc__actions">
          <button class="btn btn--block calc__toggle" type="button" data-calc-toggle aria-expanded="false" aria-controls="calc-compare"><span>${esc(c.compareCta)}</span></button>
          ${btn(c.cta, { to: href('rezervace'), cls: 'btn--lime btn--block', attrs: 'data-book data-track="cta_calculator"' })}
        </div>
        <p class="calc__disclaimer">${fmt(c.disclaimer)}</p>
        <p class="visually-hidden" aria-live="polite" data-calc-live></p>
      </div>
      <div class="calc__compare" id="calc-compare" data-calc-compare hidden>
        <h3 class="card-title">${esc(c.compareTitle)}</h3>
        <table class="calc__table">
          <thead><tr><th scope="col">Banka</th><th scope="col">Úrok</th><th scope="col">RPSN</th><th scope="col">Splátka</th><th scope="col" data-col-insurance>Pojištění</th><th scope="col">Náklady za fixaci</th></tr></thead>
          <tbody data-calc-rows></tbody>
        </table>
      </div>
    </div>
  </div>
</section>`;
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
<section class="section section--soft booking-section" id="rezervace" aria-labelledby="booking-title">
  <div class="container booking-section__grid">
    <div class="booking-section__intro">
      ${eyebrow(b.eyebrow)}
      <h2 class="h2" id="booking-title">${fmt(b.title)}</h2>
      <p class="booking-section__lead">${fmt(b.intro)}</p>
      <p class="aside-title">${esc(b.expectTitle)}</p>
      <ul class="ticks">${b.expect.map((e) => `<li>${icon('check')}<span>${fmt(e)}</span></li>`).join('')}</ul>
      <div class="alt-contacts">
        <p class="aside-title">${esc(b.altTitle)}</p>
        ${row('phone')}
        ${row('mail')}
      </div>
      ${note(b.note)}
    </div>
    <div class="booking-section__widget"><div id="booking-widget"></div></div>
  </div>
</section>`;
  }

  /* ---------- Ze života poradkyně – odkaz na Instagram ---------- */
  function renderInsta() {
    const i = S.insta;
    if (!i || !on('showInsta')) return '';
    return `
<section class="section section--slim insta" id="ze-zivota" aria-labelledby="insta-title">
  <div class="container insta__grid">
    <div>
      ${eyebrow(i.eyebrow)}
      <h2 class="h2" id="insta-title">${fmt(i.title)}</h2>
      <p class="insta__text">${fmt(i.text)}</p>
      ${note(i.note)}
    </div>
    <ul class="channels" role="list">
      ${S.social.map((s) => `
      <li><a class="channel channel--${esc(s.id)}" ${socialLink(s)} data-track="social_${esc(s.id)}">
        <span class="channel__icon" aria-hidden="true">${icon(s.id)}</span>
        <span class="channel__body">
          <span class="channel__name">${esc(s.label)} <span class="channel__handle">${fmt(s.handle)}</span></span>
          <span class="channel__text">${esc(s.text)}</span>
        </span>
        <span class="channel__go" aria-hidden="true">${icon('arrow-up-right')}</span>
      </a></li>`).join('')}
    </ul>
  </div>
</section>`;
  }

  function renderBlogTeaser() {
    return PV.blog ? PV.blog.teaser(eyebrow((S.blog || {}).teaserEyebrow || 'Blog')) : '';
  }

  /* ---------- Reference (volitelné) ---------- */
  function reviewLink(link) {
    const url = PV.safeUrl(link.url);
    if (!url) return '';   // odkaz se ukáže až po doplnění skutečné adresy
    return `<a class="link-arrow" href="${esc(url)}" target="_blank" rel="noopener" data-track="review_link"><span class="link-arrow__text">${esc(link.label)}</span><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-up-right')}</span></a>`;
  }

  // Iniciála do kolečka (bez titulů typu Ing.)
  const initial = (name) => (PV.stripPh(name).replace(/\b(Ing|Mgr|Bc|MUDr|JUDr|PhDr|RNDr|MBA)\.?\s*/g, '').trim().charAt(0) || '?').toUpperCase();

  const reviewAuthor = (it) => `<figcaption><span class="review__avatar" aria-hidden="true">${esc(initial(it.name))}</span><span><span class="review__name">${fmt(it.name)}</span>${it.source || it.context ? `<span class="review__meta">${[it.context, it.source].filter(Boolean).map(fmt).join(' · ')}</span>` : ''}</span></figcaption>`;

  function renderTestimonials() {
    if (!on('showTestimonials')) return '';
    const t = S.testimonials;
    const items = (t.items || []).filter((it) => it.text).slice(0, t.homeCount || undefined);
    if (!items.length) return '';
    return `
<section class="section testimonials" id="reference" aria-labelledby="t-title">
  <div class="container testimonials__head">
    ${sectionHead(t.eyebrow, t.title, t.intro, 't-title')}
    <div class="reviews__nav">
      <button class="reviews__btn" type="button" data-reviews-prev aria-label="Předchozí recenze">${icon('arrow-left')}</button>
      <button class="reviews__btn" type="button" data-reviews-next aria-label="Další recenze">${icon('arrow-right')}</button>
    </div>
  </div>
  <div class="container">${note(t.note)}</div>
  <div class="reviews" data-reviews role="region" aria-roledescription="carousel" aria-label="Recenze klientů – posouvejte šipkami nebo prstem" tabindex="0">
    <ul class="reviews__track" role="list">
      ${items.map((it, i) => {
        return `
      <li class="review">
        <figure>
          <blockquote><p class="review__text">${PV.text(it.text)}</p></blockquote>
          ${reviewAuthor(it).replace('</figcaption>', `<a class="review__more" href="recenze.html#recenze-${i + 1}" hidden aria-label="Číst celou recenzi od: ${esc(PV.stripPh(it.name))}"><span class="review__more-text">Celá recenze</span>${icon('arrow-right')}</a></figcaption>`)}
        </figure>
      </li>`;
      }).join('')}
    </ul>
  </div>
  <div class="container">
    <div class="testimonials__foot">
      <p>${fmt(t.ask)}</p>
      <div class="testimonials__links">
        ${linkArrow(t.allLabel || 'Všechny recenze', 'recenze.html', 'data-track="reviews_all"')}
        ${reviewLink(t.reviewLink)}
      </div>
    </div>
  </div>
</section>`;
  }

  /* ---------- Všechny recenze (podstránka) – karty skládané do sloupců ---------- */
  function renderReviewsPage() {
    const t = S.testimonials || { items: [] };
    const items = (t.items || []).filter((it) => it.text);
    return `
<section class="blog-page reviews-page">
  <div class="container">
    <a class="link-arrow link-arrow--back" href="index.html#reference"><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-left')}</span><span class="link-arrow__text">Zpět na úvodní stránku</span></a>
    <header class="blog-head">
      <p class="kicker">${esc(t.eyebrow)}</p>
      <h1 class="h2">${fmt(t.pageTitle || t.title)}</h1>
      <p class="blog-head__intro">${fmt(t.intro)}</p>
      <p class="reviews-page__count">${items.length} ${PV.plural(items.length, 'recenze', 'recenze', 'recenzí')}</p>
    </header>
    <div class="review-wall">
      ${items.map((it, i) => `
      <figure class="review" id="recenze-${i + 1}">
        <blockquote><p>${PV.text(it.text)}</p></blockquote>
        ${reviewAuthor(it)}
      </figure>`).join('')}
    </div>
    <div class="post__cta">
      <div><h2>${esc(t.pageCtaTitle || 'Chcete taky v klidu k vlastnímu bydlení?')}</h2><p>${fmt(t.ask)}</p></div>
      ${btn(S.navCta, { to: href('rezervace'), attrs: 'data-book data-track="cta_reviews_page"' })}
    </div>
  </div>
</section>`;
  }

  /* ---------- Časté otázky (volitelné) ---------- */
  function renderFaq() {
    if (!on('showFaq') || !S.faq) return '';
    const f = S.faq;
    return `
<section class="section section--soft faq" id="otazky" aria-labelledby="faq-title">
  <div class="container faq__grid">
    <div class="faq__intro">
      ${eyebrow(f.eyebrow)}
      <h2 class="h2" id="faq-title">${fmt(f.title)}</h2>
      <p>${fmt(f.intro)}</p>
      <a class="glossary-card" href="slovnicek.html" data-track="glossary_open">
        <span><strong>${esc(f.glossaryTitle)}</strong><span>${fmt(f.glossaryText)}</span></span>
      </a>
      ${note(f.note)}
    </div>
    <div class="faq__list">
      ${f.items.map((it) => `
      <details class="faq__item" name="faq">
        <summary class="faq__q"><span>${fmt(it.q)}</span><span class="faq__sign" aria-hidden="true"></span></summary>
        <div class="faq__a">${PV.isPh(it.a) ? `<p><span class="ph">${PV.text(PV.stripPh(it.a))}</span></p>` : `<p>${fmt(it.a)}</p>`}</div>
      </details>`).join('')}
    </div>
  </div>
</section>`;
  }

  /* ---------- Slovníček pojmů (podstránka) ---------- */
  function renderGlossaryPage() {
    const f = S.faq || { glossaryGroups: [] };
    return `
<section class="blog-page">
  <div class="container">
    <a class="link-arrow link-arrow--back" href="index.html#otazky"><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-left')}</span><span class="link-arrow__text">Zpět na časté otázky</span></a>
    <header class="blog-head">
      <p class="kicker">Srozumitelně</p>
      <h1 class="h2">${esc(f.glossaryTitle)}</h1>
      <p class="blog-head__intro">${fmt(f.glossaryIntro || '')}</p>
    </header>
    ${f.glossaryGroups.map((group) => `<section class="glossary-group">
      <h2 class="glossary-group__title">${esc(group.title)}</h2>
      <dl class="glossary">${group.items.map((g) => `<div class="glossary__item"><dt>${esc(g.term)}</dt><dd>${PV.text(g.def)}</dd></div>`).join('')}</dl>
    </section>`).join('')}
    <div class="post__cta">
      <div><h2>Něco tu chybí?</h2><p>Zeptejte se mě, vysvětlím vám to osobně a bez zkratek.</p></div>
      ${btn(S.navCta, { to: href('rezervace'), attrs: 'data-book data-track="cta_glossary"' })}
    </div>
  </div>
</section>`;
  }

  /* ---------- Certifikace (podstránka) ---------- */
  function renderCertificationsPage() {
    const c = S.certifications || { items: [] };
    return `
<section class="blog-page">
  <div class="container">
    <a class="link-arrow link-arrow--back" href="index.html"><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-left')}</span><span class="link-arrow__text">Zpět na úvodní stránku</span></a>
    <header class="blog-head">
      <p class="kicker">${esc(c.eyebrow)}</p>
      <h1 class="h2">${esc(c.title)}</h1>
      <p class="blog-head__intro">${fmt(c.intro)}</p>
    </header>
    <ul class="certs" role="list">
      ${c.items.map((it) => `
      <li><a class="cert" href="${esc(it.img)}" data-cert data-track="cert_open">
        <span class="cert__img"><img src="${esc(it.img)}" alt="${esc(it.title)}" loading="lazy" decoding="async"></span>
        <span class="cert__body"><strong class="cert__title">${PV.text(it.title)}</strong><span class="cert__meta">${esc(it.issuer)} · ${esc(it.date)}</span></span>
      </a></li>`).join('')}
    </ul>
    <div class="post__cta">
      <div><h2>Chcete to probrat osobně?</h2><p>Domluvte si schůzku, ať už kupujete první bydlení, nebo řešíte refinancování.</p></div>
      ${btn(S.navCta, { to: href('rezervace'), attrs: 'data-book data-track="cta_certifications"' })}
    </div>
  </div>
</section>
<dialog class="cert-view" data-cert-view aria-label="Zvětšený dokument">
  <div class="cert-view__bar">
    <p class="cert-view__caption" data-cert-caption></p>
    <button class="reviews__btn" type="button" data-cert-prev aria-label="Předchozí dokument">${icon('arrow-left')}</button>
    <button class="reviews__btn" type="button" data-cert-next aria-label="Další dokument">${icon('arrow-right')}</button>
    <button class="reviews__btn" type="button" data-cert-close autofocus aria-label="Zavřít">${icon('close')}</button>
  </div>
  <img class="cert-view__img" data-cert-img alt="">
</dialog>`;
  }

  /* ---------- Kancelář a kontakt ---------- */
  const mapArt = `
    <svg class="map__art" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="400" fill="#E9F2DA"/>
      <g fill="#DCEAC6">
        <rect x="30" y="24" width="180" height="120" rx="14"/><rect x="250" y="24" width="140" height="78" rx="14"/>
        <rect x="500" y="20" width="230" height="96" rx="14"/><rect x="40" y="246" width="210" height="126" rx="14"/>
        <rect x="300" y="236" width="150" height="150" rx="14"/><rect x="610" y="232" width="170" height="146" rx="14"/>
      </g>
      <path d="M470 140c44-22 120-12 140 22s-12 74-64 74-118-12-118-44 0-36 42-52z" fill="#C8E0A4"/>
      <path d="M-20 334C120 302 186 372 324 352S566 262 820 304" stroke="#BFD9E6" stroke-width="22" fill="none" stroke-linecap="round"/>
      <g stroke="#fff" stroke-linecap="round" fill="none">
        <path d="M0 200H800" stroke-width="16"/><path d="M432 0V400" stroke-width="14"/>
        <path d="M228 0 300 400" stroke-width="9"/><path d="M0 116c200 22 300-30 432 4s268 48 368 28" stroke-width="8"/>
      </g>
    </svg>`;

  // Mapa Google se načte hned; bez adresy zůstane jen ilustrace s odkazem
  function renderMap(o, c) {
    const q = o.mapQuery ? encodeURIComponent(o.mapQuery) : '';
    const openUrl = PV.safeUrl(o.mapUrl) || (q ? `https://www.google.com/maps/search/?api=1&query=${q}` : '');
    const routeUrl = q ? `https://www.google.com/maps/dir/?api=1&destination=${q}` : '';
    const links = `
          <div class="map__actions">
            ${openUrl ? `<a class="link-arrow" href="${esc(openUrl)}" target="_blank" rel="noopener" data-track="map_open"><span class="link-arrow__text">${esc(c.mapCta || 'Otevřít mapu')}</span><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-up-right')}</span></a>` : ''}
            ${routeUrl ? `<a class="link-arrow" href="${esc(routeUrl)}" target="_blank" rel="noopener" data-track="map_route"><span class="link-arrow__text">${esc(c.routeCta || 'Naplánovat trasu')}</span><span class="link-arrow__icon" aria-hidden="true">${icon('arrow-up-right')}</span></a>` : ''}
          </div>`;
    if (!q) {
      return `
      <div class="map">
        ${mapArt}
        <span class="map__pin" aria-hidden="true">${icon('home')}</span>
        <div class="map__overlay"><p>${fmt(o.street)}, ${fmt(o.city)}</p>${links}</div>
      </div>`;
    }
    return `
      <div class="map map--live">
        <div class="map__stage">
          ${mapArt}
          <p class="map__fallback" data-map-fallback data-url="${esc(openUrl)}" data-cta="${esc(c.mapFallbackCta || 'Otevřít mapu')}">${esc(c.mapFallback || '')}</p>
          <iframe class="map__frame" src="https://www.google.com/maps?q=${q}&amp;hl=cs&amp;z=16&amp;output=embed" title="Mapa: ${esc(o.mapQuery)}" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        </div>
        <div class="map__overlay"><p><strong>${fmt(o.name || c.officeTitle)}</strong><br>${fmt(o.street)}, ${fmt(o.city)}</p>${links}</div>
      </div>`;
  }

  function renderContact() {
    const c = S.contactSection;
    const o = (S.offices || [])[0] || {};
    const call = C.phoneHref ? linkArrow(c.callCta, `tel:${esc(C.phoneHref)}`, 'data-track="contact_phone_cta"', 'phone') : '';
    const detail = (iconName, label, value) => `<div class="detail"><span class="detail__icon" aria-hidden="true">${icon(iconName)}</span><div><dt>${esc(label)}</dt><dd>${value}</dd></div></div>`;
    return `
<section class="section contact" id="kontakt" aria-labelledby="contact-title">
  <div class="container">
    ${sectionHead(c.eyebrow, c.title, c.intro, 'contact-title')}
    <div class="contact__grid">
      <div class="contact__card">
        <dl class="details">
          ${detail('pin', o.name ? PV.stripPh(o.name) : c.officeTitle, `${fmt(o.street)}<br>${fmt(o.city)}${o.access ? `<br><span class="muted">${fmt(o.access)}</span>` : ''}`)}
          ${detail('clock', 'Schůzky', fmt(o.hours))}
          ${detail('phone', 'Telefon', phoneValue())}
          ${detail('mail', 'E-mail', emailValue())}
        </dl>
        <div class="contact__actions">
          ${btn(S.navCta, { to: href('rezervace'), attrs: 'data-book data-track="cta_contact"' })}
          ${call}
        </div>
      </div>
      ${renderMap(o, c)}
    </div>
  </div>
</section>`;
  }

  /* ---------- Patička ---------- */
  function renderFooter() {
    const f = S.footer;
    const liveSocial = S.social.filter((x) => PV.safeUrl(x.url));
    const legalLinks = f.legalLinks.map((l) => (l.action === 'cookies'
      ? `<li><button type="button" data-open-consent>${esc(l.label)}</button></li>`
      : `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)).join('');
    return `
<footer class="site-footer">
  <div class="container">
    <div class="footer__cta">
      <p class="footer__claim">${esc(S.brand.claim)}</p>
      ${btn(S.navCta, { to: href('rezervace'), cls: 'btn--lime btn--lg', attrs: 'data-book data-track="cta_footer"' })}
    </div>
    <div class="footer__top">
      <div class="footer__brand">
        ${logo()}
        ${liveSocial.length ? `<div class="footer__social">${liveSocial.map((s) => `<a href="${esc(PV.safeUrl(s.url))}" target="_blank" rel="noopener" aria-label="${esc(s.label)}" data-track="social_${esc(s.id)}">${icon(s.id)}</a>`).join('')}</div>` : ''}
      </div>
      <div>
        <p class="footer__title">Na webu</p>
        <ul class="footer__links footer__links--nav">${navItems.filter((n) => n.footer).map((n) => `<li><a href="${n.url || href(n.target)}">${esc(n.footerLabel || n.label)}</a></li>`).join('')}</ul>
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
    <dl class="footer__legal">${f.legal.map((l) => `<div><dt>${esc(l.label)}</dt><dd>${fmt(l.value)}</dd></div>`).join('')}</dl>
    <div class="footer__bottom">
      <p>© ${new Date().getFullYear()} ${esc(S.brand.name)}${proto ? ` · ${esc(f.prototypeNote)}` : ''}<span class="footer__credit">${f.credit && PV.safeUrl(f.credit.url) ? `<a href="${esc(PV.safeUrl(f.credit.url))}" target="_blank" rel="noopener" data-track="credit">${esc(f.credit.label)}</a>` : esc((f.credit || {}).label || '')}</span></p>
      <button class="to-top" type="button" data-to-top>Zpět nahoru ${icon('arrow-up')}</button>
    </div>
  </div>
</footer>`;
  }

  /* ---------- Překryvné prvky ---------- */
  function renderOverlays() {
    const contacts = [
      `<p>${icon('phone')}${phoneValue()}</p>`,
      `<p>${icon('mail')}${emailValue()}</p>`,
    ].join('');
    return `
<dialog class="menu" id="mobile-menu" aria-label="Menu">
  <div class="menu__inner">
    <div class="menu__top">${logo()}<button class="menu__close" type="button" data-menu-close autofocus aria-label="Zavřít menu">${icon('close')}</button></div>
    <nav aria-label="Mobilní navigace">
      <ul class="menu__list">${mainNav.map((n) => `<li><a class="menu__link" href="${n.url || href(n.target)}" data-menu-link>${esc(n.label)}${icon('arrow-right')}</a></li>`).join('')}</ul>
    </nav>
    ${btn(S.navCta, { to: href('rezervace'), cls: 'btn--primary btn--block btn--lg', attrs: 'data-book data-menu-link data-track="cta_menu"' })}
    <div class="menu__contacts">${contacts}</div>
  </div>
</dialog>
<div class="mobile-cta" data-mobile-cta>
  ${btn(S.navCta, { to: href('rezervace'), cls: 'btn--primary', attrs: 'data-book data-track="cta_mobile_bar"' })}
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

  // Služby: přepínání situací (záložky, ovládání i šipkami)
  function initServices() {
    const root = $('[data-picker]');
    if (!root) return;
    const tabs = $$('[role="tab"]', root);
    const vertical = () => window.matchMedia('(min-width: 901px)').matches;
    const select = (i, focus) => {
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tabs[i].focus();
      // na mobilu je detail pod mřížkou – po klepnutí k němu stránka sjede, pokud není vidět
      const panel = document.getElementById(tabs[i].getAttribute('aria-controls'));
      if (!vertical() && !focus && panel.getBoundingClientRect().top > window.innerHeight * .6) {
        panel.scrollIntoView({ block: 'start', behavior: PV.reducedMotion.matches ? 'auto' : 'smooth' });
      }
      PV.track('service_select', { service: tabs[i].getAttribute('aria-controls') });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i, false));
      t.addEventListener('keydown', (e) => {
        const map = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select((map[e.key] + tabs.length) % tabs.length, true);
      });
    });
  }

  // Reference: pás ovládaný ručně (šipky, klávesnice, prst); sám se neposouvá
  function initReviews() {
    const m = $('[data-reviews]');
    if (!m) return;
    const track = $('.reviews__track', m);
    const items = Array.from(track.children);
    const prev = $('[data-reviews-prev]');
    const next = $('[data-reviews-next]');

    // „Celá recenze“ jen u karet, kde se text do zkráceného prostoru nevejde
    const markLong = () => items.forEach((card) => {
      const p = $('.review__text', card);
      const more = $('.review__more', card);
      if (p && more) more.hidden = p.scrollHeight <= p.clientHeight + 2;
    });
    const syncButtons = () => {
      const max = m.scrollWidth - m.clientWidth - 2;
      if (prev) prev.disabled = m.scrollLeft <= 2;
      if (next) next.disabled = m.scrollLeft >= max;
    };
    const go = (dir) => {
      const step = items[1] ? items[1].offsetLeft - items[0].offsetLeft : 340;
      m.scrollBy({ left: dir * step, behavior: PV.reducedMotion.matches ? 'auto' : 'smooth' });
    };

    markLong();
    syncButtons();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { markLong(); syncButtons(); });
    m.addEventListener('scroll', PV.debounce(syncButtons, 60), { passive: true });
    window.addEventListener('resize', PV.debounce(() => { markLong(); syncButtons(); }, 200));
    m.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      go(e.key === 'ArrowRight' ? 1 : -1);
    });
    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
  }

  // Partneři: stejná optická velikost log (podle plochy, ne šířky) a pozastavení pásu
  function initPartners() {
    const root = $('[data-partners]');
    if (!root) return;
    const fit = (img) => {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (!ratio || !Number.isFinite(ratio)) return;
      const area = window.innerWidth < 760 ? 1900 : 2600;
      let h = Math.min(44, Math.max(18, Math.sqrt(area / ratio)));
      let w = h * ratio;
      if (w > 138) { w = 138; h = w / ratio; }
      img.style.width = `${Math.round(w)}px`;
      img.style.height = `${Math.round(h)}px`;
    };
    const imgs = $$('img', root);
    const fitAll = () => imgs.forEach((img) => { if (img.complete) fit(img); });
    imgs.forEach((img) => img.addEventListener('load', () => fit(img)));
    fitAll();
    window.addEventListener('resize', PV.debounce(fitAll, 200));

    const pause = $('[data-partners-pause]', root);
    pause.addEventListener('click', () => {
      const paused = root.classList.toggle('is-paused');
      pause.setAttribute('aria-pressed', String(paused));
      pause.setAttribute('aria-label', paused ? 'Spustit pás partnerů' : 'Pozastavit pás partnerů');
    });

    // Pás jede sám a jde k tomu táhnout myší nebo prstem; při omezeném pohybu zůstává statický
    if (PV.reducedMotion.matches) return;
    const box = $('.partners__marquee', root);
    const track = $('.partners__track', root);
    const lists = $$('.partners__list', track);
    const speed = 30; // px za vteřinu
    let cycle = 1;    // šířka dvou sad log = délka smyčky
    let pos = 0;
    let velocity = 0; // dojezd po puštění
    let drag = null;
    let hover = false;
    let focus = false;
    let visible = true;
    let holdUntil = 0;
    let last = performance.now();

    const measure = () => { cycle = (lists[2].offsetLeft - lists[0].offsetLeft) || 1; };
    // poloha se vždy přepočítá do jedné smyčky, takže ani při tažení nevznikne prázdné místo
    const paint = () => { track.style.transform = `translate3d(${-(((pos % cycle) + cycle) % cycle)}px, 0, 0)`; };
    measure();
    imgs.forEach((img) => img.addEventListener('load', measure));
    window.addEventListener('resize', PV.debounce(measure, 220));

    box.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover = true; });
    box.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hover = false; });
    box.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, pos, lastX: e.clientX, lastT: performance.now() };
      velocity = 0;
      box.setPointerCapture(e.pointerId);
      box.classList.add('is-drag');
    });
    box.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const now = performance.now();
      velocity = ((drag.lastX - e.clientX) / Math.max(1, now - drag.lastT)) * 1000;
      drag.lastX = e.clientX;
      drag.lastT = now;
      pos = drag.pos + (drag.x - e.clientX);
    });
    const release = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (performance.now() - drag.lastT > 90) velocity = 0;
      velocity = Math.max(-900, Math.min(900, velocity));
      drag = null;
      holdUntil = performance.now() + 1500;
      box.classList.remove('is-drag');
    };
    box.addEventListener('pointerup', release);
    box.addEventListener('pointercancel', release);

    root.addEventListener('focusin', (e) => { focus = e.target.matches(':focus-visible'); });
    root.addEventListener('focusout', () => { focus = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(box);

    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!drag) {
        if (Math.abs(velocity) > 5) {
          pos += velocity * dt;
          velocity *= Math.exp(-4 * dt);
        } else {
          velocity = 0;
          const stopped = hover || focus || root.classList.contains('is-paused') || now < holdUntil || !visible || document.hidden;
          if (!stopped) pos += speed * dt;
        }
      }
      if (!drag) pos = ((pos % cycle) + cycle) % cycle;
      paint();
      window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  }

  // Orientační kalkulačka splátky (anuitní splácení)
  function initCalculator() {
    const root = $('[data-calculator]');
    if (!root) return;
    const c = S.calculator;
    const num = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 });
    const pct = new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const czk = (v) => `${num.format(Math.round(v))} Kč`;
    const percent = (v) => `${pct.format(v)} %`;
    const out = (k) => $(`[data-out="${k}"]`, root);
    const message = $('[data-calc-message]', root);
    const toggle = $('[data-calc-toggle]', root);
    const compare = $('[data-calc-compare]', root);
    const live = $('[data-calc-live]', root);
    const result = $('[data-calc-result]', root);
    const years = $('[data-calc-select="years"]', root);
    const fixation = $('[data-calc-select="fixation"]', root);
    const KEYS = ['guarantee', 'credit'];
    const state = { mode: c.modes[0], guarantee: 0, credit: 0, insurance: true };
    let offers = [];
    let request = 0;
    let used = false;

    const announce = PV.debounce((text) => { live.textContent = text; }, 700);
    const markUsed = () => { if (!used) { used = true; PV.track('calculator_used'); } };

    const showValue = (k) => {
      const range = $(`[data-calc-range="${k}"]`, root);
      range.value = state[k];
      range.style.setProperty('--fill', `${Math.min(100, Math.max(0, ((state[k] - range.min) / (range.max - range.min)) * 100))}%`);
      range.setAttribute('aria-valuetext', czk(state[k]));
    };
    const showText = (k) => { $(`[data-calc-text="${k}"]`, root).value = num.format(state[k]); };

    const setMode = (mode) => {
      state.mode = mode;
      $$('[data-calc-mode]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.calcMode === mode.id)));
      KEYS.forEach((k) => {
        const range = $(`[data-calc-range="${k}"]`, root);
        range.min = mode[k].min;
        range.max = mode[k].max;
        state[k] = mode[k].value;
        $(`[data-min="${k}"]`, root).textContent = czk(mode[k].min);
        $(`[data-max="${k}"]`, root).textContent = czk(mode[k].max);
        showValue(k);
        showText(k);
      });
      years.innerHTML = Array.from({ length: mode.maxYears - 4 }, (_, i) => i + 5)
        .map((y) => `<option value="${y}"${y === mode.years ? ' selected' : ''}>${y} ${PV.plural(y, 'rok', 'roky', 'let')}</option>`).join('');
    };

    const fieldError = () => {
      const k = state.mode;
      if (state.guarantee < k.guarantee.min || state.guarantee > k.guarantee.max) return ['guarantee', `Zadejte částku od ${czk(k.guarantee.min)} do ${czk(k.guarantee.max)}.`];
      if (state.credit < k.credit.min || state.credit > k.credit.max) return ['credit', `Zadejte částku od ${czk(k.credit.min)} do ${czk(k.credit.max)}.`];
      if (state.credit > c.maxLtv * state.guarantee) return ['credit', c.ltvError];
      return null;
    };

    const clearResult = (text) => {
      offers = [];
      ['payment', 'rate', 'apr', 'insurance', 'costs'].forEach((k) => { out(k).textContent = '–'; });
      message.textContent = text || '';
      message.hidden = !text;
      toggle.disabled = true;
      closeCompare();
    };

    const closeCompare = () => {
      compare.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('span').textContent = c.compareCta;
    };

    // Logo podle názvu banky ze seznamu partnerů; neznámá banka má jen prázdné místo a název
    const bankLogo = (name) => {
      const bank = (S.why.banks || []).find((b) => b.name.toLowerCase() === name.toLowerCase());
      return `<span class="calc__bank-logo">${bank ? `<img src="${esc(bank.logo)}" alt="" loading="lazy" decoding="async">` : ''}</span>`;
    };

    const renderRows = (best) => {
      $('[data-col-insurance]', root).hidden = !state.insurance;
      $('[data-calc-rows]', root).innerHTML = offers.map((o) => `
            <tr${o === best ? ' class="is-best"' : ''}>
              <td data-label="Banka"><span class="calc__bank">${bankLogo(o.bankName)}<span><strong>${esc(o.bankName)}</strong><span class="calc__product">${esc(o.productName)}</span></span></span></td>
              <td data-label="Úrok">${percent(o.interestRate)}</td>
              <td data-label="RPSN">${percent(o.apr)}</td>
              <td data-label="Splátka">${czk(o.monthlyPayment)}</td>
              ${state.insurance ? `<td data-label="Pojištění">${czk(o.riskInsurance)}</td>` : ''}
              <td data-label="Náklady za fixaci">${czk(o.totalFixationCosts)}</td>
            </tr>`).join('');
    };

    const showResult = (list) => {
      offers = list.slice().sort((a, b) => a.interestRate - b.interestRate);
      if (!offers.length) { clearResult(c.emptyError); return; }
      const best = offers.reduce((a, o) => (o.monthlyPayment < a.monthlyPayment ? o : a), offers[0]);
      out('payment').textContent = czk(best.monthlyPayment);
      out('rate').textContent = percent(best.interestRate);
      out('apr').textContent = percent(best.apr);
      out('insurance').textContent = czk(best.riskInsurance);
      out('costs').textContent = czk(best.totalFixationCosts);
      $('[data-out-wrap="insurance"]', root).hidden = !state.insurance;
      message.hidden = true;
      toggle.disabled = false;
      renderRows(best);
      announce(`Orientační měsíční splátka ${czk(best.monthlyPayment)} při úroku ${percent(best.interestRate)}.`);
    };

    const calculate = async () => {
      const id = ++request;
      try {
        const res = await fetch(c.endpoint, {
          method: 'POST',
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credit: { credit: state.credit, purpose: state.mode.id, estateType: 'flat', guarantee: state.guarantee, repayment: years.value, fixation: fixation.value, riskInsurance: true },
            mainTab: { refinancingWithIncrease: true, milderConditions: true, domiciliationAmount: 2147483647, propertyInsurance: true, riskInsurance: state.insurance, withdrawOnProposal: true, hbBuy: true, hbClient: true, hbAlone: true, hbIncome: 2147483647, sbEstatePurchase: true, hbGreen: true },
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const list = await res.json();
        if (id !== request) return;
        if (!Array.isArray(list)) throw new Error('format');
        showResult(list);
      } catch (e) {
        if (id === request) clearResult(c.loadError);
      } finally {
        if (id === request) result.removeAttribute('aria-busy');
      }
    };
    const calculateSoon = PV.debounce(calculate, 400);

    const update = () => {
      const err = fieldError();
      KEYS.forEach((k) => {
        const el = $(`[data-calc-error="${k}"]`, root);
        el.textContent = err && err[0] === k ? err[1] : '';
        el.hidden = !(err && err[0] === k);
      });
      if (err) {
        request++;
        result.removeAttribute('aria-busy');
        clearResult('');
        return;
      }
      result.setAttribute('aria-busy', 'true');
      calculateSoon();
    };

    KEYS.forEach((k) => {
      const range = $(`[data-calc-range="${k}"]`, root);
      const text = $(`[data-calc-text="${k}"]`, root);
      range.addEventListener('input', () => {
        state[k] = Number(range.value);
        showValue(k);
        showText(k);
        update();
        markUsed();
      });
      text.addEventListener('input', () => {
        state[k] = parseInt(text.value.replace(/\D/g, ''), 10) || 0;
        showValue(k);
        update();
        markUsed();
      });
      text.addEventListener('blur', () => showText(k));
    });
    [years, fixation].forEach((el) => el.addEventListener('change', () => { update(); markUsed(); }));
    $$('[data-calc-mode]', root).forEach((b) => b.addEventListener('click', () => {
      setMode(c.modes.find((m) => m.id === b.dataset.calcMode));
      update();
      markUsed();
    }));
    $$('[data-calc-insurance]', root).forEach((b) => b.addEventListener('click', () => {
      state.insurance = b.dataset.calcInsurance === '1';
      $$('[data-calc-insurance]', root).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      update();
      markUsed();
    }));
    toggle.addEventListener('click', () => {
      const open = compare.hidden;
      compare.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('span').textContent = open ? c.compareHide : c.compareCta;
      if (open) PV.track('calculator_compare');
    });

    toggle.disabled = true;
    setMode(c.modes[0]);
    result.setAttribute('aria-busy', 'true');
    calculate();
  }

  // Certifikace – zvětšený dokument přímo na stránce
  function initCertViewer() {
    const view = $('[data-cert-view]');
    if (!view) return;
    const links = $$('[data-cert]');
    const img = $('[data-cert-img]', view);
    const caption = $('[data-cert-caption]', view);
    let current = 0;
    const show = (i) => {
      current = (i + links.length) % links.length;
      const source = links[current].querySelector('img');
      img.src = links[current].getAttribute('href');
      img.alt = source.alt;
      caption.textContent = source.alt;
    };
    links.forEach((a, i) => a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      show(i);
      view.showModal();
    }));
    $('[data-cert-prev]', view).addEventListener('click', () => show(current - 1));
    $('[data-cert-next]', view).addEventListener('click', () => show(current + 1));
    $('[data-cert-close]', view).addEventListener('click', () => view.close());
    view.addEventListener('click', (e) => { if (e.target === view) view.close(); });
    view.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    view.addEventListener('close', () => links[current].focus());
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

  // Mapa: když se do 8 sekund nenačte, místo „Mapa se načítá“ nabídneme odkaz
  function initMap() {
    const frame = $('.map__frame');
    const note = $('[data-map-fallback]');
    if (!frame || !note) return;
    const timer = window.setTimeout(() => {
      frame.style.visibility = 'hidden';
      note.innerHTML = `<a href="${esc(note.dataset.url)}" target="_blank" rel="noopener" data-track="map_fallback">${esc(note.dataset.cta)}</a>`;
    }, 8000);
    frame.addEventListener('load', () => {
      window.clearTimeout(timer);
      frame.style.visibility = '';
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

  /* ---------- Start ---------- */
  function mount(selector, html) {
    const el = $(selector);
    if (el) el.outerHTML = html;
  }

  mount('[data-render="header"]', renderHeader());
  if (isHome) {
    $('#main').innerHTML = [
      renderHero(), renderServices(), renderWhy(), renderTestimonials(), renderAbout(), renderTeam(),
      renderProcess(), renderTools(), renderBooking(), renderInsta(), renderBlogTeaser(), renderFaq(), renderContact(),
    ].join('');
  }
  if (page === 'glossary') $('#main').innerHTML = renderGlossaryPage();
  if (page === 'reviews') $('#main').innerHTML = renderReviewsPage();
  if (page === 'certifications') $('#main').innerHTML = renderCertificationsPage();
  mount('[data-render="footer"]', renderFooter() + renderOverlays());

  if (isHome) PV.booking.init(document.getElementById('booking-widget'), S.booking, S);

  initHeader();
  initScrollSpy();
  initServices();
  initReviews();
  initPartners();
  initCalculator();
  initFaq();
  initCertViewer();
  initBookLinks();
  initContact();
  initMap();
  initMobileCTA();
  initProto();
  initGlobalClicks();
  PV.attribution();

  // Po načtení se posuneme na kotvu z adresy (obsah se vykresluje skriptem)
  if ((isHome || page === 'reviews') && window.location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) window.requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto', block: 'start' }));
  }
})();
