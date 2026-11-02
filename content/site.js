/* ==========================================================================
   OBSAH WEBU – texty, kontakty, služby, odkazy a nastavení na jednom místě
   --------------------------------------------------------------------------
   Jak upravovat (bez programování):
   • Měňte jen text mezi apostrofy '…'. Apostrof uvnitř textu napište jako \'.
   • [Hranaté závorky] = zástupný údaj. Na webu se zvýrazní, aby bylo jasné,
     co je potřeba doplnit nebo ověřit s klientkou.
   • *Hvězdičky* kolem slov = zvýraznění (používat střídmě, jen v úvodu, citátu a rezervaci).
   • Fotografie: do "src" napište cestu k souboru (např. 'assets/img/portret.jpg').
     Dokud je "src" prázdné, zobrazí se designový placeholder s popisem.
   • Struktura odpovídá kolekcím headless CMS (Decap CMS, Sanity, Storyblok…),
     takže ji lze později napojit 1 : 1. Viz README.md.
   ========================================================================== */

window.SITE = {

  /* ---------- Nastavení: sekce lze jednoduše vypnout (false) ---------- */
  settings: {
    showWhy: true,           // srovnání „sami v bance × se mnou“ + banky
    showTeam: true,          // tým
    showTools: true,         // kalkulačka splátky
    showTestimonials: true,  // reference
    showInsta: false,        // sekce o Instagramu – zapnout až s reálnými příspěvky nebo videi
    showFaq: true,           // časté otázky a slovníček
    prototype: false,        // true = zobrazí odznak „Prototyp“ a poznámky k návrhu
  },

  /* ---------- Měření a marketing (načte se až po souhlasu s cookies) ---------- */
  tracking: {
    gtmId: '',               // např. 'GTM-XXXXXXX' – prázdné = nic se nenačítá
    metaPixelId: '',         // např. '1234567890' – prázdné = nic se nenačítá
  },

  /* ---------- Značka ---------- */
  brand: {
    name: 'Petra Kilianová',
    role: 'Hypoteční poradkyně',
    city: 'Brno',
    claim: 'Dobrá hypotéka je ta, které rozumíte.',
  },

  /* ---------- SEO (titulek a popis ve vyhledávačích) ---------- */
  seo: {
    title: 'Hypoteční poradkyně Brno – Petra Kilianová | Gepard Finance',
    description: 'Hypoteční poradkyně s kanceláří v Brně, pomáhám po celé ČR. Porovnám nabídky bank a provedu vás hypotékou i refinancováním. Osobně, online i po telefonu.',
    url: 'https://petaholec.github.io/petra-kilianova-web/',   // po koupi domény přepsat a spustit node tools/seo-static.js
  },

  /* ---------- Kontakty ---------- */
  contact: {
    phone: '+420 774 875 286',
    phoneHref: '+420774875286',   // číslo bez mezer pro proklik
    email: 'petra.kilianova@gpf.cz',
    emailHref: 'petra.kilianova@gpf.cz',   // e-mail pro proklik
    hours: 'Schůzky po předchozí domluvě',
    response: 'Ozvu se vám do [24 hodin] v pracovní dny.',
  },

  /* ---------- Sociální sítě ---------- */
  social: [
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '[@instagram_profil]',
      url: '',               // https://www.instagram.com/…
      text: 'Krátká videa, praktické tipy a pohled do zákulisí.',
      cta: 'Sledovat na Instagramu',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'Petra Kilianová',
      url: '',               // https://www.linkedin.com/in/…
      text: 'Odborné postřehy ze světa hypoték a financování bydlení.',
      cta: 'Spojit se na LinkedInu',
    },
  ],

  /* ---------- Navigace ---------- */
  // Položky s main: true jsou v hlavičce a v mobilním menu (jen to nejdůležitější).
  // Položky s footer: true jsou v patičce. Odkazy na sekce vypnuté v settings se skryjí samy.
  nav: [
    { label: 'Úvod', target: 'uvod' },
    { label: 'Služby', target: 'sluzby', main: true, footer: true },
    { label: 'Proč se mnou', target: 'proc-se-mnou' },
    { label: 'O mně', target: 'o-mne', main: true, footer: true },
    { label: 'Tým', target: 'tym' },
    { label: 'Spolupráce', target: 'spoluprace' },
    { label: 'Kalkulačka', target: 'kalkulacka', main: true, footer: true },
    { label: 'Rezervace', target: 'rezervace' },
    { label: 'Ze života poradkyně', target: 'ze-zivota' },
    { label: 'Blog', target: 'blog', url: 'blog.html', main: true, needsPosts: true },
    { label: 'Reference', footerLabel: 'Recenze', target: 'reference', footer: true },
    { label: 'Všechny recenze', target: 'recenze', url: 'recenze.html' },
    { label: 'FAQ', footerLabel: 'Časté otázky', target: 'otazky', main: true, footer: true },
    { label: 'Slovníček', target: 'slovnicek', url: 'slovnicek.html', main: true },
    { label: 'Certifikace', target: 'certifikace', url: 'certifikace.html', main: true },
    { label: 'Kontakt', target: 'kontakt', main: true, footer: true },
  ],
  navCta: 'Domluvit schůzku',

  /* ---------- Úvodní obrazovka ---------- */
  hero: {
    eyebrow: '',                         // nepovinný řádek nad nadpisem
    title: 'Váš nový *domov* začíná správným rozhodnutím.',
    text: 'Jsem hypoteční poradkyně s kanceláří v Brně a pomáhám klientům po celé republice. Porovnám možnosti financování a provedu vás hypotékou od první konzultace až po podpis.',
    primaryCta: 'Domluvit schůzku',
    secondaryCta: 'Jak vám mohu pomoci',
    photo: { src: 'assets/img/petra-kilianova-vyrez.webp', alt: 'Petra Kilianová, hypoteční poradkyně' },
    card: {
      title: 'První krok je jednoduchý',
      text: 'Vyberte si termín schůzky – osobně, online, nebo po telefonu.',
      cta: 'Vybrat termín',
    },
    note: 'Sem přijde hlavní portrét z focení. Doporučujeme přirozené světlo, klidné pozadí a pohled do objektivu.',
  },

  /* ---------- Služby ---------- */
  services: {
    eyebrow: 'S čím mohu pomoci',
    title: 'Ať teprve začínáte, nebo vám končí fixace.',
    intro: 'Hypotéka, refinancování, stavba i rekonstrukce, ať bydlíte kdekoli. Vyberte si, co právě řešíte. Na první schůzce si ujasníme vaši situaci a já vám ukážu, jaké máte možnosti – bez zbytečných odborných pojmů.',
    detailsLabel: 'Co spolu vyřešíme',
    cta: 'Domluvit schůzku',
    note: 'Rozsah a názvy služeb jsou návrh – je potřeba je potvrdit s klientkou.',
    items: [
      {
        id: 'nove-bydleni',
        icon: 'home',
        tag: 'Koupě bydlení',
        title: 'Hypotéka na nové bydlení',
        text: 'Kupujete první byt, stěhujete se do většího, nebo pořizujete dům? Spočítáme, na jaké financování dosáhnete, kolik budete potřebovat vlastních prostředků a jak bude vypadat splátka.',
        points: ['Kolik si můžete půjčit a jaká bude splátka', 'Vlastní prostředky a jak s nimi naložit', 'Postup od rezervace nemovitosti po čerpání'],
      },
      {
        id: 'prvni-bydleni',
        icon: 'key',
        tag: 'První bydlení',
        title: 'Hypotéka na první bydlení',
        text: 'Chcete být konečně ve svém? Provedu vás celým procesem krok za krokem – od první úvahy přes výběr financování až po podpis a čerpání.',
        points: ['Na co si dát pozor u první hypotéky', 'Vlastní prostředky a podklady pro banku', 'Co vás čeká po schválení a při čerpání'],
      },
      {
        id: 'refinancovani',
        icon: 'refresh',
        tag: 'Konec fixace',
        title: 'Refinancování hypotéky',
        text: 'Blíží se konec fixace, nebo máte pocit, že vaše hypotéka už neodpovídá vašemu životu? Porovnáme nabídku vaší banky s dalšími možnostmi a společně zvážíme, co dává smysl.',
        points: ['Kdy začít řešit konec fixace', 'Zůstat u své banky, nebo přejít jinam', 'Změna splátky nebo doby splácení'],
      },
      {
        id: 'stavba-rekonstrukce',
        icon: 'hammer',
        tag: 'Stavba · rekonstrukce',
        title: 'Financování stavby nebo rekonstrukce',
        text: 'Stavíte dům, nebo chcete z bytu udělat domov podle svých představ? Najdeme financování, které počítá s průběžným čerpáním, rozpočtem i tím, že ne všechno půjde přesně podle plánu.',
        points: ['Čerpání peněz podle postupu stavby', 'Jaké podklady bude banka chtít vidět', 'Rezerva pro nečekané výdaje'],
      },
      {
        id: 'hypoteka-50',
        icon: 'users',
        tag: 'Hypotéka 50+',
        title: 'Hypotéka po padesátce',
        text: 'Pořizujete bydlení, rekonstruujete to současné, nebo chcete pomoci dětem? I v pozdějším věku se dá hypotéka řešit. Projdeme, jaké máte možnosti a co banky posuzují.',
        points: ['Jak věk ovlivňuje délku splácení', 'Financování pro sebe i pro děti', 'Co banky u starších žadatelů zvažují'],
      },
      {
        id: 'stavebni-sporeni',
        icon: 'piggy',
        tag: 'Stavební spoření',
        title: 'Stavební spoření',
        text: 'Spořit na bydlení se dá i chytře, ať už na rekonstrukci, nebo jako doplněk financování. Vysvětlím, jak stavební spoření funguje a jestli se vám hodí.',
        points: ['Jak stavební spoření funguje', 'Kdy dává smysl a kdy ne', 'Využití na rekonstrukci nebo bydlení'],
      },
      {
        id: 'fotovoltaika',
        icon: 'sun',
        tag: 'Fotovoltaika',
        title: 'Financování fotovoltaiky',
        text: 'Chcete snížit náklady na energie a postavit si vlastní fotovoltaiku? Pomůžu vám zorientovat se v možnostech, jak ji financovat.',
        points: ['Možnosti financování fotovoltaiky', 'Jaké podklady budete potřebovat', 'Jak financování zapadne do vašeho rozpočtu'],
      },
      {
        id: 'konzultace',
        icon: 'chat',
        tag: 'První krok',
        title: 'Konzultace možností financování',
        text: 'Ještě nevíte, jestli je hypotéka pro vás, nebo kdy je ten správný čas? Projdeme vaši situaci a odejdete s jasnou představou, jaké máte možnosti a co udělat jako první.',
        points: ['Na jaké financování můžete dosáhnout', 'Co ovlivňuje schválení hypotéky', 'Co udělat dřív, než začnete hledat nemovitost'],
      },
    ],
    situationsTitle: 'Pomohu i s dalšími situacemi',
    situations: ['Podnikání (OSVČ)', 'Příjmy ze zahraničí', 'Rodičovská dovolená', 'Hypotéka pro mladé', 'Předhypoteční úvěr', 'Družstevní byt'],
    situationsNote: 'Návrh – ponechat jen situace, které klientka skutečně řeší.',
  },

  /* ---------- Proč se mnou: srovnání s bankou (viz settings.showWhy) ---------- */
  why: {
    eyebrow: 'Proč se mnou',
    title: 'Sami v bance, nebo s poradkyní?',
    intro: 'Do banky můžete jít i sami. Rozdíl je v tom, co všechno zůstane na vás.',
    selfLabel: 'Sami v bance',
    meLabel: 'Se mnou',
    rows: [
      { label: 'Výběr', self: 'Nabídka jedné banky', me: 'Porovnání nabídek více bank a spořitelen' },
      { label: 'Podklady', self: 'Zjišťujete a zařizujete sami', me: 'Řeknu vám přesně, co je potřeba, a pomohu s přípravou' },
      { label: 'Jednání s bankou', self: 'Na vás', me: 'Komunikaci s bankou pohlídám za vás' },
      { label: 'Schůzky', self: 'Na pobočce v otevírací době', me: 'Osobně, online i po telefonu' },
    ],
    banksTitle: 'Partneři, se kterými spolupracuji',
    banks: [
      { name: 'Česká spořitelna', logo: 'assets/img/banks/ceska-sporitelna.svg' },
      { name: 'Komerční banka', logo: 'assets/img/banks/komercni-banka.svg' },
      { name: 'ČSOB Hypoteční banka', logo: 'assets/img/banks/csob-hypotecni-banka.svg' },
      { name: 'Raiffeisenbank', logo: 'assets/img/banks/raiffeisenbank.png' },
      { name: 'UniCredit Bank', logo: 'assets/img/banks/unicredit.svg' },
      { name: 'mBank', logo: 'assets/img/banks/mbank.png' },
      { name: 'Oberbank', logo: 'assets/img/banks/oberbank.svg' },
      { name: 'Partners banka', logo: 'assets/img/banks/partners-banka.svg' },
      { name: 'Stavební spořitelna České spořitelny', logo: 'assets/img/banks/stavebni-sporitelna-cs.svg' },
      { name: 'Modrá pyramida', logo: 'assets/img/banks/modra-pyramida.svg' },
      { name: 'Raiffeisen stavební spořitelna', logo: 'assets/img/banks/raiffeisen-stavebni-sporitelna.png' },
      { name: 'Essox', logo: 'assets/img/banks/essox.png' },
      { name: 'ČSOB Leasing', logo: 'assets/img/banks/csob-leasing.svg' },
      { name: 'Cofidis', logo: 'assets/img/banks/cofidis.svg' },
      { name: 'Inbank', logo: 'assets/img/banks/inbank.svg' },
      { name: 'Artesa', logo: 'assets/img/banks/artesa.svg' },
    ],
    banksNote: '',
    note: 'Srovnání je návrh. Počet bank a formulace potvrdit s klientkou a podle pravidel značky Gepard Finance.',
  },

  /* ---------- O mně ---------- */
  about: {
    eyebrow: 'O mně',
    title: 'Za každou hypotékou je jeden velký životní krok.',
    lead: 'Jmenuji se Petra Kilianová a jsem hypoteční poradkyně s kanceláří v Brně. Pomáhám lidem financovat bydlení tak, aby rozuměli tomu, co podepisují – a mohli se na nový domov těšit.',
    paragraphs: [
      'Za každou žádostí o hypotéku vidím konkrétní příběh. Pár, který poprvé podepisuje kupní smlouvu. Rodinu, které je malý byt těsný. Nebo někoho, kdo konečně staví dům, o kterém roky mluvil.',
    ],
    story: '',   // Petřin osobní příběh, jejími vlastními slovy. Dokud je prázdné, na webu je jen volné místo.
    quote: 'Dobrá hypotéka je ta, které *rozumíte*.',
    signature: 'Petra Kilianová',
    photoNote: 'To jsem já',
    cta: 'Domluvit schůzku',
    portrait: { src: 'assets/img/petra-kilianova.jpg', alt: 'Petra Kilianová, hypoteční poradkyně', label: 'Portrét – osobní představení', hint: 'Přirozené světlo · 3 : 4 · min. 1500 × 2000 px' },
    note: 'Návrh textu – finální podobu upravíme po rozhovoru s klientkou. Neobsahuje žádné vymyšlené údaje o praxi, oprávněních ani úspěších. Logo a prezentaci partnera ověřit podle pravidel Gepard Finance.',
  },

  /* ---------- Tým (volitelná sekce – viz settings.showTeam) ---------- */
  team: {
    eyebrow: 'Tým',
    title: 'Při práci mi pomáhá asistentka.',
    intro: '[Volitelné: krátké představení asistentky a toho, s čím vám pomůže.]',
    members: [
      { name: 'Alžběta Mejzlíková', role: 'Asistentka', text: '[Jednou větou: s čím klientům pomáhá]', photo: { src: 'assets/img/alzbeta-mejzlikova.jpg', alt: 'Alžběta Mejzlíková, asistentka', label: 'Portrét asistentky' } },
    ],
    note: 'Volitelná sekce. Vypnete ji v souboru content/site.js (settings.showTeam: false). Jméno a fotka asistentky jsou z webu Gepard Finance (gpf.cz/brno-husova).',
  },

  /* ---------- Jak probíhá spolupráce ---------- */
  process: {
    eyebrow: 'Jak probíhá spolupráce',
    title: 'Víte, co vás čeká. *Krok za krokem.*',
    intro: 'U každého kroku víte, co se bude dít a co budu potřebovat od vás.',
    cta: 'Domluvit schůzku',
    finish: 'Klíče od vašeho domova',
    steps: [
      { title: 'Probereme vaše plány', text: 'Osobně, online nebo po telefonu. Řeknete mi, co chcete financovat a kdy. Podklady zatím nepotřebujete, stačí vaše představa.' },
      { title: 'Porovnáme možnosti', text: 'Porovnáme varianty podle sazby, délky fixace a výše splátky. Vy si vyberete tu, která vám sedí.' },
      { title: 'Vyřídíme žádost a podklady', text: 'Nejdřív u banky ověříme, zda je hypotéka ve vaší situaci možná. Pak zkompletujeme podklady, jako jsou doklady o příjmech, kupní smlouva nebo odhad nemovitosti, a podáme žádost. Po schválení podepíšeme úvěrovou a zástavní smlouvu a každý dokument vám předem vysvětlím.' },
      { title: 'Zůstaneme v kontaktu', text: 'Když se změní vaše plány, napište mi a domluvíme další krok.' },
    ],
  },

  /* ---------- Kalkulačka splátky (viz settings.showTools) ---------- */
  calculator: {
    eyebrow: 'Kalkulačka',
    title: 'Jaká může být vaše splátka?',
    intro: 'Zadejte cenu nemovitosti a výši úvěru a podívejte se, jak vychází splátka u jednotlivých bank. Přesná čísla podle vaší situace připravím na schůzce.',
    endpoint: 'https://www.gpf.cz/calculator',   // stejný výpočet jako kalkulačka na webu Gepard Finance
    maxLtv: 0.9,
    modes: [
      { id: 'BYD', label: 'Hypotéka na bydlení', guarantee: { min: 200000, max: 20000000, value: 2500000 }, credit: { min: 200000, max: 20000000, value: 2000000 }, maxYears: 30, years: 30 },
      { id: 'AHU', label: 'Americká hypotéka', guarantee: { min: 300000, max: 30000000, value: 2500000 }, credit: { min: 300000, max: 10000000, value: 1000000 }, maxYears: 20, years: 20 },
      { id: 'RFU', label: 'Refinancování', guarantee: { min: 200000, max: 20000000, value: 2500000 }, credit: { min: 200000, max: 20000000, value: 2000000 }, maxYears: 30, years: 30 },
    ],
    fixations: [1, 3, 5, 10],
    fixation: 3,
    guaranteeLabel: 'Cena nemovitosti',
    creditLabel: 'Kolik si chcete půjčit',
    yearsLabel: 'Doba splácení',
    fixationLabel: 'Doba fixace',
    insuranceLabel: 'Pojištění schopnosti splácet',
    resultLabel: 'Orientační měsíční splátka',
    compareCta: 'Porovnat hypotéky',
    compareHide: 'Skrýt porovnání',
    compareTitle: 'Porovnání podle úroku',
    ltvError: 'Maximální výše úvěru je 90 % z ceny nemovitosti.',
    emptyError: 'Pro tyto parametry teď žádná banka nevychází. Zkuste upravit zadání, nebo se mi ozvěte.',
    loadError: 'Sazby se teď nepodařilo načíst. Zkuste to prosím za chvíli, nebo si rovnou domluvte schůzku.',
    disclaimer: 'Výpočet je orientační a nejde o nabídku úvěru. Sazby a splátky pocházejí z kalkulačky Gepard Finance, konečné podmínky stanoví banka podle vaší situace.',
    cta: 'Domluvit schůzku',
    note: 'Web uvádí sazby a RPSN, proto je potřeba s Gepard Finance ověřit povinné údaje (např. reprezentativní příklad) a použití jejich výpočtu.',
  },

  /* ---------- Rezervace schůzky ---------- */
  booking: {
    eyebrow: 'Rezervace schůzky',
    title: 'Domluvte si *první schůzku*.',
    intro: 'Vyberte si, jak se chcete potkat, a zvolte termín, který vám vyhovuje. Na první schůzku stačí vaše představa a otázky.',
    expectTitle: 'Co vás na schůzce čeká',
    expect: [
      'Projdeme vaši situaci a plány',
      'Vysvětlím, jaké máte možnosti a co je ovlivňuje',
      'Domluvíme další postup – bez jakéhokoli závazku',
    ],
    altTitle: 'Raději jinak?',

    // Rezervační systém: 'demo' = ukázka v prototypu.
    // Pro ostrý provoz: 'external' (odkaz na Cal.com / Calendly / jiný systém)
    // nebo napojení přes API – viz assets/js/booking.js a README.md.
    provider: 'demo',
    externalUrl: '',         // např. 'https://cal.com/jmeno/konzultace'
    daysAhead: 45,           // kolik dní dopředu lze rezervovat

    // Typy schůzek a jejich délka jsou návrh – potvrdit s klientkou.
    types: [
      { id: 'office', title: 'Osobně v kanceláři', text: 'Potkáme se v klidu u stolu. Ideální pro první schůzku.', duration: 60, icon: 'office' },
      { id: 'online', title: 'Online konzultace', text: 'Videohovor odkudkoli – odkaz vám přijde e-mailem.', duration: 45, icon: 'video' },
      { id: 'phone', title: 'Telefonický hovor', text: 'Rychlé zorientování v situaci a první otázky.', duration: 30, icon: 'phone' },
    ],
    note: 'Typy schůzek, jejich délka a pracovní doba jsou návrh. Ostrá verze se napojí na skutečný kalendář (Cal.com, Calendly nebo Google/Outlook kalendář).',
  },

  /* ---------- Blog ----------
     Články se píšou ve správě webu (admin.html) a ukládají se do content/blog/posts.js.
     repo = GitHub repozitář webu, do kterého správa články zapisuje. */
  blog: {
    repo: 'PetaHolec/petra-kilianova-web',
    branch: 'main',
    dataFile: 'content/blog/posts.js',
    imageDir: 'assets/blog',
    eyebrow: 'Blog',
    title: 'Srozumitelně o hypotékách.',
    intro: 'Praktické tipy, vysvětlení a odpovědi na otázky, které se kolem financování bydlení opakují nejčastěji.',
    emptyTitle: 'Články se připravují',
    emptyText: 'První texty přibudou brzy. Mezitím se mi klidně ozvěte, ráda poradím osobně.',
    teaserEyebrow: 'Blog',
    teaserTitle: 'Nejnovější články.',
    teaserText: 'Tipy a vysvětlení, které vám pomohou při rozhodování o hypotéce.',
    allLabel: 'Všechny články',
    ctaTitle: 'Chcete to probrat osobně?',
    ctaText: 'Ráda vám pomůžu zorientovat se a najít řešení, které sedí vaší situaci.',
  },

  /* ---------- Ze života poradkyně – odkaz na Instagram (videa jsou jen tam) ---------- */
  insta: {
    eyebrow: 'Ze života poradkyně',
    title: 'Tipy a rady najdete na Instagramu.',
    text: 'Krátká videa o hypotékách, praktické tipy a pohled do zákulisí. Jedno téma, jedno video, žádné složité pojmy.',
    bio: 'Hypotéky jednoduše a srozumitelně',
    highlights: [
      { icon: 'sparkle', label: 'Tipy' },
      { icon: 'clock', label: 'Fixace' },
      { icon: 'camera', label: 'Zákulisí' },
      { icon: 'info', label: 'Dotazy' },
    ],
    note: 'Videa budou jen na Instagramu – web na ně odkazuje. Doplnit skutečný profil (@…) v části social.',
  },

  /* ---------- Reference (volitelná sekce – viz settings.showTestimonials) ---------- */
  testimonials: {
    eyebrow: 'Zkušenosti klientů',
    title: 'Slovo mají klienti.',
    intro: 'Co o spolupráci napsali klienti. Doslovně, bez úprav.',
    // Nová recenze = nový řádek { text: '…', name: '…' }. Na webu jedou v posuvném pásu i na podstránce recenze.html.
    items: [
      { text: 'Paní Kilianová nás celým procesem schvalování hypotéky provedla, dala spoustu rad a doporučení a celkový servis byl výborný. Příště se na ni určitě znovu obrátíme. Děkujeme! Filip a Kamila', name: 'Severa Filip' },
      { text: 'Poslední dobou se člověk málokdy setká s opravdovými profesionály, a proto to ocení ještě víc, když se to stane.\nI přes to že jsme cizinci a máme tím pádem spousta komplikace navíc, paní Kilianová to vždycky vyřešila rychle a dobře.\nVždy během naši cesty k bytu byla přítomna a hned reagovala na každou naši otázku, všechno nám pořádné vysvětlovala, tak že jsme vždy chápali co se děje a proč, a proto byli jsme celou doby díky tomuto úplně v klidu. Rozhodne paní Kilianovou budeme doporučovat známým i kamarádem který budou mít zájem o hypotéku.\nŠťastny majiteli bytu Erik a Svetlana :)', name: 'Svetlana Bartuli' },
      { text: 'Paní Kilianová je člověk na svém místě. Nic není problém a i když naše situace s vyřízením hypotéky nebyla jednoduchá, vše proběhlo rychle, bez problémů a nyní už bydlíme spokojeně ve svém.. Ještě jednou moc děkujeme a přejeme hodně úspěchů a mnoho dalších spokojených klientů.', name: 'Martin Tumpach' },
      { text: 'Naprosto neuvěřitelný profesionál. Vždy se ochotně o vše postará, vše vyřídí. Ať už člověk otravuje jakýkoliv den v týdnu, jakoukoliv hodinu. Během všech těch komplikací by bez ní byl člověk naprosto ztracen ve složitém hypotečním světě. Patří jí mé velké uznání a mnohokeré díky.', name: 'Filip Raška' },
      { text: 'Paní Kilianová nám vyřídila hypotéku velmi rychle a efektivně, i když se ze začátku zdálo, že to nedopadne, tak výsledek byl nakonec perfektní a jsme nadmíru spokojeni. Paní Petru můžu všem vřele doporučit, je opravdový profesionál ve svém oboru.', name: 'Radek Černý' },
      { text: 'Normálně hodnocení nedělám, ale u p. Kiliánové musím zdůraznit - Vynikající podpora, perfektní servis, naprosto úžasný klientský přístup. Moc děkujeme.', name: 'Brandejs Aleš' },
      { text: 'V nelehké životní situaci mi Petra pomohla k tomu abych mohl začít nový život. Prefesionál s duší anděla, kterého si přeje mít každý blízko, když se s ním život nepáře. Moc děkuji.', name: 'Jan Martof' },
      { text: 'Děkujeme za skvělou a pohodovou spolupráci s paní Kilianovou. Se vším co bylo potřeba nám poradila nebo to zařídila. Vše bylo perfektně a rychle vyřízeno, již bydlíme :) Nezbývá nám nic jiného než doporučit!\nD & L', name: 'David Ondráček' },
      { text: 'Jsme šťastní, že jsme zvolili paní Kilianovou. Byl to nejlepší výběr hypotečního makléře.', name: 'Zuzana Santin' },
      { text: 'Nejlepší přístup jaký jsem zažila. Rychlá, vstřícná, věcná. Komunikace na vysoké úrovni.', name: 'Andrea Lišková' },
      { text: 'Nejlepší bankovní makléř na světě. Paní Kilianová byla velmi poctivá, důsledná a nápomocná. Budu ji doporučovat, kudy půjdu. Děkuji za veškerou péči s mým nelehkým případem. Jana Sikorová', name: 'Sikorová Jana' },
      { text: 'Naprosto perfektní spolupráce. Maximální pracovní nasazení, ochota, vstřícnost, vynikající komunikace. Dosud jsem se s takovým chováním a jednáním se mnou jako s klientem ještě nesetkal.', name: 'Martin Dobrovolný' },
      { text: 'Profesionální přístup, nic není nemožné.', name: 'Čermák Daniel' },
      { text: 'Perfektní práce!', name: 'Martin Mágr' },
      { text: 'Profesionální přístup, časová flexibilita', name: 'Michal Gagamov' },
      { text: 'Nejlepší finanční poradkyně široko daleko :-) Mnohokrát děkujeme.', name: 'David Uhlík' },
      { text: 'Jedinečna spolupráce, můžu jen doporučit', name: 'Petr Urbánek' },
      { text: 'Je bohem ve svém oboru, děkujeme', name: 'Michal Maláč' },
      { text: 'skvělé jednání', name: 'Michal Ampapa' },
      { text: 'Skvělý profesionální přístup, rychlost, vstřícné jednání. Mohu jen doporučit!!!!', name: 'Petra Elblová' },
      { text: 'naprosto fantastický a aktivní přístup', name: 'Milan Hudec' },
      { text: 'S přítelkyní jsme s poskytnutými službami a vřelým přístupem velice spokojeni. Paní Kilianová nám velice pomohla a můžeme jen vřele doporučit. Velice se těšíme na další spolupráci.', name: 'Jaroslav Kocmánek' },
      { text: 'Přístup, ochota, organizovanost, znalosti a zkušenosti.', name: 'Augustin Michal' },
      { text: 'Vše výborně vysvětlí a ještě dobře vypadá:))', name: 'Pokorná Živa' },
      { text: 'Postupně čtyři hypotéky v naprosté spokojenosti.', name: 'Sedláček Milan' },
      { text: 'Paní Kilianová je velice ochotná, profesionální a vždy k dispozici. Udělá vše pro spokojenost svých klientů.', name: 'Pejřilová Michaela' },
      { text: 'Paní Kilianová nám poskytla excelentní služby a péči. Děkujeme.', name: 'Dvořák Pavel' },
      { text: 'Obrovské díky paní makléřce Petře Kiliánové za neuvěřitelně rychlé a profesionální jednání.. Za úžasnou komunikaci, vstřícný a milý přístup :) :) :)', name: 'Dujsíková Jana' },
      { text: 'Perfektní přístup ke klientům, vždy vstřícná a profesionální. Za všechno mockrát děkujeme!', name: 'Růžičková Michaela' },
      { text: 'Pani Kilianova je velice mila, pratelska a nikdy nas neodmitla a vzdy vse vysvetlila. A sklidnym svedomim bych ji doporucil vsem. A jeste jednou moc za vse co pro nas udelala dekuji.', name: 'Aleš Čuma' },
      { text: 'S paní Kilianovou je radost spolupracovat - měli jsme velké štěstí, že jsem ji našli. Pomohla nám skrz ideální financování plnit si naše sny.', name: 'Lucie Doleželová' },
      { text: 'Super domluva, vse klaplo rychle a bez problemu, zadna starost z me strany.', name: 'Roman Plšek' },
      { text: '100% péče o zákazníka.', name: 'Dušan Skřivánek' },
      { text: 'Vynikající přístup paní Kilianové, moc děkujeme.', name: 'Helena Vaňková' },
      { text: 'Skvělý přístup, profesionální jednání. Můžu jen vřele každému tuto skvělou makléřku doporučit. 200% SPOKOJENOST ?', name: 'Petr Jakl' },
      { text: 'Profesionální přístup, skvělé a vstřícné jednání!', name: 'Jiří Duffek' },
      { text: 'Perfektní spolupráce. Na 1*', name: 'Lucie Doleželová' },
      { text: 'Profesionální a a hlavně rychlé jednání.', name: 'Milan Hudec' },
      { text: 'Perfektní servis, zodpovězení všech dotazů v souvislosti s úvěrem, 100% spokojenost!', name: 'Martin Klimecký' },
      { text: 'Potěšil mě profesionální přístup paní makléřky, ochota a obětavý přístup vzhledem k mému požadavku. Velice děkuji za vyřízení hypotéky.', name: 'Petr Zoubek' },
      { text: 'Spolupráce se sl. Kilianovou byla naprosto bezproblémová. Vše vyřízeno v co nejkratších termínech, perfektní komunikace a ochota. Děkuji.', name: 'Nováček Tomáš' },
      { text: 'Velmi rychlá komunikace. Ochotná. Není co vytknout. Naprostá spokojenost.', name: 'Křížka Vít' },
      { text: 'Vždy rada poradí,je velice přijemná,vše vyřidí.', name: 'Jandová Světlá' },
      { text: 'Petra Kilianová je nejlepší hypoteční makleř jaký nás mohl potkat. Můžu jen doporučit - je profesionální, rychlá, přesná a pohotová, orientujicí se ve všech možných úskalích. Navíc je velmi milá a ochotná.', name: 'Lucie Doležalová' },
      { text: 'Vše bylo perfektní - přístup, vstřícnost, profesionalita. Děkuji Javůrek Antonín', name: 'Javůrek Antonín' },
      { text: 'Moc děkujeme za Vaši profesionalitu a odbornost, bez toho všeho by jsme Vás teď z bytu v Bystrci nezdravili :-)', name: 'Daniel Šimera a Barbora Machučová' },
      { text: 'Dobrý den paní Kiliánová, děkuji moc a moc za spolupráci a profesionální přístup k vyřízení a dotáhnutí úvěru až dokonce. Zařídila jste veškeré papírování, překontrolovala smlouvy a během vyřizování hypotéky jste mě pravidelně informovala o jeho průběhu. Někdy to bylo opravdu složité, ale věřím , že je vše už v pořádku a na místě. Pokud budu chtít byt prodat tak Vás určitě informuji a zhodnotíme společně co dál jak vše nastavit a provést. Ještě jednou srdečně děkuji. Začátkem prosince pojedu do Brna tak vás přijdu do kanceláře pozdravit a poděkovat osobně. Hezký zbytek dne Krátká', name: 'Marcela Krátká' },
      { text: 'Špičková a profesionální spolupráce. Velmi děkuji a budu jen doporučovat. Milan Keslar', name: 'Milan Keslar' },
      { text: 'Paní Kilánová nám velmi ochotně pomohla při refinancování hypotéky - resp. pro nás připravila nabídku na refinancování, které nám v konečném důsledku pomohla vyjednat velmi dobré podmínky u naší stávající banky. Moc si Vaší pomoci vážíme a doporučujeme všem známým i neznámým, kteří si chtějí vyřídit hypotéku.\n\nMoc děkujeme za pomoc a ať se Vám daří!', name: 'Soňa Vančová' },
      { text: 'Přesto že naše situace nebyla zrovna ideální, velice nás potěšil celkový přístup a odhodlání k dané věci a řešení problémů. Tímto chceme velice poděkovat za ochotu a za celkové pracovní nasazení které dopadlo nakonec úspěchem na obou dvou stranách. Děkujeme.', name: 'Michal Netopil' },
      { text: 'Velmi dobrá práce, odbornost, rychlost a důslednost, děkujeme za perfektní vyřízení hypotéky. Radek Černý', name: 'Radek Černý' },
      { text: 'Dobrý den paní Kilianová,\nděkuji moc za vyřízení. Já též děkuji za spolupráci - jsem rád, že jsem k Vám na jaře zamířil!\nHezký víkend!\nS pozdravem\nZdeněk Ryzner', name: 'ZDENEK RYZNER' },
      { text: 'Dobrý den paní Kilianová,\npro nás bylo také potěšením s Vámi spolupracovat. Ze začátku jsme se jednání o hypotéce trochu báli, ale s Vámi to byla pohoda.\nPřejeme pěkné vánoce, v novém roce hodně štěstí, zdraví a spokojených klientů.\nLenka a Jiří Čermákovi', name: 'Lenka a Jiří Čermákovi' },
      { text: 'Zdravím Vás paní Kiliánová,\nmoc Vám za vše děkujeme, velice jste nám pomohla a moc si toho vážíme. Pokud bude možnost, jistě Vás budeme všude doporučovat, jste 100-procentní..... :-). Když budeme něco potřebovat, určitě se na Vás obrátíme.\nJeště jednou moc děkujeme.....\nPřejeme krásné Vánoce a do Nového roku vše nejlepší a mnoho stejně tak spokojených klientů.\nS pozdravem\nTomáš a Klára Hořákovi', name: 'Tomáš a Klára Hořákovi' },
      { text: 'Dobrý den paní Kilianová,\nchtěli bychom Vám poděkovat za pomoc s vyřízením naší hypotéky. I když vše neproběhlo úplně hladce (ale s nějakými komplikacemi se asi musí vždy počítat), důležité je, že vše nakonec dobře dopadlo :-)\nDěkujeme a nejpozději před koncem fixace bychom se případně na Vás dovolili zase obrátit :-)\nPěkný den\nIva Baroušová\nPetr Iran', name: 'Iva Baroušová' },
      { text: 'Spolupráci s paní Kilianovou mohu hodnotit jako vysoce profesionální. Musím vyzdvihnout způsob jednání a komunikaci, která dle mého, vždy plně vyhovuje konkrétnímu klientovi a jeho potřebám. Za svou rodinu mohu jen poděkovat a vřele paní Kilianovou doporučit.', name: 'Zdražilová Tereza' },
      { text: 'Dobrý den, už sepisují dodatek ke smlouvě. Nebýt Vás, bůh ví, co by mi nabídli. Budu Vás doporučovat všude :-)\nS pozdravem Ing. Naďa Kazdová', name: 'Ing. Naďa Kazdová' },
      { text: 'Zdravim Vas pani Kilianova,\nme bylo potesim s Vami spolupracovat, Vy jste vse obehala a zaridila. Mockrat Vam dekuji. Urcite Vas budu doporucovat a kdyby bylo treba, tak nikoho jineho nez Vas nechci. At se Vam dari.\nS pozdravem Rybnikar Zdenek', name: 'Rybnikar Zdenek' },
      { text: 'Zdravím, děkuji za zprávu a vůbec za všechno, hlavně za Váš přístup. S pozdravem Bukovecká Martina', name: 'Bukovecká Martina' },
      { text: 'Dobrý den paní Kiliánová,\nna chatičce je to super, holky jsou tam moc šťastné a spokojené a mi také. Ještě jednou moc děkujeme za vše co jste pro nás udělala a budeme se těšit na další spolupráci. Mějte se krásně a pěkný zbytek léta.\nS pozdravem Vičíkovi', name: 'Vičíkovi' },
      { text: 'Ďakujeme za Váš čas a výbornu spoluprácu, určitě budeme šířit iba dobré referencie J a až bude znobu Shen Yun v Českej republike, dáme Vám vediet, alebo to móže byť ina zaujimavá událost hodna Vašho vzácného času. S pozdravom Michal Kováč a Janka Kalábková', name: 'Michal Kováč a Janka Kalábková' },
      { text: 'Milá paní Kiliánová, děkuji za krásné psaní. Potěšení bylo určitě i na mé straně. Mějte se krásně a ať se Vám daří. PS: veďte si mě v patrnosti – refinance je tu cobydup.\nIng. Petr SPOUSTA', name: 'Ing. Petr SPOUSTA' },
      { text: 'Já moc děkuji za všechen Váš čas a nasazení..a taky díky za pěkný mail. Když bych si nevěděl rady, určitě se ozvu. :) Přeju taky krásné léto a spoustu dalších spokojených klientů.\nS pozdravem Adolf Gothard\nPS: Vyřiďte, prosím, moje velké poděkování i paní Krejzkové a panu Solichovi.', name: 'Adolf Gothard' },
      { text: 'Dobrý den,\nchtěla bych Vám moc poděkovat za vyřízení úvěru. Minulý týden toho bylo celkem dost, takže jsem se k tomu nedostala dříve, ale ještě jednou jsem Vám chtěla vyjádřit velký dík za Vaší spolupráci. Přeji Vám krásné a slunečné léto!\nS úctou, Lucie Hurychová', name: 'Lucie Hurychová' },
      { text: 'Díky Vám jsem obdržel nabídku na hypotéku, v jakou jsem ani nedoufal. Byli jsme domluveni, že návrh pošlu k Vašemu posouzení, což jsem udělal. Bohužel ta nabídka je platná pouze do zítra a tak si dovolím na ni reagovat i bez Vašeho schválení. I tak jsem Vám zavázán a rád bych se nějak revanšoval. Děkuji, přeji příjemný den a očekávám Vaše požadavky.\nMartin Souček', name: 'Martin Souček' },
      { text: 'Dobrý den, slečno Kilianová,\nještě jednou Vám za vše mockrát děkuji. Jste skvělá. Chválím a doporučuji Vás, kudy chodím ;-)\nChtěla bych Vám ještě jednou za sebe i za přítele moc poděkovat za Váš úžasný přístup a za vše, co jste pro nás udělala. Byli jsme s Vašimi službami maximálně spokojeni a příště se na Vás opět s důvěrou obrátíme.\nS pozdravem a přáním pěkného dne\nPetra Libíková', name: 'Petra Libíková' },
      { text: 'Moc Vám musíme poděkovat za spolupráci, bez Vaší perfektní kvalifikované práce a velmi příjemného ochotného jednání, bychom se nedostali tam, kde dnes jsme... :-)\nDěkujeme. Přejeme pěkný den, manželé Povodovi', name: 'Povodovi' },
      { text: 'Jste vzorem pro mne, jak dát prostor dcerám být více než manželky a hospodyně. Moc děkuji, že jste.\nJiří Klempiřík', name: 'Jiří Klempiřík' },
      { text: 'Moc děkuji za informaci, čas, TRPĚLIVOST…\nRozhodně příště opět k Vám a doufám, že k Vám pošlu i známé, když budou řešit bydlení.\nPřeji pěkný den\nJosef Černý', name: 'Josef Černý' },
      { text: 'Dobrý den paní Kiliánová,\nděkuji Vám za Vaše nasazení v naší věci. Jsem moc ráda, že se vše podařilo dotáhnout do (snad už) zdárného konce. A jaké to byly nervy!\nDěkujeme.\nMějte se pěkně,\nAnežka Březinová', name: 'Anežka Březinová' },
      { text: 'Dobrý den,\nděkuji za pomoc s vyřízením hypotéky. Hlavně díky Vám jsme se neupsali do zbytečných podmínek.\nS pozdravem\nMichal Kořenář', name: 'Michal Kořenář' },
      { text: 'My děkujeme za super přístup a Vaši hypoteční šikovnost :-) Přejeme hezký den. manželé Čermákovi', name: 'Čermákovi' },
      { text: 'Dovolte mi, prosím, abych Vám poděkovala za Vaše cenné rady. Opravdu jste mi velmi pomohla. Těším se na naši další spolupráci.\nPřeji Vám hlavně zdraví a pracovních úspěchů.\nS pozdravem\nM. Hladilová', name: 'M. Hladilová' },
      { text: 'Moc děkuji za dobrou zprávu a ještě jednou děkuji za veškerou Vaši pomoc, bez které bychom to nikdy nezvládli.\nManželé Finkovi', name: 'Manželé Finkovi' },
      { text: 'Dobrý den, děkuji za gratulaci, je to v nemalé míře i Vaše zásluha, doporučuji Vás kudy chodím.\nDekuji a jsem s pozdravem, Žalud Vladimír.', name: 'Žalud Vladimír' },
      { text: 'Dobrý den paní Kilianová,\nděkuji Vám za zaslané informace, vše by mělo být opravdu v pořádku. Není-li z mé strany potřeba už cokoli v rámci úvěru a banky zařizovat, tak bych Vám chtěl touto cestou velmi poděkovat za Vaši snahu, jednání a profesionální přístup ke klientovi.\nVážím si Vaší ochoty a budu-li potřebovat jakkoli pomoct nebo poradit, rád se na Vás opět obrátím.\nJeště jednou Vám děkuji za spolupráci a přeji mnoho dalších pracovních úspěchů.\nS pozdravem,\nAdam Civín', name: 'Adam Civín' },
      { text: 'Paní Kilianová, srdečně Vás zdravím.\nJen jsem Vám chtěla ještě jednou moc poděkovat za Vaši vstřícnost, trpělivost a obětavý přístup. I přes tyto a jiné komplikace jsme s bytem moc spokojení a líbí se nám čím dál tím víc.\nJe mi jasné, že míváte hodně nabitý program pozdě do večera, ale byla by pro nás velká čest, kdybyste měla chuť nás navštívit.\nPřejeme, ať se Vám daří profesně i osobně,\nMariana Tíkalová, Petr Málek', name: 'Mariana Tíkalová, Petr Málek' },
      { text: 'Závěrem bych Vám chtěl i za svoji přítelkyni, sl. Mertlovou, moc poděkovat za Váš velký přínos k tomu, že jsme získali nejlepší podmínky financování naší nemovitosti, za cenné rady a také ochotu zodpovědět všechny dotazy a trpělivě se věnovat našim požadavkům.\nEmil Budín a Mgr. Veronika Metrlová', name: 'Emil Budín a Mgr. Veronika Metrlová' },
      { text: 'Nedoporučila bych nic, abych se u Vás cítila ještě lépe, není co zlepšovat.\n\nIng. Milada Matiovská', name: 'Ing. Milada Matiovská' },
      { text: 'Moje hypoteční makléřka je profesionál první volby, má velmi aktivní přístup a vstřícné jednání a nenapadá mě nic, abych se cítil ještě lépe.\nRadim Drgáč', name: 'Radim Drgáč' },
      { text: 'Přístup mé hypoteční makléřky byl perfektní, osobní a podala profesionální výkon. I když se říká, že je stále co zlepšovat, nic mne nenapadá.\nMiroslav Handlíř', name: 'Miroslav Handlíř' },
      { text: 'Během dubna a května loňského roku jsme spolu hodně komunikovali. Kupovali jsme, já a přítel, totiž s Vaší pomocí byt v Brně. S těmi všemi změnami jsme úplně zapomněli Vám alespoň napsat a opravdu Vám poděkovat. Pomohla jste nám a všechno poradila, vše šlo úplně skvěle a nikde nenastala komplikace.Moc rádi zase Vaše služby využijeme. Doufám, že je nebudeme v nejbližší době potřebovat. Zatím vše finančně zvládáme.\nKaždopádně Vám opravdu moc děkujeme za pomoc. Bylo to docela náročné papírování a díky Vám jsme to pěkně zvládli. Ještě jednou Vám za oba moc děkuji a přeji mnoho osobních i pracovních úspěchů :o)) Jste skvělá :o)\nJana Přikrylová a Petr Chlápek)', name: 'Jana Přikrylová a Petr Chlápek' },
      { text: 'Dobrý den, tak jsem si přečetla tu skvělou zprávu....:))) Mockrát Vám děkujeme, kdyby jsme nedostali na Vás kontakt, tak jsme možná byli ještě furt na začátku, jak nám všichni říkali, jste ze zlatá....děkujeme....:)))\nŽaneta Dudáková', name: 'Žaneta Dudáková' },
      { text: 'Přístup slečny Kilianové hodnotím pozitivně, velmi pro-aktivně, jen bych doporučil lepší možnost parkování a schránku dostupnou i po pracovní době.\nLibor Vaněk', name: 'Libor Vaněk' },
      { text: 'Přístup slečny Kilianové hodnotím jako vzorný. Byl jsem zcela spokojen s poskytnutými službami.\nJiří Bosák', name: 'Jiří Bosák' },
      { text: 'Přístup slečny Kilianové byl profesionální, rychlý a spolehlivý, jen parkování by bylo třeba zajistit lepší.\n\nOldřich Grepl', name: 'Oldřich Grepl' },
      { text: 'Slečna Kilianová je profesionál na správném místě. Je velice ochotná, spolehlivá, s hypotékou jsem měla minimum starostí, vše mi vždy vysvětlila a následně za mě vyřídila. Co víc si člověk může přát. J K jejím službám nemám výhrady. Byla jsem absolutně spokojená.\nVeronika Skácelová', name: 'Veronika Skácelová' },
      { text: 'Slečna Kilianová má vysoké pracovní nasazení, je velmi spolehlivá a probíhala mezi námi bezproblémová komunikace. Nemám jedinou výhradu, vše, co jsem potřebovala bylo vyřízeno v co možná nejkratší době.\n\nMichaela Sybolová', name: 'Michaela Sybolová' },
      { text: 'Dobrý večer.\nDěkuji za zprávu. Díky Vám a paní Brodecké mám vlastní bydlení. Jsem Vám zavázána, protože jste tomu mému oříšku věnovaly víc, než je nutné a to je v dnešní době již velkou vzácností.\nRáda bych s Vámi zůstala v kontaktu. Ještě jednou velký dík za vše. Paní Brodecké hodně zdraví pro ni i její malou, ať jí roste k radosti. Vám hodně sil, ať se Vám daří Vaše práce. To Vám přeji od srdce.\nVladimíra Musilová', name: 'Vladimíra Musilová' },
      { text: 'Dobrý den,\nchtěla jsem Vám moc poděkovat za Vaši pomoc a ochotu při výběru a následném vyřizování hypotéky za nejvýhodnějších podmínek. Vše proběhlo na jedničku a zítra se mi bude předávat byt.\nJsem moc vděčná, že jsem se na Vás mohla obrátit. A do budoucna, v případě potřeby, určitě zase využiji služeb GEPARD FINANCE.\nMOC ZA VŠE DĚKUJI!!\nVeselá Kateřina', name: 'Veselá Kateřina' },
      { text: 'Dobrý den,\ntaké děkuji za spolupráci. Určitě se ještě uslyšíme. Vřele Vaše služby doporučím dalším. S pozdravem\nJ. Pohořalý', name: 'J. Pohořalý' },
    ],
    homeCount: 12,   // kolik prvních recenzí jede v pásu na úvodní stránce, ostatní jsou na recenze.html
    allLabel: 'Všechny recenze',
    pageTitle: 'Co o spolupráci říkají klienti.',   // nadpis podstránky recenze.html
    ask: 'Už jsme spolu řešili vaši hypotéku? Vaše zkušenost pomůže dalším lidem v rozhodování.',
    reviewLink: { label: 'Napsat recenzi', url: '' },   // např. odkaz na Google recenze
    note: 'Recenze jsou převzaté doslovně ze stránky petrakilianova.cz/reference. Jména jsou uvedená tak, jak jsou tam zveřejněná.',
  },

  /* ---------- Časté otázky a slovníček (viz settings.showFaq) ---------- */
  faq: {
    eyebrow: 'Časté otázky',
    title: 'Na co se lidé ptají nejčastěji.',
    intro: 'Nenašli jste odpověď? Zavolejte mi, napište e-mail, nebo si rovnou domluvte schůzku. Hloupé otázky neexistují.',
    items: [
      { q: 'Kolik mě vaše služby stojí?', a: 'Vás nic. Mé služby jsou pro vás zdarma, odměnu mi platí banka.' },
      { q: 'Proč řešit hypotéku přes poradkyni, a ne rovnou v bance?', a: 'Uvidíte víc nabídek najednou a nemusíte obcházet jednotlivé banky. Pomohu vám s podklady, s komunikací s bankou i s tím, abyste rozuměli každé smlouvě. Rozhodnutí je vždy na vás.' },
      { q: 'Jaký je rozdíl mezi hypotečním poradcem, specialistou a makléřem?', a: 'V běžné řeči jde většinou o totéž: o člověka, který vám pomůže porovnat nabídky bank a vyřídit hypotéku. Důležitější než název je, kolik nabídek s vámi projde a jestli rozumíte tomu, co podepisujete.' },
      { q: 'Co si mám připravit na první schůzku?', a: 'Stačí představa o tom, co chcete financovat, a přehled o vašich příjmech a výdajích. Konkrétní doklady řešíme až v dalším kroku – dostanete ode mě přesný seznam.' },
      { q: 'Jak dlouho trvá vyřízení hypotéky?', a: 'Záleží na bance, typu nemovitosti a na tom, jak rychle se podaří připravit podklady. Obvykle počítejte s několika týdny. Odhad pro vaši situaci vám řeknu na první schůzce.' },
      { q: 'Kdy začít řešit konec fixace?', a: 'Ideálně několik měsíců předem. Budete mít čas porovnat nabídku své banky s dalšími možnostmi a v klidu se rozhodnout.' },
      { q: 'Musím mít vlastní úspory?', a: 'Banky obvykle financují jen část hodnoty nemovitosti, zbytek je potřeba pokrýt z vlastních zdrojů. Kolik to bude ve vašem případě a jaké máte možnosti, spočítáme spolu.' },
      { q: 'Dá se všechno vyřešit online?', a: 'Většinu kroků zvládneme online nebo po telefonu. Pokud dáváte přednost osobnímu setkání, potkáme se v kanceláři.' },
    ],
    glossaryTitle: 'Slovníček pojmů',
    glossaryText: 'Fixace, LTV, RPSN… Co která slova znamenají, vysvětlená lidsky a na jednom místě.',
    glossaryCta: 'Slovníček pojmů',
    glossaryIntro: 'Hypotéky mají svůj vlastní jazyk. Tady najdete nejčastější pojmy vysvětlené srozumitelně.',
    glossaryGroups: [
      {
        title: 'Schvalování hypotéky',
        items: [
          { term: 'LTV', def: 'Poměr výše úvěru k hodnotě nemovitosti. Čím je nižší, tím menší riziko pro banku.' },
          { term: 'DTI', def: 'Poměr všech vašich dluhů k čistému ročnímu příjmu. Ukazuje, kolikanásobek ročního příjmu dlužíte, a banka podle něj posuzuje, kolik si můžete půjčit.' },
          { term: 'DSTI', def: 'Poměr všech vašich měsíčních splátek k čistému měsíčnímu příjmu. Ukazuje, jakou část příjmu vám splátky každý měsíc vezmou.' },
          { term: 'Odhad nemovitosti', def: 'Ocenění nemovitosti, ze kterého banka vychází při rozhodování, kolik vám může půjčit.' },
          { term: 'Předschválená hypotéka', def: 'Banka předběžně posoudí vaše příjmy a závazky a řekne vám, kolik si můžete půjčit, ještě než si vyberete konkrétní nemovitost. Konečné schválení přijde až po jejím posouzení.' },
        ],
      },
      {
        title: 'Splácení a čerpání',
        items: [
          { term: 'Fixace', def: 'Období, po které se nemění úroková sazba. Po jejím skončení dostanete novou nabídku – nebo můžete hypotéku převést jinam.' },
          { term: 'RPSN', def: 'Roční procentní sazba nákladů. Zahrnuje úrok i další náklady úvěru a pomáhá porovnat nabídky mezi sebou.' },
          { term: 'Čerpání', def: 'Vyplacení peněz z hypotéky – najednou, nebo postupně, například podle průběhu stavby.' },
          { term: 'Podmínky čerpání', def: 'Co musíte splnit, než vám banka peníze vyplatí. Například podepsaná zástavní smlouva, návrh na vklad do katastru nebo pojištění nemovitosti.' },
          { term: 'Postupné čerpání', def: 'Peníze dostáváte po částech, obvykle podle postupu stavby nebo rekonstrukce a doložených faktur. Do vyčerpání celé částky platíte většinou jen úroky z toho, co už jste vyčerpali.' },
          { term: 'Dočerpání úvěru', def: 'Vyplacení zbývající části úvěru, zpravidla do termínu sjednaného ve smlouvě. Typicky jde o poslední platbu za dokončenou stavbu nebo rekonstrukci.' },
          { term: 'Nedočerpání úvěru', def: 'Situace, kdy do konce lhůty pro čerpání nevyužijete celou schválenou částku. Některé banky si za to účtují poplatek. Podmínky najdete ve smlouvě.' },
          { term: 'Odklad splátek', def: 'Dočasné přerušení splácení po dohodě s bankou, například při ztrátě příjmu. Úroky obvykle běží dál, takže úvěr může ve výsledku vyjít dráž.' },
        ],
      },
      {
        title: 'Koupě a zajištění nemovitosti',
        items: [
          { term: 'Zástava', def: 'Nemovitost, kterou hypotéku zajišťujete. Banka ji má zapsanou v katastru, dokud úvěr nesplatíte.' },
          { term: 'Rezervační poplatek', def: 'Částka, kterou zaplatíte prodávajícímu nebo realitní kanceláři, aby nemovitost po sjednanou dobu nenabízeli nikomu jinému. Obvykle se započítá do kupní ceny. Podmínky vrácení najdete v rezervační smlouvě.' },
          { term: 'Zástavní právo', def: 'Právo banky uspokojit se z prodeje nemovitosti, pokud by se úvěr přestal splácet. Zapisuje se do katastru nemovitostí.' },
          { term: 'Zástavce', def: 'Vlastník nemovitosti, který ji dává bance do zástavy. Nemusí to být ten, kdo si půjčuje. Svou nemovitostí za vás můžou ručit například rodiče.' },
          { term: 'Věcné břemeno', def: 'Právo někoho jiného k vaší nemovitosti, například právo bydlení nebo vedení sítí přes pozemek. Zapisuje se do katastru, přechází na nového vlastníka a může ovlivnit hodnotu nemovitosti i to, jestli ji banka přijme do zástavy.' },
          { term: 'Výmaz zástavního práva', def: 'Odstranění zástavního práva z katastru po splacení úvěru. Nestane se samo: banka vám vydá potvrzení a s ním se podá návrh na výmaz.' },
        ],
      },
      {
        title: 'Druhy financování',
        items: [
          { term: 'Americká hypotéka', def: 'Úvěr zajištěný nemovitostí, který můžete použít na cokoli a nemusíte dokládat účel. Úrok bývá vyšší než u běžné hypotéky.' },
          { term: 'Předhypoteční úvěr', def: 'Úvěr na koupi bytu, který zatím nejde dát bance do zástavy, typicky družstevního před převodem do osobního vlastnictví nebo novostavby ještě nezapsané v katastru. Po zápisu zástavního práva ho nahradí běžná hypotéka. Úrok bývá vyšší.' },
          { term: 'Družstevní bydlení', def: 'Byt patří bytovému družstvu a vy kupujete členský podíl, se kterým získáte právo byt užívat. Protože byt není váš, nejde ho dát bance do zástavy. Financování se proto řeší jinak, například zástavou jiné nemovitosti nebo předhypotečním úvěrem.' },
        ],
      },
    ],
    note: 'Otázky a odpovědi jsou návrh – ověřit s klientkou, zejména cenu služeb.',
  },

  /* ---------- Certifikace (podstránka certifikace.html) ---------- */
  certifications: {
    eyebrow: 'Vzdělání a ocenění',
    title: 'Certifikace a ocenění',
    intro: 'Osvědčení, certifikáty a ocenění, které jsem získala. Kliknutím si každý dokument zvětšíte.',
    // Nový dokument = nový řádek. Obrázek patří do assets/img/certifikaty.
    items: [
      { title: 'TOP poradce pro rok 2023', issuer: 'ČSOB a Hypoteční banka', date: '2023', img: 'assets/img/certifikaty/top-poradce-2023.jpg' },
      { title: 'Certifikát Síň slávy', issuer: 'GEPARD FINANCE a.s.', date: '25. 1. 2018', img: 'assets/img/certifikaty/sin-slavy-2018.jpg' },
      { title: 'Osvědčení o odborné zkoušce podle zákona o spotřebitelském úvěru', issuer: 'EFPA Česká republika, skupina odbornosti I. a III.', date: '21. 9. 2017', img: 'assets/img/certifikaty/osvedceni-efpa-2017.jpg' },
      { title: 'Makléř měsíce ledna 2014, stavební spoření, 1. místo', issuer: 'GEPARD FINANCE a.s.', date: '1. 2. 2014', img: 'assets/img/certifikaty/makler-mesice-2014.jpg' },
      { title: 'Kurz Právní minimum II.', issuer: 'GEPARD AKADEMIE', date: '21. 3. 2012', img: 'assets/img/certifikaty/pravni-minimum-2012.jpg' },
      { title: 'Kurz Manažerské dovednosti', issuer: 'GEPARD AKADEMIE', date: '13.–14. 3. 2012', img: 'assets/img/certifikaty/manazerske-dovednosti-2012.jpg' },
      { title: 'Supermakléř roku 2011 (ČR + SR), umístění v TOP 10', issuer: 'GEPARD FINANCE a.s.', date: '1. 12. 2011', img: 'assets/img/certifikaty/supermakler-2011.jpg' },
      { title: 'Kurz Asertivní jednání', issuer: 'GEPARD AKADEMIE', date: '13.–14. 10. 2011', img: 'assets/img/certifikaty/asertivni-jednani-2011.jpg' },
      { title: 'Kurz Prodejní dovednosti', issuer: 'GEPARD AKADEMIE', date: '8.–9. 9. 2011', img: 'assets/img/certifikaty/prodejni-dovednosti-2011.jpg' },
      { title: 'Kurz Komunikace v prodeji', issuer: 'GEPARD AKADEMIE', date: '5.–6. 9. 2011', img: 'assets/img/certifikaty/komunikace-v-prodeji-2011.jpg' },
      { title: 'Makléřka roku 2009', issuer: 'GEPARD FINANCE a.s.', date: '26. 11. 2009', img: 'assets/img/certifikaty/maklerka-roku-2009.jpg' },
      { title: 'Certifikát o složení makléřské zkoušky', issuer: 'GEPARD FINANCE a.s.', date: '1. 11. 2008', img: 'assets/img/certifikaty/maklerska-zkouska-2008.jpg' },
    ],
  },

  /* ---------- Kancelář a kontakt ---------- */
  contactSection: {
    eyebrow: 'Kancelář a kontakt',
    title: 'Pojďme probrat vaše možnosti.',
    intro: 'Potkáme se v kanceláři na Husově v Brně, online, nebo po telefonu. Schůzky domlouvám vždy předem, abych na vás měla dost času.',
    officeTitle: 'Kancelář',
    callCta: 'Zavolat',
    mapCta: 'Otevřít v Google Maps',
    mapFallback: 'Mapa se načítá…',
    mapFallbackCta: 'Otevřít mapu kanceláře',   // ukáže se, když se mapa do 8 sekund nenačte
    routeCta: 'Naplánovat trasu',
  },

  // Kancelář. (Kdyby jich v budoucnu bylo víc, stačí přidat další položku – zobrazí se přepínač.)
  offices: [
    {
      id: 'kancelar',
      name: 'Kancelář Brno – Husova',
      street: 'Husova 594/6',
      city: '602 00 Brno',
      hours: 'Po předchozí domluvě',
      access: '',            // nepovinné, např. parkování a MHD
      mapQuery: 'Husova 594/6, 602 00 Brno',   // co se vyhledá v Google Maps (mapa na webu i odkaz)
      mapUrl: '',            // vlastní odkaz na mapu; prázdné = vyhledá se mapQuery v Google Maps
    },
  ],

  /* ---------- Témata pro rezervační formulář ---------- */
  topics: [
    { id: 'nove-bydleni', label: 'Hypotéka na nové bydlení' },
    { id: 'prvni-bydleni', label: 'Hypotéka na první bydlení' },
    { id: 'refinancovani', label: 'Refinancování hypotéky' },
    { id: 'stavba-rekonstrukce', label: 'Stavba nebo rekonstrukce' },
    { id: 'hypoteka-50', label: 'Hypotéka po padesátce' },
    { id: 'stavebni-sporeni', label: 'Stavební spoření' },
    { id: 'fotovoltaika', label: 'Financování fotovoltaiky' },
    { id: 'konzultace', label: 'Konzultace možností' },
    { id: 'jine', label: 'Něco jiného' },
  ],

  /* ---------- Patička a právní informace ---------- */
  footer: {
    credit: { label: 'Tvorba webu: Skočdal', url: 'https://skocdal.cz' },
    legalLinks: [
      { label: 'Reklamační řád', href: 'reklamacni-rad.html' },
      { label: 'Ochrana osobních údajů', href: 'ochrana-osobnich-udaju.html' },
      { label: 'Nastavení cookies', action: 'cookies' },
    ],
    // Regulatorní a identifikační údaje – NEVYMÝŠLET, doplnit až po ověření.
    legal: [
      { label: 'Identifikační údaje', value: 'Kili company s. r. o. · IČO 02634252 · DIČ CZ02634252 · sídlo Husova 594/6, 602 00 Brno' },
      { label: 'Postavení', value: 'Společnost GEPARD FINANCE a.s. je samostatným zprostředkovatelem spotřebitelského úvěru. Já jsem vázaným zástupcem GEPARD FINANCE a.s. a poskytuji doporučení podle § 3 odst. 1 písm. b) bodu 3 zákona 257 / 2016 Sb. o spotřebitelském úvěru. Společnost GEPARD FINANCE a.s. a její vázaní zástupci se nezabývají poskytováním rady podle § 85 zákona 257 / 2016 Sb. o spotřebitelském úvěru.' },
    ],
    prototypeNote: 'Prototyp webu – fotografie, texty a právní údaje budou doplněny po ověření.',
  },
};
