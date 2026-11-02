#!/usr/bin/env node
/* ==========================================================================
   SEO: z content/site.js vygeneruje metadata, strukturovaná data, statický text
   pro vyhledávače v index.html a soubor sitemap.xml. Web se vykresluje skriptem,
   tohle zajistí, že robot uvidí obsah i bez spuštění JavaScriptu.

   Spustit po každé změně textů nebo kontaktů:   node tools/seo-static.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
global.window = {};
require(path.join(root, 'content/site.js'));
const S = window.SITE;

const BASE = S.seo.url.endsWith('/') ? S.seo.url : `${S.seo.url}/`;
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const plain = (v) => String(v || '').replace(/\*/g, '');          // bez hvězdiček pro kurzívu
const isPh = (v) => /\[[^\]]*\]/.test(String(v || ''));           // obsahuje zástupný údaj
const txt = (v) => esc(plain(v));

/* ---------- Podstránky: titulek a popis ---------- */
// Adresy na webu jsou bez .html, viz .htaccess
const cleanPath = (file) => file.replace(/\.html$/, '');

const PAGES = {
  'recenze.html': { title: 'Petra Kilianová – recenze', description: 'Zkušenosti klientů s hypoteční poradkyní Petrou Kilianovou. Přečtěte si, jak probíhalo vyřízení hypotéky a refinancování očima lidí, kteří jím prošli.', sitemap: true },
  'slovnicek.html': { title: 'Petra Kilianová – slovníček', description: 'Co znamená fixace, LTV, RPSN, čerpání nebo zástava? Nejčastější pojmy kolem hypoték vysvětlené srozumitelně a na jednom místě.', sitemap: true },
  'certifikace.html': { title: 'Petra Kilianová – certifikace', description: 'Osvědčení o odborné zkoušce, certifikáty a ocenění hypoteční poradkyně Petry Kilianové na jednom místě.', sitemap: true },
  'ochrana-osobnich-udaju.html': { title: 'Petra Kilianová – ochrana osobních údajů', description: 'Informace o zpracování osobních údajů a používání cookies na webu hypoteční poradkyně Petry Kilianové.', sitemap: true },
  'reklamacni-rad.html': { title: 'Petra Kilianová – reklamační řád', description: 'Reklamační řád společnosti GEPARD FINANCE a.s.: jak podat reklamaci nebo stížnost a jak se vyřizují.', sitemap: true },
  'blog.html': { title: 'Petra Kilianová – blog', description: 'Tipy, vysvětlení a odpovědi na časté otázky kolem hypoték a financování bydlení.' },
};

/* ---------- Strukturovaná data ---------- */
function jsonLd() {
  const o = (S.offices || [])[0] || {};
  const [postalCode, ...locality] = String(o.city || '').match(/^(\d{3}\s?\d{2})\s+(.+)$/)?.slice(1) || [];
  const sameAs = S.social.map((s) => s.url).filter(Boolean);
  const faq = S.faq.items.filter((it) => !isPh(it.a)).map((it) => ({
    '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a },
  }));
  const graph = [
    {
      '@type': 'FinancialService',
      '@id': `${BASE}#poradkyne`,
      name: `${S.brand.name} – ${S.brand.role.toLowerCase()}`,
      description: S.seo.description,
      url: BASE,
      telephone: S.contact.phoneHref || undefined,
      email: S.contact.emailHref || undefined,
      brand: { '@type': 'Brand', name: 'Gepard Finance' },
      areaServed: { '@type': 'Country', name: 'Česko' },
      address: { '@type': 'PostalAddress', streetAddress: o.street, postalCode, addressLocality: locality[0], addressCountry: 'CZ' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Služby',
        itemListElement: S.services.items.map((it) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: it.title, description: it.text } })),
      },
      sameAs: sameAs.length ? sameAs : undefined,
    },
    { '@type': 'Person', name: S.brand.name, jobTitle: S.brand.role, worksFor: { '@id': `${BASE}#poradkyne` } },
  ];
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2).replace(/</g, '\\u003c');
}

/* ---------- Hlavička úvodní stránky ---------- */
function homeHead() {
  const title = esc(S.seo.title);
  const desc = esc(S.seo.description);
  return `<title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${esc(BASE)}">

  <!-- Sdílení na sociálních sítích -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="cs_CZ">
  <meta property="og:url" content="${esc(BASE)}">
  <meta property="og:site_name" content="${esc(S.brand.name)}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta name="twitter:card" content="summary">

  <script type="application/ld+json">
${jsonLd()}
  </script>`;
}

/* ---------- Statický obsah pro roboty (skript ho po načtení nahradí) ---------- */
function staticMain() {
  const o = (S.offices || [])[0] || {};
  const parts = [
    `<h1>${txt(S.hero.title)}</h1>`,
    `<p>${txt(S.hero.text)}</p>`,
    `<h2>${txt(S.services.title)}</h2>`,
    `<p>${txt(S.services.intro)}</p>`,
    ...S.services.items.map((it) => `<h3>${txt(it.title)}</h3>\n<p>${txt(it.text)}</p>`),
    `<h2>${txt(S.why.title)}</h2>`,
    `<p>${txt(S.why.intro)}</p>`,
    `<h2>${txt(S.about.title)}</h2>`,
    `<p>${txt(S.about.lead)}</p>`,
    ...S.about.paragraphs.map((p) => `<p>${txt(p)}</p>`),
    `<h2>${txt(S.process.title)}</h2>`,
    `<ol>${S.process.steps.map((s) => `<li>${txt(s.title)}</li>`).join('')}</ol>`,
    `<h2>${txt(S.faq.title)}</h2>`,
    ...S.faq.items.filter((it) => !isPh(it.a)).map((it) => `<h3>${txt(it.q)}</h3>\n<p>${txt(it.a)}</p>`),
    `<h2>${txt(S.contactSection.title)}</h2>`,
    `<p>${txt(o.name)}, ${txt(o.street)}, ${txt(o.city)}. Telefon: <a href="tel:${esc(S.contact.phoneHref)}">${esc(S.contact.phone)}</a>, e-mail: <a href="mailto:${esc(S.contact.emailHref)}">${esc(S.contact.email)}</a>.</p>`,
    '<p><a href="recenze">Recenze klientů</a> · <a href="slovnicek">Slovníček hypotečních pojmů</a></p>',
  ];
  return `<div class="seo-static">\n${parts.join('\n')}\n</div>`;
}

const between = (html, name, content) => {
  const re = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
  if (!re.test(html)) throw new Error(`V index.html chybí značky ${name}`);
  return html.replace(re, () => `<!-- ${name}:start -->\n  ${content}\n  <!-- ${name}:end -->`);
};

/* ---------- Zápis ---------- */
const indexPath = path.join(root, 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
index = between(index, 'seo-head', homeHead());
index = between(index, 'seo-main', staticMain());
fs.writeFileSync(indexPath, index);

Object.entries(PAGES).forEach(([file, p]) => {
  const fp = path.join(root, file);
  let html = fs.readFileSync(fp, 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">(\n\s*<link rel="canonical"[^>]*>)?/, `<meta name="description" content="${esc(p.description)}">\n  <link rel="canonical" href="${esc(BASE + cleanPath(file))}">`);
  fs.writeFileSync(fp, html);
});

const urls = [BASE, ...Object.entries(PAGES).filter(([, p]) => p.sitemap).map(([f]) => BASE + cleanPath(f))];
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join('\n')}
</urlset>
`);
console.log(`Hotovo: index.html, ${Object.keys(PAGES).length} podstránky, sitemap.xml (${urls.length} adres).`);
