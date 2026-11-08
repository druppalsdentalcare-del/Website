/**
 * Static site generator — no dependencies.
 *   node src/build.js      → writes the complete website to /docs
 */
const fs = require("fs");
const path = require("path");
const C = require("./config");
const T = require("./treatments");
const FAQS = require("./faqs");
const art = require("./illustrations");

const OUT = path.join(__dirname, "..", "docs");
const ASSETS = path.join(__dirname, "assets");
const YEAR = new Date().getFullYear();

/* ---------------------------------------------------------- helpers */
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = (p) => C.siteUrl + "/" + p.replace(/^\/+/, "");
const city = C.address.locality;
const addressLine = `${C.address.street}, ${C.address.locality}, ${C.address.region} ${C.address.postalCode}`;
const byCat = T.reduce((m, t) => ((m[t.category] = m[t.category] || []).push(t), m), {});
const CATS = Object.keys(byCat);
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const write = (rel, html) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

/* ---------------------------------------------------------- icons */
const ic = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>',
  whatsapp: '<path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21"/><path d="M9 10a.5.5 0 001 0V9a.5.5 0 00-1 0v1a5 5 0 005 5h1a.5.5 0 000-1h-1a.5.5 0 000 1"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0114 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 1.8L21.5 19.5l-1.8.7L19 22l-.7-1.8L16.5 19.5l1.8-.7z"/>',
  heart: '<path d="M12 20s-7-4.4-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.6-9 9-9 9z"/>',
  chip: '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/>',
  family: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21v-2a6 6 0 0112 0v2M14 21v-1.5a4 4 0 018 0V21"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  tooth: '<path d="M7 3c2 0 3 1 5 1s3-1 5-1c2.5 0 4 2 4 5 0 4-2 6-2.5 9-.4 2.4-1 4-2.3 4-2 0-1.4-6-4.2-6s-2.2 6-4.2 6C5.5 21 5 19.4 4.5 17 4 14 3 12 3 8c0-3 1.5-5 4-5z"/>',
};
const icon = (n, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[n]}</svg>`;

const logo = (rel) => `<a class="logo" href="${rel}" aria-label="${esc(C.name)} — home">
  <span class="logo-mark"><svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2dd4bf"/><stop offset="1" stop-color="#0e7490"/></linearGradient></defs><rect width="40" height="40" rx="12" fill="url(#lg)"/><path d="M13 10c2 0 4 1 7 1s5-1 7-1c3 0 5 2.4 5 6 0 4.6-2.3 7.4-2.9 11-.5 2.8-1.2 4.6-2.7 4.6-2.4 0-1.6-6.8-4.4-6.8s-2 6.8-4.4 6.8c-1.5 0-2.2-1.8-2.7-4.6C11.3 23.4 9 20.6 9 16c0-3.6 1.6-6 4-6z" fill="#fff"/></svg></span>
  <span class="logo-text"><strong>${esc(C.shortName)}</strong><em>Dental Care</em></span>
</a>`;

/* ---------------------------------------------------------- schema */
const clinicSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": url("#clinic"),
  name: C.name,
  slogan: C.tagline,
  url: url(""),
  logo: url("assets/favicon.svg"),
  image: url("assets/og-image.png"),
  telephone: C.phoneRaw,
  email: C.email,
  priceRange: C.priceRange,
  address: { "@type": "PostalAddress", streetAddress: C.address.street, addressLocality: C.address.locality, addressRegion: C.address.region, postalCode: C.address.postalCode, addressCountry: C.address.country },
  geo: { "@type": "GeoCoordinates", latitude: C.geo.lat, longitude: C.geo.lng },
  hasMap: C.mapLink,
  openingHoursSpecification: C.hours.filter((h) => h.schema.length).map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.schema, opens: h.open, closes: h.close })),
  sameAs: Object.values(C.social).filter(Boolean),
  medicalSpecialty: "Dentistry",
  isAcceptingNewPatients: true,
  founder: { "@id": url("about/#doctor") },
  employee: { "@id": url("about/#doctor") },
  availableService: T.map((t) => ({ "@type": "MedicalProcedure", name: t.name, url: url(`treatments/${t.slug}/`) })),
});
const doctorSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": url("about/#doctor"),
  name: C.doctor.name,
  jobTitle: C.doctor.title,
  honorificSuffix: C.doctor.qualifications,
  description: C.doctor.bio,
  worksFor: { "@id": url("#clinic") },
  url: url("about/"),
});
const crumbs = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: url(p) })),
});
const faqSchema = (list) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: list.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

/* ---------------------------------------------------------- layout */
function layout({ title, description, pathname, depth = 0, body, schema = [], bodyClass = "", ogType = "website" }) {
  const rel = depth ? "../".repeat(depth) : "./";
  const canonical = url(pathname);
  const nav = [
    ["Home", ""], ["About", "about/"], ["Treatments", "treatments/"], ["FAQs", "faq/"], ["Contact", "contact/"],
  ];
  const active = (p) => (p === pathname || (p && pathname.startsWith(p)) ? ' aria-current="page"' : "");
  const mega = CATS.map((c) => `<div class="mega-col"><h4>${esc(c)}</h4>${byCat[c].map((t) => `<a href="${rel}treatments/${t.slug}/">${esc(t.name)}</a>`).join("")}</div>`).join("");

  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="author" content="${esc(C.doctor.name)}">
<meta name="theme-color" content="#0b3a46">
<meta name="geo.region" content="IN">
<meta name="geo.placename" content="${esc(city)}">
<meta name="geo.position" content="${C.geo.lat};${C.geo.lng}">
<meta name="ICBM" content="${C.geo.lat}, ${C.geo.lng}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(C.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${url("assets/og-image.png")}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${url("assets/og-image.png")}">
<link rel="icon" href="${rel}assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${rel}assets/apple-touch-icon.png">
<link rel="manifest" href="${rel}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${rel}assets/styles.css">
${ld(clinicSchema())}
${schema.map(ld).join("\n")}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"></div>
<header class="site-header">
  <div class="topbar"><div class="wrap">
    <span>${icon("clock")} ${esc(C.hours[0].days)}: ${esc(C.hours[0].open)}–${esc(C.hours[0].close)}</span>
    <span class="hide-sm">${icon("pin")} ${esc(city)}</span>
    <a href="tel:${C.phoneRaw}">${icon("phone")} ${esc(C.phone)}</a>
  </div></div>
  <div class="wrap nav-row">
    ${logo(rel)}
    <nav class="main-nav" aria-label="Main">
      <ul>
        ${nav.map(([n, p]) => p === "treatments/"
          ? `<li class="has-mega"><a href="${rel}${p}"${active(p)}>${n} ${icon("chevron", "i chev")}</a><div class="mega"><div class="mega-inner">${mega}</div></div></li>`
          : `<li><a href="${rel}${p}"${active(p)}>${n}</a></li>`).join("")}
      </ul>
    </nav>
    <div class="nav-cta">
      <a class="btn btn-primary btn-sm" href="${rel}book-appointment/">${icon("calendar")} <span>Book Appointment</span></a>
      <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">${icon("menu")}</button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" hidden>
    <nav aria-label="Mobile">
      ${nav.map(([n, p], i) => `<a style="--i:${i}" href="${rel}${p}">${n}</a>`).join("")}
      <a style="--i:5" class="btn btn-primary" href="${rel}book-appointment/">${icon("calendar")} Book Appointment</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="footer-cta wrap" data-reveal>
    <div><h2>Ready for a healthier, brighter smile?</h2><p>Book your consultation in under a minute — we'll take care of the rest.</p></div>
    <div class="btn-group"><a class="btn btn-light" href="${rel}book-appointment/">${icon("calendar")} Book Appointment</a><a class="btn btn-ghost-light" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp us</a></div>
  </div>
  <div class="wrap footer-grid">
    <div>
      ${logo(rel)}
      <p class="muted">${esc(C.tagline)}. Comprehensive dental care in ${esc(city)} — from routine check-ups to implants, aligners and smile makeovers.</p>
      <div class="socials">${Object.entries(C.social).filter(([, v]) => v).map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener">${k}</a>`).join("")}</div>
    </div>
    <div><h3>Clinic</h3><ul>
      <li><a href="${rel}about/">About us</a></li><li><a href="${rel}treatments/">All treatments</a></li><li><a href="${rel}faq/">Patient FAQs</a></li><li><a href="${rel}contact/">Contact & directions</a></li><li><a href="${rel}book-appointment/">Book appointment</a></li></ul></div>
    <div><h3>Popular treatments</h3><ul>
      ${["root-canal-treatment", "dental-implants", "clear-aligners", "teeth-whitening", "dental-veneers", "braces"].map((s) => T.find((t) => t.slug === s)).map((t) => `<li><a href="${rel}treatments/${t.slug}/">${esc(t.name)}</a></li>`).join("")}</ul></div>
    <div><h3>Visit us</h3>
      <address>
        <p>${icon("pin")} <span>${esc(addressLine)}</span></p>
        <p>${icon("phone")} <a href="tel:${C.phoneRaw}">${esc(C.phone)}</a></p>
        <p>${icon("mail")} <a href="mailto:${C.email}">${esc(C.email)}</a></p>
        ${C.hours.map((h) => `<p>${icon("clock")} <span>${esc(h.days)}: ${esc(h.open)}${h.close ? "–" + esc(h.close) : ""}</span></p>`).join("")}
      </address>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${YEAR} ${esc(C.name)}. All rights reserved.</p>
    <p class="muted small">Information on this website is for general education and is not a substitute for a professional dental examination.</p>
  </div>
</footer>
<div class="mobile-bar" role="navigation" aria-label="Quick actions">
  <a href="tel:${C.phoneRaw}">${icon("phone")}<span>Call</span></a>
  <a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")}<span>WhatsApp</span></a>
  <a class="primary" href="${rel}book-appointment/">${icon("calendar")}<span>Book</span></a>
</div>
<a class="wa-float" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon("whatsapp")}</a>
<script src="${rel}assets/main.js" defer></script>
</body>
</html>`;
}

/* ---------------------------------------------------------- components */
const card = (t, rel, i = 0) => `<a class="t-card" href="${rel}treatments/${t.slug}/" data-reveal data-tilt style="--d:${(i % 4) * 80}ms" data-cat="${esc(t.category)}">
  <div class="t-art">${art(t.art, t.name + " illustration")}</div>
  <span class="tag">${esc(t.category)}</span>
  <h3>${esc(t.name)}</h3>
  <p>${esc(t.short)}</p>
  <span class="more">Learn more ${icon("arrow")}</span>
</a>`;

const faqList = (list, open = false) => list.map((f, i) => `<details class="faq"${open && i === 0 ? " open" : ""}>
  <summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary>
  <div class="faq-a"><p>${esc(f.a)}</p></div>
</details>`).join("");

const heading = (eyebrow, h, p, center = true) => `<div class="section-head${center ? " center" : ""}" data-reveal>
  <span class="eyebrow">${esc(eyebrow)}</span><h2>${h}</h2>${p ? `<p>${p}</p>` : ""}</div>`;

const ctaBand = (rel, h = "Not sure which treatment you need?", p = "Book a consultation — we'll examine, explain your options clearly and give you a written plan before any treatment begins.") =>
  `<section class="section"><div class="wrap"><div class="cta-band" data-reveal>
  <div class="cta-glow" aria-hidden="true"></div>
  <div><h2>${h}</h2><p>${p}</p></div>
  <div class="btn-group"><a class="btn btn-light" href="${rel}book-appointment/">${icon("calendar")} Book Appointment</a><a class="btn btn-ghost-light" href="tel:${C.phoneRaw}">${icon("phone")} ${esc(C.phone)}</a></div>
</div></div></section>`;

const features = [
  ["chip", "Advanced technology", "Digital X-rays, rotary endodontics, intra-oral scanning and 3D planning for precise, comfortable care."],
  ["shield", "Hospital-grade sterilisation", "Class-B autoclave sterilisation, sealed instrument pouches and single-use disposables for every patient."],
  ["heart", "Gentle, pain-free approach", "Effective anaesthesia, unhurried appointments and a team that genuinely cares about your comfort."],
  ["doc", "Transparent treatment plans", "Clear explanations, options and written cost estimates — no surprises, no pressure."],
  ["spark", "Complete care under one roof", "From check-ups to implants, aligners and smile makeovers — coordinated by one team."],
  ["family", "Family-friendly clinic", "Child-friendly, senior-friendly care in a calm, welcoming environment."],
];

/* ---------------------------------------------------------- pages */
function home() {
  const rel = "./";
  const featured = ["root-canal-treatment", "dental-implants", "clear-aligners", "teeth-whitening", "dental-crowns-and-bridges", "braces", "smile-makeover", "pediatric-dentistry"].map((s) => T.find((t) => t.slug === s));
  const topFaqs = [T[2].faqs[0], T[8].faqs[0], T[15].faqs[0], T[11].faqs[0], FAQS[1].items[0], T[3].faqs[0]];
  const body = `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span><span class="grid"></span></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <span class="eyebrow pill" data-reveal>${icon("spark")} Trusted dental clinic in ${esc(city)}</span>
      <h1 data-reveal style="--d:80ms">Healthy smiles, <span class="grad-text">crafted with care.</span></h1>
      <p class="lead" data-reveal style="--d:160ms">${esc(C.name)} offers gentle, modern dentistry for the whole family — from painless root canals and dental implants to clear aligners and smile makeovers. Clear advice, transparent plans and hospital-grade hygiene, every visit.</p>
      <div class="btn-group" data-reveal style="--d:240ms">
        <a class="btn btn-primary btn-lg" href="${rel}book-appointment/">${icon("calendar")} Book Appointment</a>
        <a class="btn btn-outline btn-lg" href="${rel}treatments/">Explore treatments ${icon("arrow")}</a>
      </div>
      <ul class="trust" data-reveal style="--d:320ms">
        <li>${icon("check")} Sterilised instruments</li><li>${icon("check")} Pain-free techniques</li><li>${icon("check")} Transparent pricing</li>
      </ul>
    </div>
    <div class="hero-visual" data-reveal style="--d:200ms">
      <div class="hero-art">${art("hero")}</div>
      <div class="float-card fc1">${icon("shield")}<div><strong>Painless RCT</strong><span>Often in a single sitting</span></div></div>
      <div class="float-card fc2">${icon("spark")}<div><strong>Dental implants</strong><span>Natural look &amp; feel</span></div></div>
      <div class="float-card fc3">${icon("clock")}<div><strong>Emergency care</strong><span>Same-day priority slots</span></div></div>
    </div>
  </div>
  <a class="scroll-cue" href="#marquee" aria-label="Scroll down"><span></span></a>
</section>

<div class="marquee" id="marquee" aria-hidden="true"><div class="marquee-track">${[...T, ...T].map((t) => `<span>${icon("tooth")} ${esc(t.name)}</span>`).join("")}</div></div>

<section class="section stats-section">
  <div class="wrap stats">
    ${C.stats.map((s, i) => `<div class="stat" data-reveal style="--d:${i * 90}ms"><strong><span data-count="${s.value}">0</span>${s.suffix}</strong><span>${esc(s.label)}</span></div>`).join("")}
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${heading("Treatments & procedures", "Everything your smile needs, <em>under one roof</em>", "Explore our most-requested treatments. Each page explains the procedure step by step, recovery, and answers the questions patients ask us most.")}
    <div class="t-grid">${featured.map((t, i) => card(t, rel, i)).join("")}</div>
    <div class="center mt-lg" data-reveal><a class="btn btn-outline" href="${rel}treatments/">View all ${T.length} treatments ${icon("arrow")}</a></div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    ${heading("Why patients choose us", "Dentistry that feels <em>different</em>", "")}
    <div class="feature-grid">
      ${features.map(([i, h, p], n) => `<div class="feature" data-reveal style="--d:${(n % 3) * 90}ms"><span class="f-icon">${icon(i)}</span><h3>${h}</h3><p>${p}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div class="doctor-card" data-reveal>
      <div class="doc-portrait"><span class="monogram">${esc(C.doctor.name.replace(/^Dr\.?\s*/, "").charAt(0))}</span><div class="ring"></div></div>
      <div class="doc-meta"><strong>${esc(C.doctor.name)}</strong><span>${esc(C.doctor.qualifications)}</span><span>${esc(C.doctor.title)}</span></div>
      <div class="exp-badge"><strong>${C.doctor.experienceYears}+</strong><span>years of<br>experience</span></div>
    </div>
    <div data-reveal style="--d:120ms">
      <span class="eyebrow">Meet your dentist</span>
      <h2>Care that starts with <em>listening</em></h2>
      <p>${esc(C.doctor.bio)}</p>
      <ul class="checks">
        <li>${icon("check")} Every option explained in plain language</li>
        <li>${icon("check")} Evidence-based, minimally invasive treatment</li>
        <li>${icon("check")} Continuing education in implants, endodontics &amp; aesthetics</li>
      </ul>
      <a class="btn btn-primary" href="${rel}about/">About our clinic ${icon("arrow")}</a>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap split reverse">
    <div data-reveal>
      <span class="eyebrow">See the difference</span>
      <h2>Professional whitening, <em>visibly brighter</em></h2>
      <p>Drag the slider to see how professional teeth whitening can lift years of stains from tea, coffee and everyday life — safely, under dental supervision. <small class="muted">(Illustration for demonstration; individual results vary.)</small></p>
      <a class="btn btn-outline" href="${rel}treatments/teeth-whitening/">About teeth whitening ${icon("arrow")}</a>
    </div>
    <div class="compare" data-reveal style="--d:120ms" data-compare>
      <div class="compare-layer before">${art("smile", "Smile before whitening")}<span class="c-label">Before</span></div>
      <div class="compare-layer after">${art("smile", "Smile after whitening")}<span class="c-label">After</span></div>
      <input type="range" min="0" max="100" value="50" aria-label="Before and after comparison slider">
      <div class="compare-handle" aria-hidden="true"><span></span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${heading("Your visit", "Your first visit, <em>step by step</em>", "No surprises — here's exactly what happens when you visit us.")}
    <ol class="journey">
      ${[["calendar", "Book in seconds", "Online, by phone or WhatsApp — pick a time that suits you."], ["search", "Thorough check-up", "Examination, digital X-rays if needed, and a chat about your goals."], ["doc", "Clear plan & costs", "Options explained with a written estimate. You decide, no pressure."], ["heart", "Comfortable treatment", "Gentle care, follow-up and tips to keep your smile healthy."]].map(([i, h, p], n) => `<li data-reveal style="--d:${n * 110}ms"><span class="j-num">0${n + 1}</span><span class="j-icon">${icon(i)}</span><h3>${h}</h3><p>${p}</p></li>`).join("")}
    </ol>
  </div>
</section>

<section class="section tint">
  <div class="wrap split faq-split">
    <div data-reveal>
      <span class="eyebrow">Questions, answered</span>
      <h2>What patients <em>ask us most</em></h2>
      <p>Honest, dentist-written answers to common questions. Can't find yours? Just ask us on WhatsApp.</p>
      <a class="btn btn-outline" href="${rel}faq/">Browse all FAQs ${icon("arrow")}</a>
    </div>
    <div class="faqs" data-reveal style="--d:120ms">${faqList(topFaqs, true)}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="reviews-band" data-reveal>
      <div class="stars" aria-hidden="true">${icon("star").repeat(5)}</div>
      <h2>Loved by patients across ${esc(city)}</h2>
      <p>Read what our patients say about their experience — or share your own.</p>
      <a class="btn btn-primary" href="${C.googleReviewsLink}" target="_blank" rel="noopener">Read our Google reviews ${icon("arrow")}</a>
    </div>
  </div>
</section>

${visitBlock(rel)}
`;
  return layout({
    title: `${C.name} | Best Dental Clinic in ${city} — Implants, RCT, Aligners`,
    description: `${C.name} in ${city}: gentle, modern dentistry — painless root canal, dental implants, clear aligners, braces, teeth whitening, veneers and kids' dentistry. Book your appointment online.`,
    pathname: "",
    depth: 0,
    body,
    bodyClass: "home",
    schema: [{ "@context": "https://schema.org", "@type": "WebSite", "@id": url("#website"), name: C.name, url: url(""), publisher: { "@id": url("#clinic") }, inLanguage: "en-IN" }, faqSchema(topFaqs)],
  });
}

function visitBlock(rel) {
  return `<section class="section tint" id="visit">
  <div class="wrap visit">
    <div class="visit-info" data-reveal>
      <span class="eyebrow">Visit us</span>
      <h2>Find the clinic</h2>
      <ul class="info-list">
        <li>${icon("pin")}<div><strong>Address</strong><span>${esc(addressLine)}</span><a href="${C.mapLink}" target="_blank" rel="noopener">Get directions →</a></div></li>
        <li>${icon("clock")}<div><strong>Opening hours</strong>${C.hours.map((h) => `<span>${esc(h.days)}: ${esc(h.open)}${h.close ? "–" + esc(h.close) : ""}</span>`).join("")}</div></li>
        <li>${icon("phone")}<div><strong>Call / WhatsApp</strong><a href="tel:${C.phoneRaw}">${esc(C.phone)}</a></div></li>
        <li>${icon("mail")}<div><strong>Email</strong><a href="mailto:${C.email}">${esc(C.email)}</a></div></li>
      </ul>
      <a class="btn btn-primary" href="${rel}book-appointment/">${icon("calendar")} Book Appointment</a>
    </div>
    <div class="map" data-reveal style="--d:120ms"><iframe title="Map showing ${esc(C.name)}" src="${C.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </div>
</section>`;
}

function about() {
  const rel = "../";
  const body = `
<section class="page-hero">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
  <div class="wrap">
    ${breadcrumbs(rel, [["Home", ""], ["About us", "about/"]])}
    <span class="eyebrow" data-reveal>About ${esc(C.name)}</span>
    <h1 data-reveal style="--d:80ms">A calmer, kinder <span class="grad-text">kind of dentistry</span></h1>
    <p class="lead" data-reveal style="--d:160ms">${esc(C.name)} is a modern dental clinic in ${esc(city)} offering complete family, cosmetic and restorative dentistry. We believe great dentistry is equal parts skill, technology and empathy.</p>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div class="doctor-card" data-reveal id="doctor">
      <div class="doc-portrait"><span class="monogram">${esc(C.doctor.name.replace(/^Dr\.?\s*/, "").charAt(0))}</span><div class="ring"></div></div>
      <div class="doc-meta"><strong>${esc(C.doctor.name)}</strong><span>${esc(C.doctor.qualifications)}</span><span>${esc(C.doctor.title)}</span></div>
      <div class="exp-badge"><strong>${C.doctor.experienceYears}+</strong><span>years of<br>experience</span></div>
    </div>
    <div data-reveal style="--d:120ms">
      <span class="eyebrow">Our founder</span>
      <h2>${esc(C.doctor.name)}, <em>${esc(C.doctor.qualifications)}</em></h2>
      <p>${esc(C.doctor.bio)}</p>
      <p class="muted">${esc(C.doctor.registration)}.</p>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    ${heading("Our promise", "What we <em>stand for</em>", "")}
    <div class="feature-grid">
      ${features.map(([i, h, p], n) => `<div class="feature" data-reveal style="--d:${(n % 3) * 90}ms"><span class="f-icon">${icon(i)}</span><h3>${h}</h3><p>${p}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div data-reveal>
      <span class="eyebrow">Infection control</span>
      <h2>Your safety is <em>non-negotiable</em></h2>
      <p>We follow a strict, documented sterilisation protocol for every single patient — the same standard we would expect for our own families.</p>
      <ol class="protocol">
        ${["Instruments are cleaned in an ultrasonic cleaner to remove debris.", "They are sealed in sterilisation pouches with colour-change indicators.", "Pouches are sterilised in a Class-B vacuum autoclave.", "Pouches are opened in front of you, at your appointment.", "Needles, gloves, masks, suction tips and bibs are single-use.", "Surfaces and the dental chair are disinfected between patients."].map((s, i) => `<li data-reveal style="--d:${i * 60}ms"><span>${i + 1}</span>${s}</li>`).join("")}
      </ol>
    </div>
    <div class="art-panel" data-reveal style="--d:120ms">${art("checkup", "Thorough dental examination illustration")}</div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    ${heading("Technology", "Modern tools for <em>gentler, more precise</em> care", "")}
    <div class="tech-grid">
      ${[["Digital radiography", "Instant, low-radiation X-rays you can see on screen."], ["Intra-oral camera", "See exactly what we see, tooth by tooth."], ["Rotary endodontics & apex locator", "Faster, more precise and comfortable root canals."], ["3D implant planning", "CBCT-guided planning for safe, accurate implant placement."], ["Digital Smile Design", "Preview your new smile before treatment begins."], ["Ultrasonic scaling", "Gentle, efficient cleaning that protects enamel."]].map(([h, p], i) => `<div class="tech" data-reveal style="--d:${(i % 3) * 80}ms"><span class="dot"></span><h3>${h}</h3><p>${p}</p></div>`).join("")}
    </div>
    <p class="center small muted mt">Technology available may vary by treatment — ask us about your specific case.</p>
  </div>
</section>
${ctaBand(rel, "Come and meet us", "The best way to know us is to visit. Book a consultation and see the difference for yourself.")}
`;
  return layout({
    title: `About Us — ${C.doctor.name} & Team | ${C.name}, ${city}`,
    description: `Meet ${C.doctor.name} (${C.doctor.qualifications}) and the team at ${C.name}, ${city}. Learn about our values, sterilisation protocol and dental technology.`,
    pathname: "about/",
    depth: 1,
    body,
    schema: [doctorSchema(), crumbs([["Home", ""], ["About us", "about/"]]), { "@context": "https://schema.org", "@type": "AboutPage", name: `About ${C.name}`, url: url("about/"), about: { "@id": url("#clinic") } }],
  });
}

function breadcrumbs(rel, items) {
  return `<nav class="crumbs" aria-label="Breadcrumb" data-reveal><ol>${items.map(([n, p], i) => (i === items.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${rel}${p}">${esc(n)}</a></li>`)).join("")}</ol></nav>`;
}

function treatmentsHub() {
  const rel = "../";
  const body = `
<section class="page-hero">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
  <div class="wrap">
    ${breadcrumbs(rel, [["Home", ""], ["Treatments", "treatments/"]])}
    <span class="eyebrow" data-reveal>Treatments &amp; procedures</span>
    <h1 data-reveal style="--d:80ms">Complete dental care, <span class="grad-text">explained simply</span></h1>
    <p class="lead" data-reveal style="--d:160ms">${T.length} treatments across general, cosmetic, restorative, surgical and orthodontic dentistry. Choose a treatment to see how it works, recovery time and answers to common questions.</p>
  </div>
</section>
<section class="section pt-0">
  <div class="wrap">
    <div class="chips" role="toolbar" aria-label="Filter treatments" data-reveal>
      <button class="chip active" data-filter="all">All</button>
      ${CATS.map((c) => `<button class="chip" data-filter="${esc(c)}">${esc(c)}</button>`).join("")}
    </div>
    <div class="t-grid" id="t-grid">${T.map((t, i) => card(t, rel, i)).join("")}</div>
  </div>
</section>
${ctaBand(rel)}`;
  return layout({
    title: `Dental Treatments & Procedures in ${city} | ${C.name}`,
    description: `All dental treatments at ${C.name}, ${city}: check-ups, fillings, root canal, extractions, gum treatment, crowns, implants, dentures, whitening, veneers, smile makeover, braces and clear aligners.`,
    pathname: "treatments/",
    depth: 1,
    body,
    schema: [crumbs([["Home", ""], ["Treatments", "treatments/"]]), { "@context": "https://schema.org", "@type": "ItemList", name: "Dental treatments", itemListElement: T.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: url(`treatments/${t.slug}/`) })) }],
  });
}

function treatmentPage(t, idx) {
  const rel = "../../";
  const p = `treatments/${t.slug}/`;
  const related = [...T.filter((x) => x.category === t.category && x.slug !== t.slug), ...T.filter((x) => x.category !== t.category)].slice(0, 3);
  const toc = [["overview", "Overview"], ["signs", "Do you need it?"], ["procedure", "The procedure"], ["benefits", "Benefits"], ["aftercare", "Aftercare"], ["faqs", "FAQs"]];
  const body = `
<section class="page-hero t-hero">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
  <div class="wrap t-hero-grid">
    <div>
      ${breadcrumbs(rel, [["Home", ""], ["Treatments", "treatments/"], [t.name, p]])}
      <span class="eyebrow" data-reveal>${esc(t.category)}</span>
      <h1 data-reveal style="--d:80ms">${esc(t.name)}${city !== "Your City" ? ` <span class="grad-text">in ${esc(city)}</span>` : ""}</h1>
      <p class="lead answer" data-reveal style="--d:160ms">${esc(t.summary)}</p>
      <div class="btn-group" data-reveal style="--d:240ms">
        <a class="btn btn-primary btn-lg" href="${rel}book-appointment/?treatment=${t.slug}">${icon("calendar")} Book this treatment</a>
        <a class="btn btn-outline btn-lg" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent(`Hi, I'd like to know more about ${t.name}.`)}" target="_blank" rel="noopener">${icon("whatsapp")} Ask a question</a>
      </div>
    </div>
    <div class="t-hero-art" data-reveal style="--d:200ms">${art(t.art, t.name + " illustration")}</div>
  </div>
  <div class="wrap">
    <dl class="facts" data-reveal style="--d:280ms">${Object.entries(t.facts).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
  </div>
</section>

<section class="section pt-0">
  <div class="wrap t-layout">
    <aside class="toc" aria-label="On this page">
      <p>On this page</p>
      <ul>${toc.map(([id, n]) => `<li><a href="#${id}">${n}</a></li>`).join("")}</ul>
      <a class="btn btn-primary btn-sm btn-block" href="${rel}book-appointment/?treatment=${t.slug}">Book appointment</a>
    </aside>
    <article class="t-article">
      <p class="reviewed">${icon("shield")} Medically reviewed by <a href="${rel}about/#doctor">${esc(C.doctor.name)}, ${esc(C.doctor.qualifications)}</a> · Updated <time datetime="${C.lastUpdated}">${new Date(C.lastUpdated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time></p>

      <section id="overview" data-reveal><h2>What is ${esc(t.name.replace(/\s*\(.*\)/, ""))}?</h2>${t.intro.map((x) => `<p>${esc(x)}</p>`).join("")}</section>

      <section id="signs" data-reveal><h2>Signs you may need it</h2>
        <ul class="sign-list">${t.signs.map((s) => `<li>${icon("check")} ${esc(s)}</li>`).join("")}</ul>
      </section>

      <section id="procedure"><h2 data-reveal>The procedure, step by step</h2>
        <ol class="steps">${t.steps.map((s, i) => `<li data-reveal style="--d:${i * 70}ms"><span class="s-num">${i + 1}</span><div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></li>`).join("")}</ol>
      </section>

      <section id="benefits" data-reveal><h2>Benefits</h2>
        <div class="benefits">${t.benefits.map((b) => `<div>${icon("spark")}<span>${esc(b)}</span></div>`).join("")}</div>
      </section>

      <section id="aftercare" data-reveal><h2>Recovery &amp; aftercare</h2>
        <ul class="sign-list care">${t.aftercare.map((s) => `<li>${icon("heart")} ${esc(s)}</li>`).join("")}</ul>
      </section>

      <section id="faqs"><h2 data-reveal>${esc(t.name.replace(/\s*\(.*\)/, ""))}: frequently asked questions</h2>
        <div class="faqs" data-reveal>${faqList(t.faqs, true)}</div>
      </section>

      <div class="cost-note" data-reveal>${icon("doc")}<div><h3>How much does it cost?</h3><p>The cost of ${esc(t.name.toLowerCase())} depends on your diagnosis, the number of teeth involved and the materials chosen. After your examination you'll receive a clear, written estimate before treatment starts. <a href="${rel}book-appointment/?treatment=${t.slug}">Book a consultation</a> to get your personalised plan.</p></div></div>
    </article>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    ${heading("Related treatments", "You may also <em>want to know</em>", "")}
    <div class="t-grid three">${related.map((r, i) => card(r, rel, i)).join("")}</div>
  </div>
</section>
${ctaBand(rel, `Considering ${esc(t.name.replace(/\s*\(.*\)/, "").toLowerCase())}?`, "Book a consultation and we'll check whether it's right for you, explain every option and give you a written estimate.")}`;

  return layout({
    title: `${t.name} in ${city} — Procedure, Recovery & FAQs | ${C.shortName}`,
    description: `${t.summary.split(". ")[0]}. Learn the procedure, recovery, benefits and FAQs, and book at ${C.name}, ${city}.`.slice(0, 300),
    pathname: p,
    depth: 2,
    body,
    bodyClass: "treatment",
    ogType: "article",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: `${t.name} — ${C.name}`,
        url: url(p),
        description: t.summary,
        inLanguage: "en-IN",
        lastReviewed: C.lastUpdated,
        reviewedBy: { "@id": url("about/#doctor") },
        publisher: { "@id": url("#clinic") },
        audience: { "@type": "PeopleAudience", audienceType: "Patient" },
        about: {
          "@type": "MedicalProcedure",
          name: t.name,
          description: t.summary,
          procedureType: t.category === "Cosmetic Dentistry" ? "https://schema.org/NoninvasiveProcedure" : undefined,
          howPerformed: t.steps.map((s) => `${s.t}: ${s.d}`).join(" "),
          followup: t.aftercare.join(" "),
          relevantSpecialty: "Dentistry",
        },
      },
      { ...doctorSchema() },
      faqSchema(t.faqs),
      crumbs([["Home", ""], ["Treatments", "treatments/"], [t.name, p]]),
    ],
  });
}

function faqPage() {
  const rel = "../";
  const groups = [...FAQS, ...T.map((t) => ({ group: t.name, slug: t.slug, items: t.faqs }))];
  const all = groups.flatMap((g) => g.items);
  const body = `
<section class="page-hero">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
  <div class="wrap narrow center">
    ${breadcrumbs(rel, [["Home", ""], ["FAQs", "faq/"]])}
    <span class="eyebrow" data-reveal>Patient FAQs</span>
    <h1 data-reveal style="--d:80ms">Your dental questions, <span class="grad-text">answered</span></h1>
    <p class="lead" data-reveal style="--d:160ms">${all.length} answers to the questions patients ask us most — about procedures, pain, recovery, costs and everyday care.</p>
    <label class="search" data-reveal style="--d:240ms">${icon("search")}<input type="search" id="faq-search" placeholder="Search e.g. “implant pain”, “wisdom tooth”, “whitening”" aria-label="Search FAQs"></label>
  </div>
</section>
<section class="section pt-0">
  <div class="wrap faq-layout">
    <aside class="toc faq-toc" aria-label="FAQ topics"><p>Topics</p><ul>${groups.map((g, i) => `<li><a href="#g${i}">${esc(g.group)}</a></li>`).join("")}</ul></aside>
    <div>
      ${groups.map((g, i) => `<section class="faq-group" id="g${i}" data-reveal><h2>${esc(g.group)}${g.slug ? ` <a class="small-link" href="${rel}treatments/${g.slug}/">Treatment guide →</a>` : ""}</h2><div class="faqs">${faqList(g.items)}</div></section>`).join("")}
      <p class="no-results" hidden>No matching questions. <a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">Ask us on WhatsApp</a> — we're happy to help.</p>
    </div>
  </div>
</section>
${ctaBand(rel, "Still have a question?", "Message us on WhatsApp or book a consultation — we'll answer honestly, with no obligation.")}`;
  return layout({
    title: `Dental FAQs — Root Canal, Implants, Braces, Whitening & More | ${C.shortName}`,
    description: `Answers to ${all.length} common dental questions: is root canal painful, how long implants last, braces vs aligners, wisdom teeth, whitening safety, costs and aftercare — from ${C.name}.`,
    pathname: "faq/",
    depth: 1,
    body,
    schema: [faqSchema(all), crumbs([["Home", ""], ["FAQs", "faq/"]])],
  });
}

function bookPage() {
  const rel = "../";
  const body = `
<section class="page-hero">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
  <div class="wrap">
    ${breadcrumbs(rel, [["Home", ""], ["Book appointment", "book-appointment/"]])}
    <span class="eyebrow" data-reveal>Book an appointment</span>
    <h1 data-reveal style="--d:80ms">Book your visit <span class="grad-text">in 60 seconds</span></h1>
    <p class="lead" data-reveal style="--d:160ms">Fill in the form and send it to us on WhatsApp or by email. Our team will confirm your appointment time.</p>
  </div>
</section>
<section class="section pt-0">
  <div class="wrap book-grid">
    <form class="book-form" id="book-form" novalidate data-reveal data-wa="${C.whatsapp}" data-email="${C.email}" data-clinic="${esc(C.name)}">
      <div class="field"><label for="f-name">Full name *</label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-phone">Mobile number *</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" pattern="[0-9+ \\-]{8,15}" required></div>
      <div class="field"><label for="f-email">Email (optional)</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
      <div class="field"><label for="f-treatment">Treatment</label>
        <select id="f-treatment" name="treatment"><option value="">Not sure — general consultation</option>${CATS.map((c) => `<optgroup label="${esc(c)}">${byCat[c].map((t) => `<option value="${t.slug}">${esc(t.name)}</option>`).join("")}</optgroup>`).join("")}</select></div>
      <div class="field"><label for="f-date">Preferred date *</label><input id="f-date" name="date" type="date" required></div>
      <div class="field"><label for="f-time">Preferred time</label>
        <select id="f-time" name="time"><option>Morning (10am – 1pm)</option><option>Afternoon (1pm – 5pm)</option><option>Evening (5pm – 8pm)</option></select></div>
      <div class="field full"><label for="f-msg">Anything we should know?</label><textarea id="f-msg" name="message" rows="4" placeholder="Describe your concern, pain, or questions (optional)"></textarea></div>
      <label class="consent full"><input type="checkbox" name="consent" required> I agree to be contacted about my appointment.</label>
      <div class="full btn-group">
        <button class="btn btn-primary btn-lg" type="submit" data-via="whatsapp">${icon("whatsapp")} Send via WhatsApp</button>
        <button class="btn btn-outline btn-lg" type="submit" data-via="email">${icon("mail")} Send via email</button>
      </div>
      <p class="form-status full" role="status" aria-live="polite"></p>
    </form>
    <aside class="book-side" data-reveal style="--d:120ms">
      <div class="side-card highlight"><h2>Prefer to talk?</h2><p>Call us and our front desk will find the best slot for you.</p><a class="btn btn-light btn-block" href="tel:${C.phoneRaw}">${icon("phone")} ${esc(C.phone)}</a></div>
      <div class="side-card"><h3>${icon("clock")} Opening hours</h3>${C.hours.map((h) => `<p><strong>${esc(h.days)}</strong><br>${esc(h.open)}${h.close ? "–" + esc(h.close) : ""}</p>`).join("")}</div>
      <div class="side-card"><h3>${icon("shield")} Dental emergency?</h3><p>Severe pain, swelling or a broken tooth? Call or WhatsApp us now for a priority slot.</p></div>
    </aside>
  </div>
</section>`;
  return layout({
    title: `Book a Dental Appointment in ${city} | ${C.name}`,
    description: `Book your dental appointment at ${C.name}, ${city} online in 60 seconds — via WhatsApp, email or phone. Same-day emergency slots available.`,
    pathname: "book-appointment/",
    depth: 1,
    body,
    bodyClass: "book",
    schema: [crumbs([["Home", ""], ["Book appointment", "book-appointment/"]])],
  });
}

function contactPage() {
  const rel = "../";
  const body = `
<section class="page-hero">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
  <div class="wrap">
    ${breadcrumbs(rel, [["Home", ""], ["Contact", "contact/"]])}
    <span class="eyebrow" data-reveal>Contact</span>
    <h1 data-reveal style="--d:80ms">We'd love to <span class="grad-text">hear from you</span></h1>
    <p class="lead" data-reveal style="--d:160ms">Questions, appointments or emergencies — reach us however suits you best.</p>
  </div>
</section>
<section class="section pt-0">
  <div class="wrap contact-cards">
    <a class="c-card" href="tel:${C.phoneRaw}" data-reveal>${icon("phone")}<h2>Call us</h2><p>${esc(C.phone)}</p></a>
    <a class="c-card" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener" data-reveal style="--d:90ms">${icon("whatsapp")}<h2>WhatsApp</h2><p>Chat with our team</p></a>
    <a class="c-card" href="mailto:${C.email}" data-reveal style="--d:180ms">${icon("mail")}<h2>Email</h2><p>${esc(C.email)}</p></a>
    <a class="c-card" href="${C.mapLink}" target="_blank" rel="noopener" data-reveal style="--d:270ms">${icon("pin")}<h2>Directions</h2><p>${esc(city)}</p></a>
  </div>
</section>
${visitBlock(rel)}`;
  return layout({
    title: `Contact & Directions | ${C.name}, ${city}`,
    description: `Contact ${C.name} in ${city}. Address, phone, WhatsApp, email, opening hours and directions to the clinic.`,
    pathname: "contact/",
    depth: 1,
    body,
    schema: [crumbs([["Home", ""], ["Contact", "contact/"]]), { "@context": "https://schema.org", "@type": "ContactPage", url: url("contact/"), about: { "@id": url("#clinic") } }],
  });
}

function notFound() {
  return layout({
    title: `Page not found | ${C.name}`,
    description: "The page you were looking for could not be found.",
    pathname: "404.html",
    depth: 0,
    body: `<section class="page-hero center"><div class="wrap narrow"><div class="nf-art">${art("extraction", "Tooth lifting away")}</div><h1>Oops — this page <span class="grad-text">went missing</span></h1><p class="lead">Like a lost tooth, it's gone — but we can help you find what you need.</p><div class="btn-group center-row"><a class="btn btn-primary" href="${url("")}">Go home</a><a class="btn btn-outline" href="${url("treatments/")}">See treatments</a></div></div></section>`,
  }).replace('content="index, follow, max-image-preview:large, max-snippet:-1"', 'content="noindex"');
}

/* ---------------------------------------------------------- SEO / GEO files */
function sitemap() {
  const pages = ["", "about/", "treatments/", ...T.map((t) => `treatments/${t.slug}/`), "faq/", "book-appointment/", "contact/"];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${url(p)}</loc><lastmod>${C.lastUpdated}</lastmod><changefreq>${p === "" ? "weekly" : "monthly"}</changefreq><priority>${p === "" ? "1.0" : p.startsWith("treatments/") ? "0.9" : "0.7"}</priority></url>`).join("\n")}
</urlset>`;
}

const robots = () => `# Welcome, search engines and AI assistants.
User-agent: *
Allow: /

# AI / answer-engine crawlers are explicitly welcome (GEO)
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: ${url("sitemap.xml")}
`;

function llms() {
  return `# ${C.name}

> ${C.name} is a dental clinic in ${city}, ${C.address.region}, India, led by ${C.doctor.name} (${C.doctor.qualifications}). It provides general, cosmetic, restorative, surgical, pediatric and orthodontic dentistry.

- Address: ${addressLine}
- Phone / WhatsApp: ${C.phone}
- Email: ${C.email}
- Hours: ${C.hours.map((h) => `${h.days} ${h.open}${h.close ? "–" + h.close : ""}`).join("; ")}
- Book an appointment: ${url("book-appointment/")}

## Treatments
${T.map((t) => `- [${t.name}](${url(`treatments/${t.slug}/`)}): ${t.summary}`).join("\n")}

## Key pages
- [About the clinic and ${C.doctor.name}](${url("about/")})
- [Patient FAQs](${url("faq/")})
- [Contact & directions](${url("contact/")})

## Frequently asked questions
${[...FAQS.flatMap((g) => g.items), ...T.flatMap((t) => t.faqs.slice(0, 2))].map((f) => `### ${f.q}\n${f.a}\n`).join("\n")}`;
}

const manifest = () => JSON.stringify({ name: C.name, short_name: C.shortName, start_url: "./", display: "standalone", background_color: "#fbfaf7", theme_color: "#0b3a46", icons: [{ src: "assets/favicon.svg", sizes: "any", type: "image/svg+xml" }, { src: "assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] }, null, 2);

/* ---------------------------------------------------------- build */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });
for (const f of fs.readdirSync(ASSETS)) fs.copyFileSync(path.join(ASSETS, f), path.join(OUT, "assets", f));

write("index.html", home());
write("about/index.html", about());
write("treatments/index.html", treatmentsHub());
T.forEach((t, i) => write(`treatments/${t.slug}/index.html`, treatmentPage(t, i)));
write("faq/index.html", faqPage());
write("book-appointment/index.html", bookPage());
write("contact/index.html", contactPage());
write("404.html", notFound());
write("sitemap.xml", sitemap());
write("robots.txt", robots());
write("llms.txt", llms());
write("site.webmanifest", manifest());
write(".nojekyll", "");

console.log(`✓ Built ${T.length + 7} pages into /docs`);
