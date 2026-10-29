/* ==========================================================================
   OBSAH WEBU – texty, kontakty, služby, odkazy a nastavení na jednom místě
   --------------------------------------------------------------------------
   Jak upravovat (bez programování):
   • Měňte jen text mezi apostrofy '…'. Apostrof uvnitř textu napište jako \'.
   • [Hranaté závorky] = zástupný údaj. Na webu se zvýrazní, aby bylo jasné,
     co je potřeba doplnit nebo ověřit s klientkou.
   • *Hvězdičky* kolem slov = kurzíva s měděným akcentem (v nadpisech).
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
    showTools: true,         // kalkulačka splátky + hlídání konce fixace
    showTestimonials: true,  // reference
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
    city: '[Město]',
    claim: 'Dobrá hypotéka je ta, které rozumíte.',
  },

  /* ---------- SEO (titulek a popis ve vyhledávačích) ---------- */
  seo: {
    title: 'Petra Kilianová – hypoteční poradkyně | [Město]',
    description: 'Pomohu vám zorientovat se v hypotékách a najít financování, které sedí vašim plánům. Osobně v kanceláři, online i po telefonu. Domluvte si nezávaznou konzultaci.',
    url: 'https://www.[domena].cz/',
  },

  /* ---------- Kontakty ---------- */
  contact: {
    phone: '[+420 000 000 000]',
    phoneHref: '',           // číslo bez mezer pro proklik, např. '+420777123456'
    email: '[e-mail]',
    emailHref: '',           // e-mail pro proklik, např. 'petra@domena.cz'
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
  // Všechny položky jsou v patičce. Odkazy na sekce vypnuté v settings se skryjí samy.
  nav: [
    { label: 'Úvod', target: 'uvod' },
    { label: 'Služby', target: 'sluzby', main: true },
    { label: 'Proč se mnou', target: 'proc-se-mnou' },
    { label: 'O mně', target: 'o-mne', main: true },
    { label: 'Tým', target: 'tym' },
    { label: 'Spolupráce', target: 'spoluprace' },
    { label: 'Kalkulačka', target: 'kalkulacka', main: true },
    { label: 'Rezervace', target: 'rezervace' },
    { label: 'Ze života poradkyně', target: 'ze-zivota' },
    { label: 'Blog', target: 'blog', url: 'blog.html', main: true, needsPosts: true },
    { label: 'Reference', target: 'reference' },
    { label: 'Všechny recenze', target: 'recenze', url: 'recenze.html' },
    { label: 'FAQ', target: 'otazky', main: true },
    { label: 'Slovníček pojmů', target: 'slovnicek', url: 'slovnicek.html' },
    { label: 'Kontakt', target: 'kontakt', main: true },
  ],
  navCta: 'Domluvit schůzku',

  /* ---------- Úvodní obrazovka ---------- */
  hero: {
    eyebrow: 'Hypoteční poradkyně · [Město a okolí]',
    hand: 'Ahoj, jsem Petra',            // ručně psaná poznámka nad nadpisem
    stickers: ['Osobně, online i po telefonu', 'První schůzka nezávazně'],
    title: 'Váš nový *domov* začíná správným rozhodnutím.',
    rotate: ['domov', 'byt', 'dům'],   // slovo v *hvězdičkách* se na webu střídá s těmito slovy
    text: 'Pomohu vám zorientovat se v hypotékách a najít financování, které sedí vašim plánům. Vysvětlím vám každou možnost a provedu vás celým procesem – od první otázky až po podpis.',
    primaryCta: 'Domluvit nezávaznou konzultaci',
    secondaryCta: 'Jak vám mohu pomoci',
    portrait: {
      src: '',
      alt: 'Portrét hypoteční poradkyně Petry Kilianové',
      label: 'Portrét poradkyně',
      hint: 'Profesionální fotografie · 4 : 5 · min. 1600 × 2000 px',
    },
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
    title: 'Ať teprve začínáte, nebo vám *končí fixace*.',
    intro: 'Vyberte si, co právě řešíte. Na první schůzce si ujasníme vaši situaci a já vám ukážu, jaké máte možnosti – bez zbytečných odborných pojmů.',
    detailsLabel: 'Co spolu vyřešíme',
    hand: 'Klikněte na to, co právě řešíte',
    cta: 'Probrat na schůzce',
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
    title: 'Sami v bance, nebo *s poradkyní?*',
    intro: 'Do banky můžete jít i sami. Rozdíl je v tom, kolik nabídek uvidíte, kolik času strávíte papírováním a jestli vám po podpisu někdo pohlídá další kroky.',
    selfLabel: 'Sami v bance',
    meLabel: 'Se mnou',
    hand: 'Tohle je ten rozdíl',
    rows: [
      { label: 'Výběr', self: 'Nabídka jedné banky', me: 'Porovnání nabídek více bank a spořitelen' },
      { label: 'Podklady', self: 'Zjišťujete a zařizujete sami', me: 'Řeknu vám přesně, co je potřeba, a pomohu s přípravou' },
      { label: 'Jednání s bankou', self: 'Na vás', me: 'Komunikaci s bankou pohlídám za vás' },
      { label: 'Schůzky', self: 'Na pobočce v otevírací době', me: 'Osobně, online i po telefonu' },
      { label: 'Po podpisu', self: 'Konec fixace si hlídáte sami', me: 'Ozvu se, když se blíží konec fixace' },
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
    title: 'Za každou hypotékou je jeden velký *životní krok*.',
    lead: 'Jmenuji se Petra Kilianová a jsem hypoteční poradkyně v [Město]. Pomáhám lidem financovat bydlení tak, aby rozuměli tomu, co podepisují – a mohli se na nový domov těšit.',
    paragraphs: [
      'Za každou žádostí o hypotéku vidím konkrétní příběh. Pár, který poprvé podepisuje kupní smlouvu. Rodinu, které je malý byt těsný. Nebo někoho, kdo konečně staví dům, o kterém roky mluvil.',
      'Mou prací je přeložit čísla, podmínky a bankovní jazyk do srozumitelných rozhodnutí. Abyste věděli, proč volíte právě tuhle variantu – a co pro vás bude znamenat za pět nebo deset let.',
    ],
    story: '[Osobní příběh: jak se Petra k hypotékám dostala, co ji na práci baví a proč jí na klientech záleží. Doplníme po společném rozhovoru – jejími vlastními slovy.]',
    quote: 'Dobrá hypotéka je ta, které rozumíte.',
    values: [
      { title: 'Rozumíte každému kroku', text: 'Než cokoli podepíšete, víte, co to znamená. Vysvětluji bez zkratek a bankovního žargonu.' },
      { title: 'Díváme se dál než na sazbu', text: 'Úroková sazba je důležitá, ale není jediná. Řešíme i délku fixace, pojištění, mimořádné splátky a to, jak se hypotéka vejde do vašeho života.' },
      { title: 'Podpisem to nekončí', text: 'Hypotéka vás bude provázet roky. Když se blíží konec fixace nebo se změní vaše situace, můžete se na mě obrátit.' },
    ],
    signature: 'Petra Kilianová',
    photoNote: 'To jsem já',
    cta: 'Poznejme se osobně',
    portrait: { src: '', alt: 'Petra Kilianová, hypoteční poradkyně', label: 'Portrét – osobní představení', hint: 'Přirozené světlo · 3 : 4 · min. 1500 × 2000 px' },
    note: 'Návrh textu – finální podobu upravíme po rozhovoru s klientkou. Neobsahuje žádné vymyšlené údaje o praxi, oprávněních ani úspěších. Logo a prezentaci partnera ověřit podle pravidel Gepard Finance.',
  },

  /* ---------- Tým (volitelná sekce – viz settings.showTeam) ---------- */
  team: {
    eyebrow: 'Tým',
    title: 'Při práci mi pomáhá *asistentka*.',
    intro: '[Volitelné: krátké představení asistentky a toho, s čím vám pomůže.]',
    members: [
      { name: '[Jméno a příjmení]', role: 'Asistentka', text: '[Jednou větou: s čím klientům pomáhá]', photo: { src: '', alt: '', label: 'Portrét asistentky' } },
    ],
    note: 'Volitelná sekce. Vypnete ji v souboru content/site.js (settings.showTeam: false). Neuvádíme žádné skutečné zaměstnance.',
  },

  /* ---------- Jak probíhá spolupráce ---------- */
  process: {
    eyebrow: 'Jak probíhá spolupráce',
    title: 'Víte, co vás čeká. *Krok za krokem.*',
    intro: 'Celý proces má jasný postup. U každého kroku vám řeknu, co se bude dít, co budu potřebovat od vás a co zařídím já.',
    cta: 'Začněme prvním krokem',
    finish: 'Klíče od vašeho domova',
    steps: [
      { title: 'Seznámíme se a probereme vaše plány', text: 'Osobně, online nebo po telefonu. Řeknete mi, co chcete financovat, v jakém časovém horizontu a co je pro vás důležité. Já vám vysvětlím, jak celý proces probíhá.', tip: 'Stačí vaše představa – podklady řešíme až později.' },
      { title: 'Společně projdeme dostupné možnosti', text: 'Porovnáme varianty, které pro vás připadají v úvahu. Nejen podle úrokové sazby, ale i podle délky fixace, výše splátky a podmínek, které budou důležité za pár let.', tip: 'Rozhodnutí je vždy na vás.' },
      { title: 'Pomohu vám s dalším postupem a administrativou', text: 'Připravíme podklady, podáme žádost a já pohlídám termíny i komunikaci s bankou. Každý dokument vám před podpisem vysvětlím.', tip: 'Víte, co podepisujete – a proč.' },
      { title: 'Zůstáváme v kontaktu', text: 'Hypotéka vás bude provázet roky. Když se blíží konec fixace nebo se změní vaše plány, ozvěte se – společně najdeme další krok.', tip: 'Jsem tu i po podpisu smlouvy.' },
    ],
  },

  /* ---------- Kalkulačka splátky (viz settings.showTools) ---------- */
  calculator: {
    eyebrow: 'Kalkulačka a hlídání fixace',
    title: 'Spočítejte si to. *Nebo si nechte pohlídat fixaci.*',
    intro: 'Orientační výpočet vám dá první představu. Přesná čísla podle vaší situace a aktuálních nabídek bank připravím na schůzce.',
    cardTitle: 'Orientační splátka',
    amount: { label: 'Výše úvěru', min: 500000, max: 15000000, step: 50000, value: 4000000 },
    years: { label: 'Doba splácení', min: 5, max: 30, step: 1, value: 30 },
    rate: { label: 'Úroková sazba', min: 2, max: 9, step: 0.05, value: 5 },  // ukázková hodnota, nejde o aktuální sazbu
    rateNote: 'ukázková hodnota',
    disclaimer: 'Výpočet je pouze orientační a nejde o nabídku úvěru ani o aktuální sazby bank. Nezahrnuje poplatky, pojištění ani další náklady.',
    cta: 'Probrat přesný výpočet',
    note: 'Výchozí sazba je jen ukázková. Pokud bude web uvádět sazby nebo náklady úvěru, je potřeba ověřit povinné údaje (např. reprezentativní příklad) s Gepard Finance.',
  },

  /* ---------- Hlídání konce fixace – sběr kontaktů ---------- */
  fixWatch: {
    title: 'Pohlídám vám *konec fixace*.',
    text: 'Napište mi, kdy vám končí fixace, a já se vám včas ozvu. Budete mít dost času porovnat nabídku své banky s dalšími možnostmi.',
    consent: 'Souhlasím, aby mě poradkyně kontaktovala ohledně konce mé fixace. Souhlas mohu kdykoli odvolat.',
    cta: 'Hlídat moji fixaci',
    success: 'Děkuji, ozvu se vám s dostatečným předstihem před koncem fixace.',
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
    title: 'Srozumitelně o *hypotékách*.',
    intro: 'Praktické tipy, vysvětlení a odpovědi na otázky, které se kolem financování bydlení opakují nejčastěji.',
    emptyTitle: 'Články se připravují',
    emptyText: 'První texty přibudou brzy. Mezitím se mi klidně ozvěte, ráda poradím osobně.',
    teaserEyebrow: 'Blog',
    teaserTitle: 'Nejnovější *články*.',
    teaserText: 'Tipy a vysvětlení, které vám pomohou při rozhodování o hypotéce.',
    allLabel: 'Všechny články',
    ctaTitle: 'Chcete to probrat osobně?',
    ctaText: 'Ráda vám pomůžu zorientovat se a najít řešení, které sedí vaší situaci.',
  },

  /* ---------- Ze života poradkyně – odkaz na Instagram (videa jsou jen tam) ---------- */
  insta: {
    eyebrow: 'Ze života poradkyně',
    title: 'Tipy a rady najdete *na Instagramu*.',
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
    title: 'Slovo mají *klienti*.',
    intro: 'Co o spolupráci napsali klienti v hodnoceních na webu Gepard Finance. Doslovně, bez úprav.',
    // Nová recenze = nový řádek { text: '…', name: '…' }. Na webu jedou v posuvném pásu i na podstránce recenze.html.
    items: [
      { text: 'Jednička, co dodat?', name: 'Vladimír Kaleta' },
      { text: 'Profesionální služby na vysoké úrovni.', name: 'Ing. Ľuboslav Ddrobáň' },
      { text: 'Paní Kilianová je profesionál s lidským přístupem a nekonečnou ochotou.', name: 'Fajkus Marek' },
      { text: 'Na cestě za naším vysněným domem jsme potkali na osobní doporučení paní Petru Kiliánovou. Asi se nedá vyjádřit poděkování jedním slovem. Naše cesta za financemi nebyla vůbec jednoduchá a s paní Petrou jsme strávili 5měsíců intenzivní práce, nervů, infarktových stavů, kdy hořely termíny rezervací,smluv atd. Paní Petra nikdy neztratila svůj optimistický pohled na věc, vždy podpořila vlídným slovem a patřičnou motivací, vždy byla na telefonu či mailu. Profesně je to člověk na svém místě, který lidsky dává neuvěřitelnou víru klientům, že společné dílo dopadne. Nám dopadlo a v pondělí se stáváme vlastníky nemovistosti. :-) Určitě budeme rádi, když nám paní Petra vydrží vitální a po našem boku celých dalších 20let trvání hypotéky. :-) Děkujeme! Silva Páčová a Luboš Dobšík', name: 'Libor F.' },
      { text: 'Vše v pořádku! Děkuji za spolupráci!', name: 'Ing. Ľuboslav Ddrobáň' },
      { text: 'Maximálně profesionální přístup a znalost daného finančního problému...rychlá a účelná domluva.', name: 'Nataliya Dukhnych' },
      { text: 'Naprosto profesionální přístup, rychlost jednání, neopomenutí detailů. Naprostá spokojenost!', name: 'Chlup Rostislav' },
      { text: 'Paní Kilianová, chtěli bychom Vám hrozně moc poděkovat za vaši naprosto neskutečně precizní a kvalitní práci. Máme s Vámi už druhou perfektní zkušenost a to prostě nemůže být náhoda. Navíc, tento prodej-koupě byl docela oříšek, ale vy jste nás tím martýriem provedla jako nic. Díky Vám jsme byli v pořád obraze. Možná i ve větším, než někteří pracovníci KB. Spolupracovat s Vámi je radost. Opravdu moc Vám za to děkujeme. Osobně doufám, že teď nějakou dobu žádnou nemovitost kupovat nebudeme. Nicméně až nějaká taková příležitost nastane, budete první, na koho se obrátíme. A buďte si jistá, že Vás budeme doporučovat každému, kdo se jen letmo zmíní, že uvažuje o hypotéce. Omlouvám se, že píšeme až cca po měsíci od předání domu, ale doteď jsme lítali s přepisy energií, po úřadech, domlouvali rekonstrukci...ale to už jsou takové ty příjemné starosti. V domě už bydlíme, sice máme jen stůl, židle a matrace, ale je to lepší, než v kdejakém pětihvězdičkovém hotelu. Ještě jednou děkujeme a rádi Vám napíšeme vynikající recenzi! Mějte se krásně a přejeme spoustu dalších spokojených klientů, jako jste udělala z nás. Jílkovi', name: 'Nataliya Dukhnych' },
      { text: 'Paní Kilianová je člověk na svém místě a není to pro ni jen práce. Jsem moc rád že jsem s ní mohl spolupracovat.', name: 'Alena H.' },
      { text: 'jednička!', name: 'Vladimír Kaleta' },
      { text: 'Naprosto profesionální přístup, rychlost jednání, neopomenutí detailů. Naprostá spokojenost!', name: 'Čermák Daniel' },
      { text: 'Paní Kilianova nejlepší specialista. Vždycky pomůže, nic není problém.', name: 'Ing. Ľuboslav Ddrobáň' },
      { text: 'Paní Kiliánová je mistr ve svém oboru, je profesionální, má široký rozptyl vědomostí, dokáže skvěle poradit, je ochotná, usměvavá a moc nás těší spolupráce s ní.', name: 'Ing. Ľuboslav Ddrobáň' },
    ],
    allLabel: 'Všechny recenze',
    pageTitle: 'Co o spolupráci říkají *klienti*.',   // nadpis podstránky recenze.html
    ask: 'Už jsme spolu řešili vaši hypotéku? Vaše zkušenost pomůže dalším lidem v rozhodování.',
    reviewLink: { label: 'Napsat recenzi', url: '' },   // např. odkaz na Google recenze
    note: 'Recenze jsou převzaté doslovně z hodnocení na webu Gepard Finance. Jména jsou uvedená tak, jak jsou tam zveřejněná.',
  },

  /* ---------- Časté otázky a slovníček (viz settings.showFaq) ---------- */
  faq: {
    eyebrow: 'Časté otázky',
    title: 'Na co se lidé *ptají nejčastěji*.',
    intro: 'Nenašli jste odpověď? Zavolejte mi, napište e-mail, nebo si rovnou domluvte schůzku. Hloupé otázky neexistují.',
    items: [
      { q: 'Kolik mě vaše služby stojí?', a: '[Doplnit podle skutečnosti – např. zda je konzultace zdarma a jak je poradkyně odměňována.]' },
      { q: 'Proč řešit hypotéku přes poradkyni, a ne rovnou v bance?', a: 'Uvidíte víc nabídek najednou a nemusíte obcházet jednotlivé banky. Pomohu vám s podklady, s komunikací s bankou i s tím, abyste rozuměli každé smlouvě. Rozhodnutí je vždy na vás.' },
      { q: 'Co si mám připravit na první schůzku?', a: 'Stačí představa o tom, co chcete financovat, a přehled o vašich příjmech a výdajích. Konkrétní doklady řešíme až v dalším kroku – dostanete ode mě přesný seznam.' },
      { q: 'Jak dlouho trvá vyřízení hypotéky?', a: 'Záleží na bance, typu nemovitosti a na tom, jak rychle se podaří připravit podklady. Obvykle počítejte s několika týdny. Odhad pro vaši situaci vám řeknu na první schůzce.' },
      { q: 'Kdy začít řešit konec fixace?', a: 'Ideálně několik měsíců předem. Budete mít čas porovnat nabídku své banky s dalšími možnostmi a v klidu se rozhodnout.' },
      { q: 'Musím mít vlastní úspory?', a: 'Banky obvykle financují jen část hodnoty nemovitosti, zbytek je potřeba pokrýt z vlastních zdrojů. Kolik to bude ve vašem případě a jaké máte možnosti, spočítáme spolu.' },
      { q: 'Dá se všechno vyřešit online?', a: 'Většinu kroků zvládneme online nebo po telefonu. Pokud dáváte přednost osobnímu setkání, potkáme se v kanceláři.' },
    ],
    hand: 'Hloupé otázky neexistují',
    glossaryTitle: 'Slovníček pojmů',
    glossaryText: 'Fixace, LTV, RPSN… Co která slova znamenají, vysvětlená lidsky a na jednom místě.',
    glossaryCta: 'Slovníček pojmů',
    glossaryIntro: 'Hypotéky mají svůj vlastní jazyk. Tady najdete nejčastější pojmy vysvětlené srozumitelně.',
    glossary: [
      { term: 'Fixace', def: 'Období, po které se nemění úroková sazba. Po jejím skončení dostanete novou nabídku – nebo můžete hypotéku převést jinam.' },
      { term: 'LTV', def: 'Poměr výše úvěru k hodnotě nemovitosti. Čím je nižší, tím menší riziko pro banku.' },
      { term: 'RPSN', def: 'Roční procentní sazba nákladů. Zahrnuje úrok i další náklady úvěru a pomáhá porovnat nabídky mezi sebou.' },
      { term: 'Odhad nemovitosti', def: 'Ocenění nemovitosti, ze kterého banka vychází při rozhodování, kolik vám může půjčit.' },
      { term: 'Čerpání', def: 'Vyplacení peněz z hypotéky – najednou, nebo postupně, například podle průběhu stavby.' },
      { term: 'Zástava', def: 'Nemovitost, kterou hypotéku zajišťujete. Banka ji má zapsanou v katastru, dokud úvěr nesplatíte.' },
    ],
    note: 'Otázky a odpovědi jsou návrh – ověřit s klientkou, zejména cenu služeb.',
  },

  /* ---------- Kancelář a kontakt ---------- */
  contactSection: {
    eyebrow: 'Kancelář a kontakt',
    title: 'Pojďme probrat *vaše možnosti*.',
    intro: 'Potkáme se v kanceláři, online, nebo po telefonu. Schůzky domlouvám vždy předem, abych na vás měla dost času.',
    officeTitle: 'Kancelář',
    callCta: 'Zavolat',
    mapNote: 'Mapa se načte až po vašem souhlasu s obsahem třetích stran.',
  },

  // Kancelář. (Kdyby jich v budoucnu bylo víc, stačí přidat další položku – zobrazí se přepínač.)
  offices: [
    {
      id: 'kancelar',
      street: '[Ulice a číslo popisné]',
      city: '[PSČ Město]',
      hours: 'Po předchozí domluvě',
      access: '[Parkování a MHD – doplnit]',
      mapUrl: '',            // odkaz na Mapy.cz / Google Maps
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
    legalLinks: [
      { label: 'Ochrana osobních údajů', href: 'ochrana-osobnich-udaju.html' },
      { label: 'Nastavení cookies', action: 'cookies' },
    ],
    // Regulatorní a identifikační údaje – NEVYMÝŠLET, doplnit až po ověření.
    legal: [
      { label: 'Identifikační údaje', value: 'Petra Kilianová · [IČO a sídlo – doplnit]' },
      { label: 'Značka', value: 'Působím jako franšízová poradkyně značky Gepard Finance. [Údaje o franšízové smlouvě a sídle značky – doplnit]' },
      { label: 'Postavení a registrace', value: '[Postavení zprostředkovatele a údaje o registraci – doplnit po ověření]' },
      { label: 'Stížnosti a spory', value: '[Informace o vyřizování stížností a mimosoudním řešení sporů – doplnit po ověření]' },
      { label: 'Reprezentativní příklad', value: '[Doplnit, pokud web uvádí úrokové sazby nebo náklady úvěru – podle pokynů Gepard Finance]' },
    ],
    prototypeNote: 'Prototyp webu – fotografie, texty a právní údaje budou doplněny po ověření.',
  },
};
