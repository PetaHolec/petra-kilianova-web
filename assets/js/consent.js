/* ==========================================================================
   Souhlas s cookies (připraveno pro GDPR)
   --------------------------------------------------------------------------
   • Výchozí stav: vše kromě nezbytného je ZAMÍTNUTO (Google Consent Mode v2).
   • Skripty třetích stran (Google Tag Manager, Meta Pixel) se načtou až po
     souhlasu a jen pokud je v content/site.js vyplněné jejich ID.
   • Finální texty a kategorie je potřeba ověřit s právníkem.
   ========================================================================== */
(function () {
  'use strict';

  const KEY = 'pv_consent_v1';
  const VERSION = 1;
  const PV = window.PV;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });

  const listeners = [];
  let state = read();
  let el = null;

  function read() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      return s && s.v === VERSION ? s : null;
    } catch (e) {
      return null;
    }
  }

  function save(choice) {
    state = { v: VERSION, necessary: true, analytics: !!choice.analytics, marketing: !!choice.marketing, date: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* soukromé okno */ }
    apply();
    hide();
  }

  function apply() {
    if (!state) return;
    gtag('consent', 'update', {
      analytics_storage: state.analytics ? 'granted' : 'denied',
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied',
    });
    window.dataLayer.push({ event: 'consent_update', consent_analytics: state.analytics, consent_marketing: state.marketing });
    loadTags();
    listeners.forEach((fn) => { try { fn(state); } catch (e) { /* nic */ } });
  }

  // Načtení měřicích nástrojů – pouze se souhlasem a vyplněným ID
  function loadTags() {
    const t = (window.SITE && window.SITE.tracking) || {};

    if (t.gtmId && (state.analytics || state.marketing) && !window.__pvGtm) {
      window.__pvGtm = true;
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(t.gtmId);
      document.head.appendChild(s);
    }

    if (t.metaPixelId && state.marketing && !window.__pvPixel) {
      window.__pvPixel = true;
      /* eslint-disable */
      !function (f, b, e, v, n, t2, s2) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t2 = b.createElement(e); t2.async = !0; t2.src = v; s2 = b.getElementsByTagName(e)[0]; s2.parentNode.insertBefore(t2, s2); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', t.metaPixelId);
      window.fbq('track', 'PageView');
    }
  }

  function render() {
    const icon = PV.icon;
    el = document.createElement('section');
    el.className = 'consent';
    el.setAttribute('aria-label', 'Souhlas s cookies');
    el.hidden = true;
    el.innerHTML = `
      <h2 class="consent__title">${icon('cookie')}Cookies a soukromí</h2>
      <p class="consent__text">Web používá jen technologie nutné pro svůj chod. Analytické a marketingové cookies zapneme pouze s vaším souhlasem. Více v <a href="ochrana-osobnich-udaju.html#cookies">zásadách ochrany osobních údajů</a>.</p>
      <div class="consent__prefs" data-prefs hidden>
        <div class="consent__cat">
          <div class="consent__cat-text"><strong>Nezbytné</strong><span>Zajišťují základní funkce webu. Jsou vždy zapnuté.</span></div>
          <label class="switch"><input type="checkbox" checked disabled aria-label="Nezbytné cookies – vždy zapnuté"><span class="switch__track" aria-hidden="true"></span></label>
        </div>
        <div class="consent__cat">
          <div class="consent__cat-text"><strong>Analytické</strong><span>Souhrnné statistiky návštěvnosti, díky kterým web zlepšujeme.</span></div>
          <label class="switch"><input type="checkbox" data-cat="analytics" aria-label="Analytické cookies"><span class="switch__track" aria-hidden="true"></span></label>
        </div>
        <div class="consent__cat">
          <div class="consent__cat-text"><strong>Marketingové</strong><span>Měření kampaní na sociálních sítích a ve vyhledávačích.</span></div>
          <label class="switch"><input type="checkbox" data-cat="marketing" aria-label="Marketingové cookies"><span class="switch__track" aria-hidden="true"></span></label>
        </div>
      </div>
      <div class="consent__actions">
        <button class="btn btn--primary btn--noicon" type="button" data-consent="reject">Jen nezbytné</button>
        <button class="btn btn--primary btn--noicon" type="button" data-consent="accept">Přijmout vše</button>
        <button class="consent__more" type="button" data-consent="settings" aria-expanded="false">Nastavení</button>
      </div>
      <p class="consent__demo">${icon('info')}<span>Prototyp: zatím se nenačítají žádné analytické ani marketingové skripty.</span></p>`;
    document.body.appendChild(el);

    const prefs = el.querySelector('[data-prefs]');
    const settingsBtn = el.querySelector('[data-consent="settings"]');

    el.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-consent]');
      if (!btn) return;
      const action = btn.dataset.consent;
      if (action === 'accept') save({ analytics: true, marketing: true });
      if (action === 'reject') save({ analytics: false, marketing: false });
      if (action === 'settings') {
        if (prefs.hidden) {
          prefs.hidden = false;
          settingsBtn.textContent = 'Uložit výběr';
          settingsBtn.setAttribute('aria-expanded', 'true');
          prefs.querySelector('[data-cat="analytics"]').focus();
        } else {
          save({
            analytics: prefs.querySelector('[data-cat="analytics"]').checked,
            marketing: prefs.querySelector('[data-cat="marketing"]').checked,
          });
        }
      }
    });
  }

  function show(withPrefs) {
    if (!el) render();
    const prefs = el.querySelector('[data-prefs]');
    const settingsBtn = el.querySelector('[data-consent="settings"]');
    el.querySelector('[data-cat="analytics"]').checked = !!(state && state.analytics);
    el.querySelector('[data-cat="marketing"]').checked = !!(state && state.marketing);
    prefs.hidden = !withPrefs;
    settingsBtn.textContent = withPrefs ? 'Uložit výběr' : 'Nastavení';
    settingsBtn.setAttribute('aria-expanded', String(!!withPrefs));
    el.hidden = false;
  }

  function hide() {
    if (el) el.hidden = true;
  }

  window.PVConsent = {
    get: () => state,
    has: (category) => !!(state && state[category]),
    onChange: (fn) => listeners.push(fn),
    open: () => {
      show(true);
      const first = el.querySelector('[data-cat="analytics"]');
      if (first) first.focus();
    },
  };

  if (state) apply();
  else if (document.body.dataset.page !== 'admin') show(false);
})();
