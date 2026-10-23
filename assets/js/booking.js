/* ==========================================================================
   Rezervace schůzky – demonstrační widget
   --------------------------------------------------------------------------
   Architektura je připravená na výměnu „poskytovatele termínů“:
     provider.getSlots(datum, typSchůzky, nastavení) → [{ time, available }]
     provider.createBooking(data)                    → Promise<{ ok, reference }>

   V prototypu běží DemoProvider (smyšlené termíny, nic se neodesílá).
   Pro ostrý provoz stačí doplnit provider, který:
     • načte volné termíny z Cal.com API / Calendly API / Google kalendáře
       (přes vlastní malý backend – API klíče nesmí být v prohlížeči),
     • vytvoří rezervaci a pošle potvrzení e-mailem.
   Alternativa bez programování: v content/site.js nastavte
   booking.provider = 'external' a booking.externalUrl = odkaz na Cal.com/Calendly.
   ========================================================================== */
(function () {
  'use strict';

  const PV = window.PV;
  const { $, $$, esc, icon } = PV;

  const DOW = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
  const DOW_LONG = ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota', 'neděle'];
  const MONTHS = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
  const MONTHS_GEN = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

  const pad = PV.pad;
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const monthStart = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const dowIdx = (d) => (d.getDay() + 6) % 7; // 0 = pondělí
  const longDate = (d) => `${DOW_LONG[dowIdx(d)]} ${d.getDate()}. ${MONTHS_GEN[d.getMonth()]}`;
  const shortDate = (d) => `${DOW[dowIdx(d)].toLowerCase()} ${d.getDate()}. ${d.getMonth() + 1}.`;
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const slotWord = (n) => PV.plural(n, 'volný termín', 'volné termíny', 'volných termínů');

  /* ---------- Demo poskytovatel termínů ---------- */
  const SLOT_TEMPLATES = {
    office: ['9:00', '10:30', '13:00', '14:30', '16:00'],
    online: ['8:30', '10:00', '11:30', '13:30', '15:00', '16:30'],
    phone: ['8:00', '9:00', '10:00', '12:30', '14:00', '15:30', '17:00'],
  };

  const DemoProvider = {
    id: 'demo',
    getSlots(date, type, cfg) {
      const t0 = today();
      if (date <= t0 || date > addDays(t0, cfg.daysAhead || 45)) return [];
      if (dowIdx(date) > 4) return [];
      const key = iso(date);
      if (hash(key) % 7 === 0) return []; // ukázka plně obsazeného dne
      return (SLOT_TEMPLATES[type] || SLOT_TEMPLATES.office).map((time) => ({
        time,
        available: hash(key + type + time) % 10 > 3,
      }));
    },
    createBooking() {
      return new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        demo: true,
        reference: 'R-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
      }), 900));
    },
  };

  const providers = { demo: DemoProvider };

  /* ---------- Widget ---------- */
  function createWidget(root, cfg, site) {
    const provider = providers[cfg.provider] || DemoProvider;
    const types = cfg.types || [];
    const st = { step: 1, type: null, date: null, time: null, view: null };
    let pointerInput = false;

    const typeOptions = types.map((t) => `
      <label class="type-opt">
        <input type="radio" name="bk-type" value="${esc(t.id)}">
        <span class="type-opt__box">
          <span class="type-opt__icon" aria-hidden="true">${icon(t.icon)}</span>
          <span class="type-opt__content">
            <span class="type-opt__title">${esc(t.title)}</span>
            <span class="type-opt__text">${esc(t.text)}</span>
            <span class="type-opt__meta">${icon('clock')}cca ${esc(t.duration)} min</span>
          </span>
          <span class="type-opt__check" aria-hidden="true">${icon('check')}</span>
        </span>
      </label>`).join('');

    const next = (label) => `<button class="btn btn--primary" type="button" data-next disabled><span>${label}</span><span class="btn__icon" aria-hidden="true">${icon('arrow-right')}</span></button>`;
    const back = (label) => `<button class="bk__back" type="button" data-back aria-label="${label}">${icon('arrow-left')}</button>`;

    root.innerHTML = `
    <div class="bk">
      <div class="bk__body">
        <ol class="bk__steps" aria-label="Postup rezervace">
          <li data-ind="1">Typ schůzky</li>
          <li data-ind="2">Termín</li>
          <li data-ind="3">Kontakt</li>
        </ol>
        <p class="visually-hidden" aria-live="polite" data-live></p>

        <section class="bk__panel" data-panel="1" tabindex="-1" aria-labelledby="bk-t1">
          <fieldset>
            <legend class="bk__title" id="bk-t1">Jak se chcete potkat?</legend>
            <div class="type-grid">${typeOptions}</div>
          </fieldset>
          <div class="bk__actions"><p class="bk__hint">Krok 1 ze 3</p>${next('Vybrat termín')}</div>
        </section>

        <section class="bk__panel" data-panel="2" tabindex="-1" aria-labelledby="bk-t2" hidden>
          <div class="bk__head">${back('Zpět na výběr typu schůzky')}<h3 class="bk__title" id="bk-t2">Vyberte den a čas</h3></div>
          <div class="bk__summary" data-summary></div>
          <div class="cal-wrap">
            <div class="cal">
              <div class="cal__head">
                <p class="cal__month" id="bk-month" aria-live="polite"></p>
                <div class="cal__navs">
                  <button class="cal__nav" type="button" data-cal="-1" aria-label="Předchozí měsíc">${icon('chevron-left')}</button>
                  <button class="cal__nav" type="button" data-cal="1" aria-label="Další měsíc">${icon('chevron-right')}</button>
                </div>
              </div>
              <div class="cal__grid" role="grid" aria-labelledby="bk-month" data-grid></div>
              <p class="cal__legend">Dny s volnými termíny · ovládání i šipkami</p>
            </div>
            <div class="slots" data-slots></div>
          </div>
          <div class="bk__actions"><p class="bk__hint">Krok 2 ze 3</p>${next('Pokračovat')}</div>
        </section>

        <section class="bk__panel" data-panel="3" tabindex="-1" aria-labelledby="bk-t3" hidden>
          <div class="bk__head">${back('Zpět na výběr termínu')}<h3 class="bk__title" id="bk-t3">Na koho se mohu těšit?</h3></div>
          <div class="bk__summary" data-summary></div>
          <form class="bk-form" novalidate data-bk-form>
            <div class="form-grid">
              ${PV.field({ id: 'bk-name', name: 'name', label: 'Jméno a příjmení', required: true, autocomplete: 'name' })}
              ${PV.field({ id: 'bk-email', name: 'email', label: 'E-mail', type: 'email', required: true, autocomplete: 'email', validate: 'email' })}
              ${PV.field({ id: 'bk-phone', name: 'phone', label: 'Telefon', type: 'tel', required: true, autocomplete: 'tel', validate: 'phone' })}
              ${PV.field({ id: 'bk-topic', name: 'topic', label: 'S čím potřebujete pomoci?', options: site.topics || [] })}
              ${PV.field({ id: 'bk-note', name: 'note', label: 'Chcete mi něco vzkázat předem?', rows: 3, full: true, placeholder: 'Např. kupujeme první byt a máme rezervaci do konce měsíce…' })}
            </div>
            <div class="hp-field" aria-hidden="true"><label for="bk-company">Toto pole nevyplňujte</label><input id="bk-company" name="company" tabindex="-1" autocomplete="off"></div>
            <p class="form-privacy">Údaje použijeme jen k domluvení schůzky. Více v <a href="ochrana-osobnich-udaju.html">zásadách ochrany osobních údajů</a>.</p>
            <div class="bk__actions"><p class="bk__hint">Krok 3 ze 3</p><button class="btn btn--primary" type="submit"><span>Potvrdit rezervaci</span><span class="btn__icon" aria-hidden="true">${icon('arrow-right')}</span></button></div>
          </form>
        </section>

        <section class="bk__panel" data-panel="4" tabindex="-1" aria-labelledby="bk-t4" hidden>
          <div class="bk__done">
            ${PV.checkSvg()}
            <h3 class="bk__title" id="bk-t4">Děkuji, rezervace je hotová</h3>
            <p>Potvrzení s podrobnostmi vám přijde e-mailem.</p>
            <dl class="done-summary" data-done></dl>
            <button class="btn btn--ghost btn--noicon" type="button" data-restart>Nová rezervace</button>
          </div>
        </section>
      </div>
    </div>`;

    const live = $('[data-live]', root);
    const grid = $('[data-grid]', root);
    const monthEl = $('#bk-month', root);
    const slotsEl = $('[data-slots]', root);
    const prevBtn = $('[data-cal="-1"]', root);
    const nextBtn = $('[data-cal="1"]', root);
    const form = $('[data-bk-form]', root);

    const announce = (msg) => { live.textContent = ''; window.setTimeout(() => { live.textContent = msg; }, 60); };
    const typeObj = () => types.find((t) => t.id === st.type);
    const minMonth = () => monthStart(today());
    const maxMonth = () => monthStart(addDays(today(), cfg.daysAhead || 45));
    const freeCount = (date) => provider.getSlots(date, st.type, cfg).filter((s) => s.available).length;

    function firstAvailable() {
      for (let i = 1; i <= (cfg.daysAhead || 45); i++) {
        const d = addDays(today(), i);
        if (freeCount(d)) return d;
      }
      return null;
    }

    /* Kalendář */
    function renderCalendar(focusDate) {
      const v = st.view;
      monthEl.textContent = `${PV.cap(MONTHS[v.getMonth()])} ${v.getFullYear()}`;
      const daysInMonth = new Date(v.getFullYear(), v.getMonth() + 1, 0).getDate();
      const lead = dowIdx(v);
      const todayKey = iso(today());
      const cells = [];

      for (let i = 0; i < lead; i++) cells.push('<span class="cal__cell" role="gridcell"></span>');
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(v.getFullYear(), v.getMonth(), day);
        const key = iso(date);
        const free = freeCount(date);
        const selected = st.date && iso(st.date) === key;
        const label = `${longDate(date)} ${date.getFullYear()}, ${free ? `${free} ${slotWord(free)}` : 'bez volných termínů'}`;
        const cls = ['cal__day', free ? 'is-available' : '', selected ? 'is-selected' : '', key === todayKey ? 'is-today' : ''].filter(Boolean).join(' ');
        cells.push(`<span class="cal__cell" role="gridcell"${selected ? ' aria-selected="true"' : ''}><button type="button" class="${cls}" data-date="${key}" aria-label="${label}"${free ? '' : ' aria-disabled="true"'} tabindex="-1">${day}</button></span>`);
      }
      while (cells.length % 7) cells.push('<span class="cal__cell" role="gridcell"></span>');

      let html = `<div class="cal__row" role="row">${DOW.map((d, i) => `<span class="cal__dow" role="columnheader" aria-label="${DOW_LONG[i]}">${d}</span>`).join('')}</div>`;
      for (let i = 0; i < cells.length; i += 7) html += `<div class="cal__row" role="row">${cells.slice(i, i + 7).join('')}</div>`;
      grid.innerHTML = html;

      const target = (focusDate && grid.querySelector(`[data-date="${iso(focusDate)}"]`))
        || grid.querySelector('.is-selected') || grid.querySelector('.is-available') || grid.querySelector('.cal__day');
      if (target) target.tabIndex = 0;

      prevBtn.disabled = v <= minMonth();
      nextBtn.disabled = v >= maxMonth();
      return target;
    }

    function moveFocus(date) {
      const m = monthStart(date);
      if (m < minMonth() || m > maxMonth()) return;
      if (m.getTime() !== st.view.getTime()) {
        st.view = m;
        renderCalendar(date);
      }
      const btn = grid.querySelector(`[data-date="${iso(date)}"]`);
      if (!btn) return;
      $$('.cal__day', grid).forEach((b) => { b.tabIndex = -1; });
      btn.tabIndex = 0;
      btn.focus();
    }

    function renderSlots() {
      if (!st.date) {
        slotsEl.innerHTML = `<div class="slots__empty">${icon('calendar')}<span>Vyberte v kalendáři den<br>s volným termínem.</span></div>`;
        return;
      }
      const slots = provider.getSlots(st.date, st.type, cfg);
      const free = slots.filter((s) => s.available).length;
      const t = typeObj();
      slotsEl.innerHTML = `
        <fieldset>
          <legend class="slots__title">${esc(PV.cap(longDate(st.date)))}</legend>
          <p class="slots__sub">${free} ${slotWord(free)}${t ? ` · ${esc(t.duration)} min` : ''}</p>
          <div class="slots__grid">
            ${slots.map((s) => `<label class="slot"><input type="radio" name="bk-time" value="${s.time}"${s.available ? '' : ' disabled'}${st.time === s.time ? ' checked' : ''} aria-label="${s.time}${s.available ? '' : ' – obsazeno'}"><span>${s.time}</span></label>`).join('')}
          </div>
          <p class="slots__tz">Časy jsou uvedeny v pražském čase.</p>
        </fieldset>`;
    }

    function renderSummary() {
      const t = typeObj();
      const chips = [];
      if (t) chips.push(`<span class="bk__chip">${icon(t.icon)}${esc(t.title)}</span>`);
      if (st.date) chips.push(`<span class="bk__chip">${icon('calendar')}${esc(shortDate(st.date))}</span>`);
      if (st.time) chips.push(`<span class="bk__chip">${icon('clock')}${esc(st.time)}</span>`);
      $$('[data-summary]', root).forEach((el) => { el.innerHTML = chips.join(''); });
    }

    function updateButtons() {
      $('[data-panel="1"] [data-next]', root).disabled = !st.type;
      $('[data-panel="2"] [data-next]', root).disabled = !(st.date && st.time);
    }

    function go(step, { focus = true } = {}) {
      st.step = step;
      $$('[data-panel]', root).forEach((p) => { p.hidden = Number(p.dataset.panel) !== step; });
      $$('[data-ind]', root).forEach((li) => {
        const n = Number(li.dataset.ind);
        li.classList.toggle('is-done', n < step);
        if (n === step) li.setAttribute('aria-current', 'step');
        else li.removeAttribute('aria-current');
      });

      if (step === 2) {
        if (!st.view) {
          const first = st.date || firstAvailable();
          st.view = monthStart(first || today());
        }
        renderCalendar();
        renderSlots();
      }
      renderSummary();
      updateButtons();

      const labels = { 1: 'Krok 1 ze 3: typ schůzky', 2: 'Krok 2 ze 3: výběr termínu', 3: 'Krok 3 ze 3: kontaktní údaje', 4: 'Ukázková rezervace dokončena' };
      announce(labels[step]);

      if (focus) {
        const panel = $(`[data-panel="${step}"]`, root);
        panel.focus({ preventScroll: true });
        const top = root.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6) {
          root.scrollIntoView({ behavior: PV.reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
        }
      }
    }

    /* Události */
    root.addEventListener('pointerdown', () => { pointerInput = true; }, true);
    root.addEventListener('keydown', () => { pointerInput = false; }, true);

    $('[data-panel="1"]', root).addEventListener('change', (e) => {
      if (e.target.name !== 'bk-type') return;
      if (st.type !== e.target.value) { st.date = null; st.time = null; st.view = null; }
      st.type = e.target.value;
      updateButtons();
      PV.track('booking_type_selected', { booking_type: st.type });
      if (pointerInput) window.setTimeout(() => go(2), 320);
    });

    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-next]')) {
        go(st.step + 1);
        if (st.step === 3) PV.track('booking_slot_confirmed', { booking_type: st.type });
      }
      if (e.target.closest('[data-back]')) go(st.step - 1);
      if (e.target.closest('[data-restart]')) restart();
      const cal = e.target.closest('[data-cal]');
      if (cal && !cal.disabled) {
        st.view = new Date(st.view.getFullYear(), st.view.getMonth() + Number(cal.dataset.cal), 1);
        renderCalendar();
      }
    });

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.cal__day');
      if (!btn) return;
      if (btn.getAttribute('aria-disabled') === 'true') {
        announce('V tento den nejsou volné termíny.');
        return;
      }
      st.date = fromIso(btn.dataset.date);
      st.time = null;
      renderCalendar(st.date);
      const sel = grid.querySelector('.is-selected');
      if (sel) sel.focus();
      renderSlots();
      renderSummary();
      updateButtons();
      PV.track('booking_date_selected', { booking_type: st.type });
      if (window.matchMedia('(max-width: 760px)').matches) {
        slotsEl.scrollIntoView({ behavior: PV.reducedMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
      }
    });

    grid.addEventListener('keydown', (e) => {
      const btn = e.target.closest('.cal__day');
      if (!btn) return;
      const d = fromIso(btn.dataset.date);
      const moves = {
        ArrowRight: () => addDays(d, 1),
        ArrowLeft: () => addDays(d, -1),
        ArrowDown: () => addDays(d, 7),
        ArrowUp: () => addDays(d, -7),
        Home: () => addDays(d, -dowIdx(d)),
        End: () => addDays(d, 6 - dowIdx(d)),
        PageUp: () => new Date(d.getFullYear(), d.getMonth() - 1, Math.min(d.getDate(), 28)),
        PageDown: () => new Date(d.getFullYear(), d.getMonth() + 1, Math.min(d.getDate(), 28)),
      };
      if (!moves[e.key]) return;
      e.preventDefault();
      moveFocus(moves[e.key]());
    });

    slotsEl.addEventListener('change', (e) => {
      if (e.target.name !== 'bk-time') return;
      st.time = e.target.value;
      renderSummary();
      updateButtons();
      PV.track('booking_time_selected', { booking_type: st.type });
    });

    PV.forms.bindLive(form);
    let sending = false;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (sending) return;
      if (form.elements.namedItem('company').value) return; // ochrana proti spamu
      if (!PV.forms.validate(form)) {
        announce('Formulář obsahuje chyby. Opravte prosím zvýrazněná pole.');
        return;
      }
      sending = true;
      const submit = form.querySelector('[type="submit"]');
      submit.classList.add('is-loading');
      const data = Object.fromEntries(new FormData(form));
      delete data.company;
      const payload = Object.assign({ type: st.type, date: iso(st.date), time: st.time, attribution: PV.attribution() }, data);
      const result = await provider.createBooking(payload);
      submit.classList.remove('is-loading');
      sending = false;
      PV.track('booking_submit_demo', { booking_type: st.type, topic: payload.topic || 'neuvedeno' });

      const t = typeObj();
      const rows = [
        ['Typ schůzky', t ? t.title : ''],
        ['Termín', `${PV.cap(longDate(st.date))}, ${st.time}`],
        ['Délka', t ? `cca ${t.duration} min` : ''],
        ['Jméno', payload.name],
        ['Číslo rezervace', result.reference],
      ];
      $('[data-done]', root).innerHTML = rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
      go(4);
    });

    function restart() {
      Object.assign(st, { type: null, date: null, time: null, view: null });
      $$('input[name="bk-type"]', root).forEach((r) => { r.checked = false; });
      PV.forms.reset(form);
      go(1);
    }

    go(1, { focus: false });

    return {
      preselect({ type, topic } = {}) {
        if (topic) {
          const sel = $('#bk-topic', root);
          if (sel && [...sel.options].some((o) => o.value === topic)) sel.value = topic;
        }
        if (type && types.some((t) => t.id === type) && st.step === 1) {
          const radio = $(`input[name="bk-type"][value="${type}"]`, root);
          if (radio) { radio.checked = true; st.type = type; updateButtons(); }
        }
      },
      focus() {
        const panel = $(`[data-panel="${st.step}"]`, root);
        if (panel) panel.focus({ preventScroll: true });
      },
    };
  }

  /* Externí rezervační systém (Cal.com, Calendly…) – otevře se v novém okně */
  function createExternal(root, cfg) {
    const url = PV.safeUrl(cfg.externalUrl);
    root.innerHTML = `
      <div class="bk"><div class="bk__body bk-external">
        <h3 class="bk__title">Vyberte si termín schůzky</h3>
        <p>Rezervační kalendář se otevře v novém okně.</p>
        <a class="btn btn--primary" href="${esc(url || '#')}" target="_blank" rel="noopener"><span>Otevřít rezervační kalendář</span><span class="btn__icon" aria-hidden="true">${icon('arrow-up-right')}</span></a>
      </div></div>`;
    return { preselect() {}, focus() { const a = root.querySelector('a'); if (a) a.focus({ preventScroll: true }); } };
  }

  PV.booking = {
    api: null,
    init(root, cfg, site) {
      if (!root || !cfg) return;
      this.api = cfg.provider === 'external' && cfg.externalUrl ? createExternal(root, cfg) : createWidget(root, cfg, site);
    },
    preselect(opts) { if (this.api) this.api.preselect(opts); },
    focus() { if (this.api) this.api.focus(); },
  };
})();
