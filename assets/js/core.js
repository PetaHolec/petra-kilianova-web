/* ==========================================================================
   Sdílené nástroje – ikony, formátování textu, fotografie, validace,
   ukládání a měření.
   ========================================================================== */
(function () {
  'use strict';

  const PV = (window.PV = window.PV || {});

  PV.$ = (sel, root = document) => root.querySelector(sel);
  PV.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  PV.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Text ---------- */
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  PV.esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ESC[c]);

  // Česká typografie: nezlomitelná mezera za jednopísmennými předložkami a spojkami.
  const nbsp = (s) => {
    const re = /(^|[\s(„*])([aikosuvzAIKOSUVZ])\s+/g;
    return s.replace(re, '$1$2 ').replace(re, '$1$2 ');
  };

  PV.text = (v) => nbsp(PV.esc(v));

  // *kurzíva* a [zástupný údaj] → HTML
  PV.fmt = (v) => PV.text(v)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]/g, '<span class="ph">$1</span>');

  PV.isPh = (v) => /^\s*\[[^\]]*\]\s*$/.test(String(v || ''));
  PV.hasPh = (v) => /\[[^\]]*\]/.test(String(v || ''));
  PV.stripPh = (v) => String(v || '').replace(/[[\]]/g, '');
  PV.cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  PV.pad = (n) => String(n).padStart(2, '0');

  PV.plural = (n, one, few, many) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);

  // Povolené adresy: http(s), relativní cesty, případně obrázky jako data URL.
  PV.safeUrl = (url, { allowData = false } = {}) => {
    if (!url || typeof url !== 'string') return '';
    const u = url.trim();
    if (allowData && /^data:image\/(png|jpe?g|webp|avif|gif);base64,[a-z0-9+/=]+$/i.test(u)) return u;
    if (/^https?:\/\/[^\s"'<>]+$/i.test(u)) return u;
    if (!u.includes(':') && !u.startsWith('//') && !/[\s"'<>]/.test(u)) return u;
    return '';
  };

  /* ---------- Ikony (vlastní tenké linky, 24 × 24) ---------- */
  const ICONS = {
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
    'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
    'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
    'chevron-left': '<path d="m14.5 6-6 6 6 6"/>',
    'chevron-right': '<path d="m9.5 6 6 6-6 6"/>',
    'close': '<path d="M6 6l12 12M18 6 6 18"/>',
    'check': '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'play': '<path d="M8 5.6v12.8a.6.6 0 0 0 .9.5l10.2-6.4a.6.6 0 0 0 0-1L8.9 5.1a.6.6 0 0 0-.9.5z" fill="currentColor" stroke="none"/>',
    'office': '<path d="M6 21V11a6 6 0 0 1 12 0v10"/><path d="M3.5 21h17"/><path d="M10 21v-5a2 2 0 0 1 4 0v5"/>',
    'video': '<rect x="2.75" y="6" width="13.5" height="12" rx="2.75"/><path d="m16.25 10.5 5-3v9l-5-3"/>',
    'phone': '<path d="M5.3 3.75h3l1.6 4.3-2 1.45a11.6 11.6 0 0 0 6.6 6.6l1.45-2 4.3 1.6v3a1.9 1.9 0 0 1-2.05 1.9C10.25 20.1 3.9 13.75 3.4 5.8a1.9 1.9 0 0 1 1.9-2.05z"/>',
    'mail': '<rect x="3" y="5" width="18" height="14" rx="2.75"/><path d="m4 7 8 6 8-6"/>',
    'pin': '<path d="M12 21s-6.75-5.9-6.75-11.25a6.75 6.75 0 0 1 13.5 0C18.75 15.1 12 21 12 21z"/><circle cx="12" cy="9.75" r="2.4"/>',
    'clock': '<circle cx="12" cy="12" r="8.75"/><path d="M12 7.5V12l3 2"/>',
    'calendar': '<rect x="3.5" y="5" width="17" height="15.5" rx="2.75"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    'instagram': '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.1" cy="6.9" r=".7" fill="currentColor" stroke="none"/>',
    'linkedin': '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M8 10.5v6M8 7.6v.1M11.75 16.5v-6M11.75 13.2c0-1.6 1-2.7 2.4-2.7s2.35 1 2.35 2.7v3.3"/>',
    'camera': '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.25l1.5-2.25h5.5L16.25 7h2.25A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="12.75" r="3.4"/>',
    'sparkle': '<path d="M12 2.5c.6 4.9 2.6 6.9 9.5 9.5-6.9 2.6-8.9 4.6-9.5 9.5-.6-4.9-2.6-6.9-9.5-9.5 6.9-2.6 8.9-4.6 9.5-9.5z" fill="currentColor" stroke="none"/>',
    'edit': '<path d="M4 20h4L19 9a2.83 2.83 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    'info': '<circle cx="12" cy="12" r="8.75"/><path d="M12 11v5.25M12 7.75v.1"/>',
    'alert': '<circle cx="12" cy="12" r="8.75"/><path d="M12 7.75v5M12 16v.1"/>',
    'cookie': '<path d="M20.5 12.6A8.5 8.5 0 1 1 11.4 3.5a3 3 0 0 0 3.6 3.6 3 3 0 0 0 3.4 3.4 3 3 0 0 0 2.1 2.1z"/><path d="M8.5 9.5v.1M9 15v.1M14 15v.1M12 12v.1"/>',
    'eye': '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M3 3l18 18M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.9 3.7M6.4 6.4A17.4 17.4 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.4-1.1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    'trash': '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/>',
    'upload': '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M4.5 15v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15"/>',
    'download': '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M4.5 15v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15"/>',
    'copy': '<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5v-3a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/>',
    'refresh': '<path d="M20 11.5A8 8 0 0 0 5.6 7M4 4v4h4M4 12.5A8 8 0 0 0 18.4 17M20 20v-4h-4"/>',
    'map': '<path d="m9 4.5-5.5 2v13l5.5-2 6 2 5.5-2v-13l-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
    'grip': '<path d="M9 6v.1M15 6v.1M9 12v.1M15 12v.1M9 18v.1M15 18v.1" stroke-width="2.4"/>',
    'minus': '<path d="M7 12h10"/>',
    'home': '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.75 9.5V20h12.5V9.5"/><path d="M10 20v-5.5h4V20"/>',
    'key': '<circle cx="8" cy="15" r="4.25"/><path d="m11 12 8.5-8.5M16.5 6.5l2.5 2.5M14 9l2 2"/>',
    'hammer': '<path d="m13.5 6.5-9 9a1.77 1.77 0 0 0 2.5 2.5l9-9"/><path d="m12 5 3-2.5 6.5 6.5-2.5 3-2-2-1.5 1.5-2.5-2.5 1.5-1.5z"/>',
    'users': '<circle cx="9" cy="8.5" r="3.25"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M15.5 5.6a3.1 3.1 0 0 1 0 5.8M17.5 14.2a5.6 5.6 0 0 1 3.5 5.3"/>',
    'piggy': '<path d="M5 11.5a6.5 5.5 0 0 1 11.6-3.4H19l-.6 2.6 1.6 1.3v3l-2.2.6a6.8 6.8 0 0 1-2.3 2.2V20h-2.5v-1.5h-3V20H7.5v-2.6A5.4 5.4 0 0 1 5 13z"/><path d="M5 12.5H3.5M11 6.5h3M15.75 11.25v.1"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    'chat': '<path d="M4 5.5h16v10.5h-9.5L6 19.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    'bell': '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    'calculator': '<rect x="5" y="3" width="14" height="18" rx="2.75"/><path d="M8.5 7.5h7M8.75 12v.1M12 12v.1M15.25 12v.1M8.75 15.75v.1M12 15.75v.1M15.25 15.75v.1"/>',
  };

  PV.icon = (name, cls = '') =>
    `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

  // Logotypová značka – dvojitý oblouk (dveře domova)
  PV.archMark = (cls = '') =>
    `<svg class="${cls}" viewBox="0 0 22 30" fill="none" aria-hidden="true" focusable="false"><path d="M1.75 29V11a9.25 9.25 0 0 1 18.5 0v18" stroke="currentColor" stroke-width="1.5"/><path d="M6.75 29V12.75a4.25 4.25 0 0 1 8.5 0V29" stroke="#8EC63F" stroke-width="1.5"/></svg>`;

  /* ---------- Fotografie a zástupné plochy ----------
     Pokud je vyplněné src, vykreslí se obrázek. Jinak designový placeholder
     s popisem, co na dané místo patří. */
  PV.media = (m = {}, opts = {}) => {
    const esc = PV.esc;
    const ratio = String(opts.ratio || '4/5');
    const [rw, rh] = ratio.split('/').map(Number);
    const style = `--ratio:${rw} / ${rh};--arch-v:${((rw / rh) * 50).toFixed(2)}%`;
    const cls = ['media'];
    if (opts.shape) cls.push('media--' + opts.shape);
    if (opts.className) cls.push(opts.className);
    const src = PV.safeUrl(m.src, { allowData: true });

    if (src) {
      return `<figure class="${cls.join(' ')}" style="${style}"><img src="${esc(src)}" alt="${esc(m.alt || '')}" loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async"${opts.eager ? ' fetchpriority="high"' : ''}></figure>`;
    }

    cls.push('media--ph');
    const label = m.label || 'Fotografie';
    // rozměry a jednotky se nezalomí („1600 × 2000 px“, „4 : 5“)
    const hint = String(m.hint || '')
      .replace(/(\d) ([×:]) (\d)/g, '$1 $2 $3')
      .replace(/(\d) (px|min)\b/g, '$1 $2');
    return `<figure class="${cls.join(' ')}" style="${style}" role="img" aria-label="Místo pro fotografii: ${esc(label)}">
      <span class="media__marks" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <figcaption class="media__label" aria-hidden="true">${PV.icon(opts.icon || 'camera')}<strong>${esc(label)}</strong>${hint ? `<span>${esc(hint)}</span>` : ''}</figcaption>
    </figure>`;
  };

  /* ---------- Ukládání v prohlížeči (jen pro demo) ---------- */
  PV.store = {
    get(key) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* nic */ }
    },
  };

  /* ---------- Měření (dataLayer pro Google Tag Manager) ----------
     Události se zapisují vždy; nástroje se načtou až po souhlasu (consent.js). */
  PV.attribution = () => {
    try {
      const KEY = 'pv_utm';
      const params = new URLSearchParams(window.location.search);
      const utm = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
        const v = params.get(k);
        if (v) utm[k] = v.slice(0, 120);
      });
      if (Object.keys(utm).length) sessionStorage.setItem(KEY, JSON.stringify(utm));
      return JSON.parse(sessionStorage.getItem(KEY) || '{}');
    } catch (e) {
      return {};
    }
  };

  PV.track = (event, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event }, params));
  };

  /* ---------- Upozornění ---------- */
  let toastEl;
  let toastTimer;
  PV.toast = (message, iconName = 'info') => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    window.requestAnimationFrame(() => {
      toastEl.innerHTML = `${PV.icon(iconName)}<span>${PV.esc(message)}</span>`;
      toastEl.classList.add('is-shown');
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-shown'), 4600);
  };

  /* ---------- Formuláře ---------- */
  PV.field = ({ id, name, label, type = 'text', required = false, autocomplete = '', placeholder = '', validate = '', full = false, options = null, rows = 0, maxlength = 0 }) => {
    const esc = PV.esc;
    const errId = `${id}-error`;
    const mark = required ? '<span class="req" aria-hidden="true">*</span>' : '<span class="opt"> (nepovinné)</span>';
    const attrs = [
      `id="${id}"`, `name="${name}"`, 'class="field__input"', 'data-field',
      required ? 'required aria-required="true"' : '',
      `aria-describedby="${errId}"`,
      autocomplete ? `autocomplete="${autocomplete}"` : '',
      validate ? `data-validate="${validate}"` : '',
      maxlength ? `maxlength="${maxlength}"` : '',
    ].filter(Boolean).join(' ');

    let control;
    if (options) {
      control = `<select ${attrs}><option value="">Vyberte…</option>${options.map((o) => `<option value="${esc(o.id)}">${esc(o.label)}</option>`).join('')}</select>`;
    } else if (rows) {
      control = `<textarea ${attrs} rows="${rows}" placeholder="${esc(placeholder)}"></textarea>`;
    } else {
      const extra = type === 'tel' ? ' inputmode="tel"' : type === 'email' ? ' inputmode="email"' : '';
      control = `<input ${attrs} type="${type}" placeholder="${esc(placeholder)}"${extra}>`;
    }
    return `<div class="field${full ? ' field--full' : ''}"><label class="field__label" for="${id}">${esc(label)}${mark}</label>${control}<p class="field__error" id="${errId}"></p></div>`;
  };

  PV.forms = {
    messages: {
      name: 'Vyplňte prosím své jméno.',
      email: 'Zadejte prosím platný e-mail, např. jana@email.cz.',
      phone: 'Zadejte prosím telefon, např. +420 777 123 456.',
      message: 'Napište prosím pár slov o tom, co řešíte.',
      month: 'Vyberte měsíc, kdy fixace končí.',
      year: 'Vyberte rok.',
      consent: 'Bez vašeho souhlasu vám nemohu poslat připomenutí.',
      required: 'Toto pole je potřeba vyplnit.',
    },
    isEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    isPhone: (v) => {
      const digits = v.replace(/\D/g, '');
      return /^[+\d\s()/-]+$/.test(v.trim()) && digits.length >= 9 && digits.length <= 15;
    },
    validateField(input) {
      const v = input.value || '';
      const kind = input.dataset.validate || input.type;
      let error = '';
      const empty = input.type === 'checkbox' ? !input.checked : !v.trim();
      if (input.required && empty) error = this.messages[input.name] || this.messages.required;
      else if (v.trim() && kind === 'email' && !this.isEmail(v)) error = this.messages.email;
      else if (v.trim() && kind === 'phone' && !this.isPhone(v)) error = this.messages.phone;
      else if (v.trim() && input.dataset.pattern && !new RegExp(input.dataset.pattern).test(v.trim())) error = input.dataset.patternMsg || this.messages.required;
      this.setError(input, error);
      return !error;
    },
    setError(input, error) {
      input.setAttribute('aria-invalid', error ? 'true' : 'false');
      const errEl = document.getElementById(`${input.id}-error`);
      if (errEl) errEl.innerHTML = error ? `${PV.icon('alert')}<span>${PV.esc(error)}</span>` : '';
    },
    validate(form) {
      let first = null;
      PV.$$('[data-field]', form).forEach((input) => {
        if (!this.validateField(input) && !first) first = input;
      });
      form.dataset.validated = 'true';
      if (first) {
        first.focus({ preventScroll: true });
        (first.closest('.field') || first).scrollIntoView({ block: 'center', behavior: PV.reducedMotion.matches ? 'auto' : 'smooth' });
      }
      return !first;
    },
    reset(form) {
      form.reset();
      delete form.dataset.validated;
      PV.$$('[data-field]', form).forEach((input) => this.setError(input, ''));
    },
    bindLive(form) {
      form.addEventListener('input', (e) => {
        const t = e.target;
        if (t.matches('[data-field]') && t.getAttribute('aria-invalid') === 'true') this.validateField(t);
      });
      form.addEventListener('focusout', (e) => {
        const t = e.target;
        if (t.matches('[data-field]') && form.dataset.validated === 'true') this.validateField(t);
      });
      form.addEventListener('change', (e) => {
        const t = e.target;
        if (t.matches('[data-field]') && t.getAttribute('aria-invalid') === 'true') this.validateField(t);
      });
    },
  };

  PV.checkSvg = (cls = 'done-check') =>
    `<svg class="${cls}" viewBox="0 0 88 88" aria-hidden="true"><circle cx="44" cy="44" r="42" pathLength="1"/><path d="M28 45.5l10.5 10.5L61 33.5" pathLength="1"/></svg>`;

  PV.debounce = (fn, ms = 150) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };
})();
