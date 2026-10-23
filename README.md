# Petra Kilianová – hypoteční poradkyně · web

Responzivní prototyp osobního webu hypoteční poradkyně Petry Kilianové (partnerská společnost Gepard Finance). Slouží jako návrh budoucí realizace: design, texty, struktura i klíčové funkce (rezervace schůzky, kalkulačka, hlídání konce fixace, cookies) jsou funkční, ale **běží v ukázkovém režimu**.

- Fotografie a neznámé údaje jsou nahrazené zástupnými plochami a `[zvýrazněnými]` údaji.
- Nic není vymyšlené: žádné reference, hodnocení, počty klientů, oprávnění, registrace ani zaměstnanci.
- Rezervace ani formuláře nic neodesílají a jsou tak viditelně označené.

---

## Jak web otevřít

**Nejjednodušší:** dvojklik na `index.html` (funguje i bez serveru).

**Přes lokální server** (doporučeno pro prezentaci):

```bash
python3 -m http.server 5173
```

Pak otevřete http://localhost:5173.

**Tip pro prezentaci klientce:** odznak **„Prototyp“** vedle jména v hlavičce otevře panel, kde lze zapnout *poznámky k návrhu* (přímo v sekcích vysvětlí, co je potřeba potvrdit), znovu zobrazit lištu cookies nebo vymazat demo data.

---

## Obsah stránky

| Sekce | Co dělá |
| --- | --- |
| Hlavička | Odkaz na každou sekci včetně FAQ (zvýrazní se ta, kterou právě čtete) a tlačítko „Domluvit schůzku“. Po odrolování se na širokých obrazovkách složí do jednoho řádku, na menších obrazovkách je vše v menu |
| Úvod | Hlavní sdělení se střídajícím se slovem (*domov → byt → dům*), portrét (oblouk), dvě výzvy k akci, způsoby schůzky |
| S čím mohu pomoci | 4 rozbalovací karty služeb + „méně obvyklé situace“ (OSVČ, příjmy ze zahraničí…) |
| Proč se mnou | Srovnání „sami v bance × se mnou“ a místo pro loga spolupracujících bank |
| O mně (+ tým) | Osobní představení, hodnoty, motto, partnerská společnost Gepard Finance; tým lze skrýt |
| Jak probíhá spolupráce | 4 kroky s animací při posunu |
| Kalkulačka a hlídání fixace | Orientační splátka (posuvníky) + formulář „Pohlídám vám konec fixace“ (sběr kontaktů) |
| Rezervace schůzky | Jediný formulář na webu: typ schůzky (kancelář / online / telefon) → kalendář a čas → kontakt a vzkaz → potvrzení (demo) |
| Ze života poradkyně | Odkaz na Instagram (videa a tipy jsou jen tam) a LinkedIn |
| Reference | Místo pro skutečné recenze; lze skrýt |
| Časté otázky | Rozbalovací odpovědi + slovníček pojmů (fixace, LTV, RPSN…) |
| Kancelář a kontakt | Adresa kanceláře, telefon, e-mail, tlačítko na rezervaci a mapa (načte se až po souhlasu) |
| Patička | Kontakty, sítě, právní a regulatorní údaje (k doplnění) |

---

## Struktura souborů

```
index.html                    šablona hlavní stránky (obsah se vykreslí z content/)
ochrana-osobnich-udaju.html   šablona zásad ochrany osobních údajů
blog.html, clanek.html        výpis blogu a detail článku
admin.html                    správa blogu (psaní článků)
robots.txt                    prototyp je zablokovaný pro vyhledávače
content/
  site.js                     VŠECHNY texty, kontakty, služby, kanceláře, odkazy, nastavení
  blog/posts.js               články blogu (zapisuje správa, ručně needitovat)
assets/
  css/styles.css              designový systém (barvy, písma, rozvržení, animace)
  js/core.js                  sdílené nástroje (ikony, fotografie, validace, měření)
  js/app.js                   vykreslení sekcí a interakce (kalkulačka, hlídání fixace…)
  js/booking.js               rezervační widget (vyměnitelný „poskytovatel termínů“)
  js/blog.js                  výpis a detail článků, čištění HTML
  js/admin.js, css/admin.css  správa blogu
  js/consent.js               souhlas s cookies + Google Consent Mode v2
  fonts/                      písmo hostované lokálně (Outfit – OFL)
  img/favicon.svg
```

Bez build kroku, bez knihoven, bez načítání čehokoli z cizích serverů.

---

## Úpravy obsahu (bez programování)

Vše se upravuje v souboru **`content/site.js`**:

- Měňte jen text mezi apostrofy `'…'`.
- `[Hranaté závorky]` = zástupný údaj. Na webu se zvýrazní, dokud ho nenahradíte skutečným textem.
- `*Hvězdičky*` kolem slova = kurzíva s měděným akcentem v nadpisu. V hlavním nadpisu úvodu se toto slovo navíc střídá se slovy z `hero.rotate` (např. `['domov', 'byt', 'dům']`). Prázdný seznam střídání vypne.
- Navigace (`nav`): pořadí a názvy položek. Položky s `main: true` (Služby, O mně, Kalkulačka, FAQ, Kontakt) jsou v hlavičce a v mobilním menu, všechny položky jsou v patičce. Odkazy na sekce vypnuté v `settings` se skryjí samy.
- Kontakty: vyplňte i `phoneHref` a `emailHref` – teprve pak budou telefon a e-mail klikatelné. Odkazy na Instagram a LinkedIn patří do části `social`.

Sekce lze vypnout v `settings` (hodnota `false`):

| Nastavení | Sekce |
| --- | --- |
| `showWhy` | Proč se mnou (srovnání s bankou + banky) |
| `showTeam` | Tým |
| `showTools` | Kalkulačka splátky + hlídání konce fixace |
| `showTestimonials` | Reference (dokud nejsou skutečné recenze) |
| `showFaq` | Časté otázky a slovníček |
| `prototype` | odznak „Prototyp“ a poznámky k návrhu (pro ostrý web vypnout) |

Barvy a písma se mění na jednom místě – proměnné na začátku `assets/css/styles.css` (`--paper`, `--ink`, `--copper`…).

---

## Blog a správa webu

Blog se spravuje přímo na webu, na adrese **`admin.html`** (např. `https://petaholec.github.io/petra-kilianova-web/admin.html`). Klientka tam bez programování píše, upravuje, skrývá (koncept) a maže články.

**Jak to funguje:** web je statický (GitHub Pages), takže správa ukládá články přímo do GitHub repozitáře (`content/blog/posts.js`, obrázky do `assets/blog/`). GitHub web sám přegeneruje, změna je vidět za 1–2 minuty. Žádný server ani další služba není potřeba.

**Jednorázové nastavení přístupu** (návod je i na přihlašovací stránce správy):
1. Klientka musí mít účet na github.com a práva k repozitáři (Settings → Collaborators, nebo repozitář převést na její účet; pak upravte `blog.repo` v `content/site.js`).
2. Na github.com/settings/personal-access-tokens/new vytvoří klíč: jen pro tento repozitář, oprávnění **Contents: Read and write**, platnost 1 rok.
3. Klíč vloží na přihlašovací stránce správy. Uloží se jen v jejím prohlížeči. Po roce se vytvoří nový.

**Psaní článku:** nadpis, datum, krátký úvod, titulní obrázek a text s tlačítky (nadpis, tučně, seznam, citace, odkaz, obrázek). Vložený text se automaticky vyčistí. Fotky se před nahráním zmenší na max. 1600 px. Přepínač „Zveřejněno / Koncept“ určuje, zda se článek na webu ukáže.

**Na webu:** výpis `blog.html`, detail `clanek.html?c=adresa-clanku`, ukázka tří nejnovějších na úvodní stránce. Dokud není zveřejněný žádný článek, odkaz „Blog“ v menu i ukázka na úvodní stránce se skryjí. Texty blogu (nadpisy, úvod) jsou v `content/site.js` v části `blog`.

**Omezení:** články se vykreslují skriptem, takže vyhledávače je indexují hůř než klasické stránky. Pro SEO blogu do budoucna zvažte generování statických stránek. Správa nemá historii verzí, zálohou je historie commitů v repozitáři.

## Fotografie – seznam pro focení

Fotku vložíte tak, že ji uložíte do `assets/img/` a do pole `src` v `content/site.js` napíšete cestu (např. `'assets/img/portret.webp'`). Dokud je `src` prázdné, zobrazuje se designový placeholder s popisem.

| Místo na webu | Pole v `content/site.js` | Formát | Doporučený rozměr |
| --- | --- | --- | --- |
| Hlavní portrét (úvod) | `hero.portrait` | 4 : 5, na výšku | 1600 × 2000 px |
| Portrét v sekci O mně | `about.portrait` | 3 : 4 | 1500 × 2000 px |
| Portréty týmu (pokud zůstane) | `team.members[].photo` | 4 : 5 | 1200 × 1500 px |
| Logo Gepard Finance | `about.partner.logo` | SVG / PNG | – |
| Obrázek pro sdílení (Facebook, LinkedIn) | `assets/img/og-image.jpg` | 1,91 : 1 | 1200 × 630 px |

Fotky kanceláře na webu nejsou. Doporučení: formát WebP nebo AVIF, do ~300 kB na fotku, vždy vyplnit popis `alt`. Portréty jsou ořezané do tvaru oblouku (motiv „dveří domova“), proto je dobré nechat nad hlavou trochu prostoru.

---

## Instagram a videa

Videa (Reels) jsou **jen na Instagramu** – web je nepřehrává ani nevkládá. Sekce „Ze života poradkyně“ na ně odkazuje tlačítkem a kartou profilu. Stačí v `content/site.js → social` doplnit skutečný odkaz a jméno profilu. Výhoda: žádná správa videí na webu a žádné cookies třetích stran.

---

## Kalkulačka a hlídání fixace

- **Kalkulačka** počítá orientační měsíční splátku anuitního úvěru (výše úvěru, doba splácení, sazba) a ukáže, o kolik by splátka vzrostla při sazbě vyšší o 1 procentní bod. Výchozí sazba je **ukázková**, ne aktuální nabídka bank – nastavuje se v `calculator.rate.value`. Pokud bude web uvádět sazby nebo náklady úvěru, je potřeba s Gepard Finance ověřit povinné údaje (např. reprezentativní příklad – v patičce je pro něj připravené místo).
- **Hlídání konce fixace** sbírá e-mail, měsíc a rok konce fixace a souhlas s kontaktováním. V ostré verzi napojit na e-mailový nástroj nebo CRM a připomenutí posílat s předstihem. V prototypu se nic neukládá.

---

## Rezervace schůzek

Widget v `assets/js/booking.js` je postavený nad vyměnitelným „poskytovatelem termínů“:

```
provider.getSlots(datum, typSchůzky)  → volné časy
provider.createBooking(údaje)         → potvrzení rezervace
```

V prototypu běží `DemoProvider` (smyšlené termíny, nic se neodesílá). Možnosti pro ostrý provoz:

1. **Nejrychlejší:** účet na Cal.com nebo Calendly, v `content/site.js` nastavit `booking.provider = 'external'` a `booking.externalUrl`. Tlačítko otevře rezervační stránku v novém okně.
2. **Doporučené:** zachovat vlastní design widgetu a napojit ho přes malý backend na Cal.com API / Calendly API / Google či Outlook kalendář. Klíče k API nesmí být v prohlížeči.
3. Vložený kalendář (embed) třetí strany – jen po souhlasu s cookies.

Typy schůzek, jejich délku a pracovní dobu je potřeba potvrdit s klientkou (`booking.types`). Všechna tlačítka „Domluvit schůzku“ vedou k rezervaci, karty služeb navíc předvyplní téma; na mobilu je vždy po ruce spodní lišta.

---

## Formuláře

Na webu je jen rezervační formulář (kancelář / online / telefon, s možností napsat vzkaz předem) a krátký formulář pro hlídání fixace. Oba mají validaci a ochranu proti spamu (skryté pole), **ale nic neodesílají**. Samostatný formulář „Napište mi“ na webu záměrně není – dotazy bez schůzky pokryje telefon a e-mail v sekci Kontakt. Pro ostrou verzi napojit na vlastní endpoint nebo službu (např. Netlify Forms, Formspree, vlastní backend, e-mailový nástroj) – s ohledem na GDPR (smlouva se zpracovatelem, umístění dat).

---

## GDPR, cookies a obsah třetích stran

- Lišta souhlasu: kategorie Nezbytné / Analytické / Marketingové, stejně snadné odmítnutí jako přijetí, změna volby v patičce.
- Google Consent Mode v2: výchozí stav vše zamítnuto.
- Google Tag Manager a Meta Pixel se načtou **jen se souhlasem** a jen když v `content/site.js → tracking` vyplníte jejich ID (teď jsou prázdná = nenačítá se nic).
- Mapa a cizí kalendáře se načítají až po souhlasu / kliknutí.
- Písma jsou hostovaná lokálně (žádné Google Fonts z cizího serveru).
- `ochrana-osobnich-udaju.html` je jen **struktura** – finální text musí připravit nebo ověřit právník (včetně toho, kdo je správcem údajů: poradkyně, nebo Gepard Finance).

---

## SEO

- Sémantické HTML, jeden H1, logická hierarchie nadpisů, popisky obrázků.
- Titulek a popis stránky se berou z `content/site.js → seo`.
- Strukturovaná data (JSON-LD): `FinancialService`, `Person` a `FAQPage` (časté otázky) – zástupné údaje se do nich nepropisují.
- **Prototyp je skrytý před vyhledávači** (`<meta name="robots" content="noindex">` v HTML souborech a `robots.txt`). Před spuštěním odstranit.
- Pro ostrou verzi doporučuji předgenerovat HTML ze stejného obsahového souboru (Astro nebo Eleventy) – lepší SEO i rychlost – a doplnit sitemap, canonical URL, OG obrázek a profil firmy na Googlu.

---

## Měření a kampaně

Web zapisuje události do `dataLayer` (pro Google Tag Manager, GA4, Meta):

| Událost | Kdy |
| --- | --- |
| `booking_cta_click` | klik na libovolné „Domluvit schůzku“ (s informací, které tlačítko) |
| `booking_type_selected`, `booking_date_selected`, `booking_time_selected`, `booking_slot_confirmed` | jednotlivé kroky rezervace (trychtýř) |
| `booking_submit_demo` | dokončená rezervace (v ostré verzi hlavní konverze) |
| `fixwatch_submit_demo` | přihlášení k hlídání konce fixace (sběr kontaktů) |
| `calculator_used`, `faq_open`, `service_details_open` | zájem o obsah |
| `*_form_error`, `click` | chyby ve formulářích, ostatní sledované odkazy (telefon, e-mail, sítě…) |

UTM parametry z reklamních kampaní (`utm_source`, `utm_campaign`…) se uloží na dobu návštěvy a připojí k rezervaci i hlídání fixace – je tak vidět, ze které kampaně zájemce přišel.

---

## Přístupnost

Ovládání klávesnicí (menu, kalendář šipkami a PageUp/PageDown, posuvníky kalkulačky, otázky), viditelný focus, odkaz „Přeskočit na obsah“, popisky formulářových polí, chyby oznamované čtečkám, dostatečný kontrast barev, respektování nastavení „omezit pohyb“ v systému.

Kompatibilita: aktuální Chrome, Safari, Firefox a Edge (desktop i mobil).

---

## Inspirace z webů jiných poradců

Na webech hypotečních poradců a zprostředkovatelů se opakují tyto prvky – do prototypu jsme převzali ty, které dávají smysl pro osobní značku:

| Prvek | Stav v prototypu |
| --- | --- |
| Kalkulačka splátky / refinancování | ✅ přidáno (orientační, bez aktuálních sazeb) |
| Hlídání konce fixace s upozorněním | ✅ přidáno (sběr kontaktů se souhlasem) |
| Srovnání „poradce × banka“ | ✅ přidáno |
| Loga spolupracujících bank | ✅ místo připravené – doplnit jen ověřené banky |
| Časté otázky + slovníček pojmů | ✅ přidáno |
| Specializace (OSVČ, příjmy ze zahraničí…) | ✅ přidáno jako návrh k potvrzení |
| Reference a hodnocení | ✅ místo připravené (bez vymyšlených recenzí) |
| Regulatorní údaje v patičce | ✅ místo připravené (k ověření) |
| Čísla (počet klientů, objem úvěrů, hodnocení) | ⏳ jen se skutečnými a doložitelnými údaji |
| Články / blog, newsletter | ⏳ případně později (obsah zatím jde na Instagram) |
| Hodnocení z Google profilu, zmínky v médiích, WhatsApp | ⏳ až budou k dispozici |

---

## Co doplnit a ověřit s klientkou

- [ ] Město/oblast působení, telefon, e-mail
- [ ] Instagram a LinkedIn profil
- [ ] Kancelář: adresa, parkování/MHD, odkaz do Mapy.cz
- [ ] Rozsah a názvy služeb (4 karty), body „Co spolu vyřešíme“ a seznam méně obvyklých situací
- [ ] Kolik bank Petra porovnává a které (loga), cena služeb pro klienta (časté otázky)
- [ ] Typy schůzek, jejich délka, kdy jsou termíny k dispozici; výběr rezervačního systému
- [ ] Výchozí ukázková sazba v kalkulačce; jak a kdy posílat připomenutí konce fixace
- [ ] Osobní příběh (rozhovor s klientkou) a motto „Dobrá hypotéka je ta, které rozumíte.“
- [ ] Tým: prezentovat, nebo sekci skrýt? Jména, role, souhlas s fotkou
- [ ] Gepard Finance: přesný název, logo a pravidla pro weby poradců (povinné údaje, použití loga, schvalování textů, reprezentativní příklad)
- [ ] Regulatorní a identifikační údaje: postavení zprostředkovatele, registrace, IČO, sídlo, vyřizování stížností – **vše ověřit, nic nevymýšlet**
- [ ] Reference: jak je sbírat (např. Google recenze) a do té doby sekci skrýt?
- [ ] Zásady ochrany osobních údajů a cookies – právník
- [ ] Doména, hosting, firemní e-mail
- [ ] Fotografie podle seznamu výše
