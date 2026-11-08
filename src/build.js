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
const room = art.room;

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
const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(C.mapQuery)}&output=embed`;
const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.mapQuery)}`;
const wa = (text) => `https://wa.me/${C.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
const plain = (n) => n.replace(/\s*\(.*\)/, "");
const BOOK = "book-consultation/";

const write = (rel, html) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

/* clinic photos: use a real file from src/assets/clinic/ if it exists, else an illustrated placeholder */
const CLINIC_DIR = path.join(ASSETS, "clinic");
const photo = (g, rel, eager = false) => {
  const base = g.file.replace(/\.(jpe?g|png|webp)$/i, "");
  const found = fs.existsSync(CLINIC_DIR) && fs.readdirSync(CLINIC_DIR).find((f) => f.replace(/\.(jpe?g|png|webp)$/i, "") === base);
  return found
    ? `<img src="${rel}assets/clinic/${found}" alt="${esc(g.caption)} at ${esc(C.name)}, ${esc(city)}" loading="${eager ? "eager" : "lazy"}" decoding="async">`
    : `<div class="ph">${room(g.art, `${g.caption} at ${C.name}`)}</div>`;
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
  scan: '<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3"/><path d="M7 12h10"/>',
  route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H16a3.5 3.5 0 000-7H8a3.5 3.5 0 010-7h7.5"/>',
  crown: '<path d="M4 18h16l1-10-5 4-4-7-4 7-5-4z"/><path d="M4 21h16"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 014-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 01-4 4H3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  tooth: '<path d="M7 3c2 0 3 1 5 1s3-1 5-1c2.5 0 4 2 4 5 0 4-2 6-2.5 9-.4 2.4-1 4-2.3 4-2 0-1.4-6-4.2-6s-2.2 6-4.2 6C5.5 21 5 19.4 4.5 17 4 14 3 12 3 8c0-3 1.5-5 4-5z"/>',
  family: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21v-2a6 6 0 0112 0v2M14 21v-1.5a4 4 0 018 0V21"/>',
};
const icon = (n, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[n]}</svg>`;

/* Brand wordmark: DR. (dark gold) · UPPAL'S (burgundy Playfair) · DENTAL · IMPLANT · SMILE */
const logo = (rel, cls = "") => `<a class="logo ${cls}" href="${rel}" aria-label="${esc(C.name)} — home">
  <span class="logo-diamond" aria-hidden="true"></span>
  <span class="logo-text">
    <span class="logo-name"><small>Dr.</small> Uppal’s</span>
    <span class="logo-tag">Dental<i>·</i>Implant<i>·</i>Smile</span>
  </span>
</a>`;

/* ---------------------------------------------------------- schema */
const clinicSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": url("#clinic"),
  name: C.name,
  alternateName: "Dr. Uppal's Dental",
  slogan: C.tagline,
  url: url(""),
  logo: url("assets/favicon.svg"),
  image: url("assets/og-image.png"),
  telephone: C.phoneRaw,
  email: C.email,
  priceRange: C.priceRange,
  address: { "@type": "PostalAddress", streetAddress: C.address.street, addressLocality: C.address.locality, addressRegion: C.address.region, postalCode: C.address.postalCode, addressCountry: C.address.country },
  geo: { "@type": "GeoCoordinates", latitude: C.geo.lat, longitude: C.geo.lng },
  hasMap: mapLink,
  areaServed: C.areasServed.map((a) => ({ "@type": "City", name: a })),
  openingHoursSpecification: C.hours.filter((h) => h.schema.length).map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.schema, opens: h.open, closes: h.close })),
  sameAs: Object.values(C.social).filter(Boolean),
  medicalSpecialty: "Dentistry",
  isAcceptingNewPatients: true,
  founder: { "@id": url("about/#doctor") },
  availableService: T.map((t) => ({ "@type": "MedicalProcedure", name: t.name, url: url(`treatments/${t.slug}/`) })),
});
const doctorSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": url("about/#doctor"),
  name: C.doctor.name,
  jobTitle: C.doctor.title,
  honorificSuffix: C.doctor.qualifications,
  description: C.doctor.bio.join(" "),
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
const NAV = [["About", "about/"], ["Treatments", "treatments/"], ["Patient guide", "patient-guide/"], ["FAQs", "faq/"], ["Gallery", "gallery/"], ["Contact us", "contact/"]];
const hoursText = (h) => h.label;

function layout({ title, description, pathname, depth = 0, body, schema = [], bodyClass = "", ogType = "website" }) {
  const rel = depth ? "../".repeat(depth) : "./";
  const canonical = url(pathname);
  const active = (p) => (p && pathname.startsWith(p) ? ' aria-current="page"' : "");
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
<meta name="theme-color" content="#6B1022">
<meta name="geo.region" content="IN-DL">
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap">
<link rel="stylesheet" href="${rel}assets/styles.css">
${ld(clinicSchema())}
${schema.map(ld).join("\n")}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"></div>
<header class="site-header">
  <div class="wrap nav-row">
    ${logo(rel)}
    <nav class="main-nav" aria-label="Main">
      <ul>
        ${NAV.map(([n, p]) => p === "treatments/"
          ? `<li class="has-mega"><a class="nav-btn" href="${rel}${p}"${active(p)}>${n} ${icon("chevron", "i chev")}</a><div class="mega"><div class="mega-inner">${mega}</div></div></li>`
          : `<li><a class="nav-btn" href="${rel}${p}"${active(p)}>${n}</a></li>`).join("")}
      </ul>
    </nav>
    <div class="nav-cta">
      <a class="btn btn-primary btn-sm" href="${rel}${BOOK}"${active(BOOK)}>${icon("calendar")} <span>Book a consultation</span></a>
      <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">${icon("menu")}</button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" hidden>
    <nav aria-label="Mobile">
      <a style="--i:0" href="${rel}">Home</a>
      ${NAV.map(([n, p], i) => `<a style="--i:${i + 1}" href="${rel}${p}">${n}</a>`).join("")}
      <a style="--i:7" class="btn btn-primary" href="${rel}${BOOK}">${icon("calendar")} Book a consultation</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      ${logo(rel, "logo-light")}
      <p class="f-about">${esc(C.name)} — calm, precise dental and implant care for the whole family in ${esc(city)}.</p>
      <div class="socials">${Object.entries(C.social).filter(([, v]) => v).map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener">${k}</a>`).join("")}</div>
    </div>
    <div><h3>Explore</h3><ul>
      ${NAV.map(([n, p]) => `<li><a href="${rel}${p}">${n}</a></li>`).join("")}<li><a href="${rel}${BOOK}">Book a consultation</a></li></ul></div>
    <div><h3>Treatments</h3><ul>
      ${["dental-implants", "full-mouth-rehabilitation", "smile-makeover", "teeth-whitening", "root-canal-treatment", "dental-crowns-and-bridges", "clear-aligners"].map((s) => T.find((t) => t.slug === s)).map((t) => `<li><a href="${rel}treatments/${t.slug}/">${esc(t.name)}</a></li>`).join("")}</ul></div>
    <div><h3>Visit</h3>
      <address>
        <p>${icon("pin")} <span>${esc(addressLine)}</span></p>
        <p>${icon("phone")} <a href="tel:${C.phoneRaw}">${esc(C.phone)}</a></p>
        <p>${icon("mail")} <a href="mailto:${C.email}">${esc(C.email)}</a></p>
        ${C.hours.map((h) => `<p>${icon("clock")} <span>${esc(h.days)}: ${esc(hoursText(h))}</span></p>`).join("")}
      </address>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${YEAR} ${esc(C.name)}. ${esc(C.doctor.name)}, ${esc(C.doctor.registration)}.</p>
    <p class="small">Information on this site is general and does not replace a clinical examination.</p>
  </div>
</footer>
<div class="fab" aria-label="Quick actions">
  <a class="fab-mini fab-wa" href="${wa("Hello, I'd like to book a consultation.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon("whatsapp")}</a>
  <a class="fab-mini fab-call" href="tel:${C.phoneRaw}" aria-label="Call the clinic">${icon("phone")}</a>
  <a class="fab-book" href="${rel}${BOOK}" data-magnetic>${icon("calendar")}<span>Book a consultation</span></a>
</div>
<div class="lightbox" hidden><button class="lb-close" aria-label="Close">${icon("close")}</button><figure><div class="lb-media"></div><figcaption></figcaption></figure></div>
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
  <span class="eyebrow">${esc(eyebrow)}</span><h2>${h}</h2><span class="rule" aria-hidden="true"></span>${p ? `<p>${p}</p>` : ""}</div>`;

const ctaBand = (rel, h = "Talk to Dr. Uppal about your smile", p = "A consultation includes an examination, X-rays or a scan when needed, and a written plan with costs. You decide what happens next.") =>
  `<section class="section"><div class="wrap"><div class="cta-band" data-reveal>
  <div class="cta-glow" aria-hidden="true"></div>
  <div><span class="eyebrow light">Your first step</span><h2>${h}</h2><p>${p}</p></div>
  <div class="btn-group"><a class="btn btn-gold" href="${rel}${BOOK}">${icon("calendar")} Book a consultation</a><a class="btn btn-ghost-light" href="tel:${C.phoneRaw}">${icon("phone")} Call now</a></div>
</div></div></section>`;

const pageHero = (rel, trail, eyebrow, h1, lead, center = false) => `<section class="page-hero${center ? " center" : ""}">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
  <div class="wrap${center ? " narrow" : ""}">
    ${breadcrumbs(rel, trail)}
    <span class="eyebrow" data-reveal>${eyebrow}</span>
    <h1 data-reveal style="--d:80ms">${h1}</h1>
    <span class="rule" data-reveal style="--d:120ms" aria-hidden="true"></span>
    ${lead ? `<p class="lead" data-reveal style="--d:160ms">${lead}</p>` : ""}
  </div>
</section>`;

function breadcrumbs(rel, items) {
  return `<nav class="crumbs" aria-label="Breadcrumb" data-reveal><ol>${items.map(([n, p], i) => (i === items.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${rel}${p}">${esc(n)}</a></li>`)).join("")}</ol></nav>`;
}

/* "Why patients choose us" — the clinic's promises */
const REASONS = [
  ["shield", "Sterilisation you can see", "Every instrument is cleaned, sealed in a pouch and sterilised in a Class B autoclave — and the pouch is opened in front of you. Needles, gloves, bibs and suction tips are single-use, always. No exceptions, no shortcuts."],
  ["route", "Seamless treatment, start to finish", "Consultation, digital X-rays, 3D scans, treatment and aftercare are planned and delivered by one team under one roof. One clear plan, one point of contact — no running between labs and clinics."],
  ["crown", "Crowns delivered on time", "Your crown fitting date is fixed the day your tooth is prepared, and we keep it. Precise impressions and an experienced dental lab mean a crown that fits first time — and a temporary crown means you are never without a tooth in between."],
  ["scan", "Implants planned in 3D", "Each implant is planned on a 3D scan, so it is placed exactly where your bone and bite need it — safer surgery, more predictable results and teeth that feel like your own."],
  ["timer", "Appointments that respect your time", "We run to schedule, send reminders, and book longer appointments with fewer patients per hour. You won’t be rushed in the chair or kept waiting outside it."],
  ["doc", "Costs in writing, before we begin", "An itemised estimate with every option, timeline and cost explained in plain language. Nothing is started until you agree — and there are no surprises later."],
  ["heart", "Gentle, unhurried care", "Effective anaesthesia, a gentle technique and breaks whenever you need them. Nervous patients are always welcome — tell us, and we’ll go at your pace."],
  ["repeat", "Care that continues after treatment", "Written aftercare, follow-up calls, reminders for check-ups and yearly implant reviews — because a beautiful result should also be a lasting one."],
];

/* Location, contact & booking — used on Home and Contact */
function locationBlock(rel, headingTag = "h2") {
  const opts = `<option value="">Not sure yet — general consultation</option>${CATS.map((c) => `<optgroup label="${esc(c)}">${byCat[c].map((t) => `<option value="${t.slug}">${esc(t.name)}</option>`).join("")}</optgroup>`).join("")}`;
  return `<section class="section location" id="visit">
  <div class="wrap">
    ${heading("Visit · Call · Book", `Find us in <em>${esc(city)}</em>`, `Patients visit us from ${C.areasServed.join(", ")}.`)}
    <div class="loc-grid">
      <div class="loc-card" data-reveal>
        <div class="open-badge" data-hours='${JSON.stringify(C.hours.map((h) => ({ d: h.dayNums, o: h.open, c: h.close })))}'><span class="dot"></span><span class="txt">Opening hours</span></div>
        <${headingTag} class="loc-name">${esc(C.name)}</${headingTag}>
        <ul class="info-list">
          <li>${icon("pin")}<div><strong>Address</strong><span>${esc(addressLine)}</span><a href="${mapLink}" target="_blank" rel="noopener">Get directions →</a></div></li>
          <li>${icon("clock")}<div><strong>Opening hours</strong>${C.hours.map((h) => `<span>${esc(h.days)}: ${esc(hoursText(h))}</span>`).join("")}</div></li>
          <li>${icon("phone")}<div><strong>Phone & WhatsApp</strong><a href="tel:${C.phoneRaw}">${esc(C.phone)}</a></div></li>
          <li>${icon("mail")}<div><strong>Email</strong><a href="mailto:${C.email}">${esc(C.email)}</a></div></li>
        </ul>
        <div class="btn-group">
          <a class="btn btn-primary btn-lg call-btn" href="tel:${C.phoneRaw}"><span class="ring-ico">${icon("phone")}</span> Call now</a>
          <a class="btn btn-outline btn-lg" href="${rel}${BOOK}">${icon("calendar")} Book a consultation</a>
        </div>
      </div>
      <div class="map-wrap" data-reveal style="--d:120ms">
        <div class="map"><iframe title="Google map showing ${esc(C.name)}" src="${mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
        <span class="map-pin" aria-hidden="true">${icon("pin")}</span>
      </div>
    </div>
    <form class="quick-book book-form" data-reveal style="--d:160ms" novalidate data-wa="${C.whatsapp}" data-email="${C.email}" data-clinic="${esc(C.name)}">
      <div class="qb-head"><span class="eyebrow light">Book a consultation</span><h3>Reserve your visit in 60 seconds</h3></div>
      <div class="field"><label for="q-name">Your name</label><input id="q-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="q-phone">Mobile number</label><input id="q-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" pattern="[0-9+ \\-]{8,15}" required></div>
      <div class="field"><label for="q-t">Treatment</label><select id="q-t" name="treatment">${opts}</select></div>
      <button class="btn btn-gold btn-lg" type="submit" data-via="whatsapp">${icon("whatsapp")} Book on WhatsApp</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`;
}

/* ---------------------------------------------------------- pages */
function home() {
  const rel = "./";
  const words = (s, start = 0) => s.split(" ").map((w, i) => `<span class="w"><span style="--wi:${i + start}">${w}</span></span>`).join(" ");
  const body = `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span><span class="dots"></span></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <span class="eyebrow pill" data-reveal><span class="gem" aria-hidden="true"></span> Dental &amp; implant care in ${esc(city)}</span>
      <h1 class="words">${words("Every smile has a story.")}<br><em>${words("Let’s care for yours.", 4)}</em></h1>
      <span class="rule grow" aria-hidden="true"></span>
      <p class="lead" data-reveal style="--d:700ms">Maybe it’s a tooth that keeps you awake, a gap you’ve learned to hide, or a smile you simply want to love again. Whatever brings you here, you’ll be listened to first, treated gently, and cared for like family.</p>
      <div class="btn-group" data-reveal style="--d:820ms">
        <a class="btn btn-primary btn-lg" href="${rel}${BOOK}">${icon("calendar")} Book a consultation</a>
        <a class="btn btn-outline btn-lg" href="tel:${C.phoneRaw}">${icon("phone")} Call now</a>
      </div>
    </div>
    <div class="hero-visual" data-reveal style="--d:300ms">
      <div class="hero-halo" aria-hidden="true"></div>
      <div class="hero-art">${art("hero", "Animated illustration of a healthy, sparkling tooth")}</div>
      <div class="float-card fc1">${icon("shield")}<div><strong>Sterile, every time</strong><span>Sealed &amp; autoclaved</span></div></div>
      <div class="float-card fc2">${icon("crown")}<div><strong>Crowns on time</strong><span>A date we keep</span></div></div>
      <div class="float-card fc3">${icon("scan")}<div><strong>3D-planned implants</strong><span>Precise &amp; predictable</span></div></div>
    </div>
  </div>
  <a class="scroll-cue" href="#clinic" aria-label="Scroll to see our clinic"><span></span></a>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee-track">${[...T, ...T].map((t) => `<span><i class="gem"></i> ${esc(t.name)}</span>`).join("")}</div></div>

<section class="section" id="clinic">
  <div class="wrap">
    ${heading("Inside our clinic", "A calm space, <em>designed around you</em>", "Light, spotless and quiet — a clinic where you can breathe out the moment you walk in.")}
    <div class="bento">${C.gallery.map((g, i) => `<figure class="tile ${g.size || ""}" data-reveal style="--d:${(i % 4) * 90}ms" tabindex="0" data-lightbox>
      ${photo(g, rel)}
      <figcaption><strong>${esc(g.caption)}</strong><span>${esc(g.note)}</span></figcaption>
      <span class="tile-zoom" aria-hidden="true">${icon("expand")}</span>
    </figure>`).join("")}</div>
    <div class="center mt-lg" data-reveal><a class="btn btn-outline" href="${rel}gallery/">View full gallery ${icon("arrow")}</a></div>
  </div>
</section>

<section class="section why">
  <div class="why-bg" aria-hidden="true"></div>
  <div class="wrap why-grid">
    <div class="why-intro">
      <span class="eyebrow light" data-reveal>Why patients choose us?</span>
      <h2 data-reveal style="--d:80ms">Because trust is built <em>one careful detail</em> at a time.</h2>
      <span class="rule" data-reveal style="--d:120ms" aria-hidden="true"></span>
      <p data-reveal style="--d:160ms">Great dentistry isn’t just skilled hands. It’s knowing your instruments are truly sterile, your treatment flows without confusion, your crown arrives on the day we promised, and someone is genuinely looking out for you — long after you leave the chair.</p>
      <div class="why-meter" data-reveal style="--d:220ms" aria-hidden="true"><span class="why-fill"></span></div>
      <a class="btn btn-gold" data-reveal style="--d:260ms" href="${rel}${BOOK}">${icon("calendar")} Book a consultation</a>
    </div>
    <ol class="reasons">
      ${REASONS.map(([i, h, p], n) => `<li class="reason" data-reveal style="--d:${(n % 2) * 90}ms"><span class="r-num">${String(n + 1).padStart(2, "0")}</span><span class="r-icon">${icon(i)}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join("")}
    </ol>
  </div>
</section>

${locationBlock(rel)}
`;
  return layout({
    title: `Dentist in ${city} | Dental Implants, Smile Design & Family Dentistry | ${C.shortName}`,
    description: `${C.name}, ${city}: gentle, precise dental and implant care. Hospital-grade sterilisation, seamless treatment, crowns delivered on time. Book a consultation today.`,
    pathname: "",
    body,
    bodyClass: "home",
    schema: [{ "@context": "https://schema.org", "@type": "WebSite", "@id": url("#website"), name: C.name, url: url(""), publisher: { "@id": url("#clinic") }, inLanguage: "en-IN" }],
  });
}

const doctorCard = () => `<div class="doctor-card" data-reveal id="doctor">
  <div class="doc-portrait"><span class="monogram">U</span><div class="ring"></div></div>
  <div class="doc-meta"><strong>${esc(C.doctor.name)}</strong><span>${esc(C.doctor.qualifications)}</span><span>${esc(C.doctor.title)}</span></div>
  ${C.doctor.experienceYears ? `<div class="exp-badge"><strong>${C.doctor.experienceYears}+</strong><span>years of<br>experience</span></div>` : ""}
</div>`;

function about() {
  const rel = "../";
  const values = [["scan", "Plan first", "No drilling before diagnosis. Good results start with good records and a clear plan."], ["tooth", "Keep what you can", "We save natural teeth wherever it is sensible, and replace them only when it is not."], ["doc", "Be clear about cost", "Written, itemised estimates, and no treatment you have not agreed to."], ["heart", "Make it comfortable", "Gentle technique, effective anaesthesia, and breaks whenever you need them."]];
  const body = `
${pageHero(rel, [["Home", ""], ["About", "about/"]], "About the clinic", `Careful planning, time with patients, <em>lasting results</em>`, `${esc(C.name)} is a private dental practice in ${esc(city)}, focused on dental implants, smile design and unhurried care for the whole family.`)}
<section class="section pt-0">
  <div class="wrap split">
    ${doctorCard()}
    <div data-reveal style="--d:120ms">
      <span class="eyebrow">Founder &amp; lead dentist</span>
      <h2>${esc(C.doctor.name)}, <em>${esc(C.doctor.qualifications)}</em></h2>
      <span class="rule" aria-hidden="true"></span>
      ${C.doctor.bio.map((b) => `<p>${esc(b)}</p>`).join("")}
      <p class="muted small">${esc(C.doctor.registration)}</p>
    </div>
  </div>
</section>
<section class="section tint">
  <div class="wrap">
    ${heading("What we believe", "Four promises <em>we never bend</em>", "")}
    <div class="feature-grid four">${values.map(([i, h, p], n) => `<div class="feature" data-reveal style="--d:${n * 90}ms"><span class="f-icon">${icon(i)}</span><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div data-reveal>
      <span class="eyebrow">Safety &amp; sterilisation</span>
      <h2>Your safety is <em>never hurried</em></h2>
      <span class="rule" aria-hidden="true"></span>
      <p>Instruments are cleaned, sealed and sterilised for every patient, and surfaces are disinfected between appointments.</p>
      <ol class="protocol">${["Instruments cleaned in an ultrasonic bath to remove debris", "Sealed in sterilisation pouches with colour-change indicators", "Sterilised in a Class B vacuum autoclave", "Pouches opened in front of you at your appointment", "Single-use needles, gloves, bibs and suction tips", "Digital X-rays with lower radiation than film", "Medical history reviewed at every visit"].map((s, i) => `<li data-reveal style="--d:${i * 60}ms"><span>${i + 1}</span>${s}</li>`).join("")}</ol>
    </div>
    <div class="art-panel" data-reveal style="--d:120ms">${room("steri", "Sterilisation room illustration")}</div>
  </div>
</section>
${ctaBand(rel)}`;
  return layout({
    title: `About ${C.doctor.name} | Dental & Implant Clinic, ${city}`,
    description: `Meet ${C.doctor.name} at ${C.name}, ${city}: careful planning, honest costs, strict sterilisation and gentle care for the whole family.`,
    pathname: "about/", depth: 1, body,
    schema: [doctorSchema(), crumbs([["Home", ""], ["About", "about/"]]), { "@context": "https://schema.org", "@type": "AboutPage", name: `About ${C.name}`, url: url("about/"), about: { "@id": url("#clinic") } }],
  });
}

function treatmentsHub() {
  const rel = "../";
  const body = `
${pageHero(rel, [["Home", ""], ["Treatments", "treatments/"]], "Treatments &amp; procedures", `From a routine clean to <em>a full set of fixed teeth</em>`, `${T.length} treatments across general, cosmetic, restorative, surgical and orthodontic dentistry. Choose one to see how it works, recovery time and answers to common questions.`)}
<section class="section pt-0">
  <div class="wrap">
    <div class="chips" role="toolbar" aria-label="Filter treatments" data-reveal>
      <button class="chip active" data-filter="all">All</button>
      ${CATS.map((c) => `<button class="chip" data-filter="${esc(c)}">${esc(c)}</button>`).join("")}
    </div>
    <div class="t-grid" id="t-grid">${T.map((t, i) => card(t, rel, i)).join("")}</div>
  </div>
</section>
${ctaBand(rel, "Not sure which treatment you need?", "Book a consultation — we’ll examine, explain your options clearly and give you a written plan before anything begins.")}`;
  return layout({
    title: `Dental Treatments in ${city} — Implants, RCT, Veneers, Aligners | ${C.shortName}`,
    description: `All treatments at ${C.name}, ${city}: dental implants, full-mouth rehabilitation, root canal, crowns and bridges, veneers, whitening, braces, clear aligners, gum care and family dentistry.`,
    pathname: "treatments/", depth: 1, body,
    schema: [crumbs([["Home", ""], ["Treatments", "treatments/"]]), { "@context": "https://schema.org", "@type": "ItemList", name: "Dental treatments", itemListElement: T.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: url(`treatments/${t.slug}/`) })) }],
  });
}

function treatmentPage(t) {
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
      <h1 data-reveal style="--d:80ms">${esc(t.name)} <em>in ${esc(city)}</em></h1>
      <p class="lead answer" data-reveal style="--d:160ms">${esc(t.summary)}</p>
      <div class="btn-group" data-reveal style="--d:240ms">
        <a class="btn btn-primary btn-lg" href="${rel}${BOOK}?treatment=${t.slug}">${icon("calendar")} Book a consultation</a>
        <a class="btn btn-outline btn-lg" href="${wa(`Hi, I'd like to know more about ${t.name}.`)}" target="_blank" rel="noopener">${icon("whatsapp")} Ask a question</a>
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
      <a class="btn btn-primary btn-sm btn-block" href="${rel}${BOOK}?treatment=${t.slug}">Book a consultation</a>
    </aside>
    <article class="t-article">
      <p class="reviewed">${icon("shield")} Medically reviewed by <a href="${rel}about/#doctor">${esc(C.doctor.name)}, ${esc(C.doctor.qualifications)}</a> · Updated <time datetime="${C.lastUpdated}">${new Date(C.lastUpdated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time></p>
      <section id="overview" data-reveal><h2>What is ${esc(plain(t.name))}?</h2>${t.intro.map((x) => `<p>${esc(x)}</p>`).join("")}</section>
      <section id="signs" data-reveal><h2>Signs you may need it</h2><ul class="sign-list">${t.signs.map((s) => `<li>${icon("check")} ${esc(s)}</li>`).join("")}</ul></section>
      <section id="procedure"><h2 data-reveal>The procedure, step by step</h2>
        <ol class="steps">${t.steps.map((s, i) => `<li data-reveal style="--d:${i * 70}ms"><span class="s-num">${i + 1}</span><div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></li>`).join("")}</ol></section>
      <section id="benefits" data-reveal><h2>Benefits</h2><div class="benefits">${t.benefits.map((b) => `<div>${icon("spark")}<span>${esc(b)}</span></div>`).join("")}</div></section>
      <section id="aftercare" data-reveal><h2>Recovery &amp; aftercare</h2><ul class="sign-list care">${t.aftercare.map((s) => `<li>${icon("heart")} ${esc(s)}</li>`).join("")}</ul></section>
      <section id="faqs"><h2 data-reveal>${esc(plain(t.name))}: frequently asked questions</h2><div class="faqs" data-reveal>${faqList(t.faqs, true)}</div></section>
      <div class="cost-note" data-reveal>${icon("doc")}<div><h3>How much does it cost?</h3><p>The cost of ${esc(t.name.toLowerCase())} depends on your diagnosis, the number of teeth involved and the materials chosen. After your examination you’ll receive a clear, itemised estimate before treatment starts. <a href="${rel}${BOOK}?treatment=${t.slug}">Book a consultation</a> to get your personalised plan.</p></div></div>
    </article>
  </div>
</section>
<section class="section tint">
  <div class="wrap">
    ${heading("Related treatments", "You may also <em>want to know</em>", "")}
    <div class="t-grid three">${related.map((r, i) => card(r, rel, i)).join("")}</div>
  </div>
</section>
${ctaBand(rel, `Considering ${esc(plain(t.name).toLowerCase())}?`, "Book a consultation and we’ll check whether it’s right for you, explain every option and give you a written estimate.")}`;
  return layout({
    title: `${t.name} in ${city} — Procedure, Recovery & FAQs | ${C.shortName}`,
    description: `${t.summary.split(". ")[0]}. Procedure, recovery, benefits and FAQs from ${C.name}, ${city}.`.slice(0, 300),
    pathname: p, depth: 2, body, bodyClass: "treatment", ogType: "article",
    schema: [
      {
        "@context": "https://schema.org", "@type": "MedicalWebPage", name: `${t.name} — ${C.name}`, url: url(p), description: t.summary, inLanguage: "en-IN",
        lastReviewed: C.lastUpdated, reviewedBy: { "@id": url("about/#doctor") }, publisher: { "@id": url("#clinic") },
        audience: { "@type": "PeopleAudience", audienceType: "Patient" },
        about: { "@type": "MedicalProcedure", name: t.name, description: t.summary, howPerformed: t.steps.map((s) => `${s.t}: ${s.d}`).join(" "), followup: t.aftercare.join(" "), relevantSpecialty: "Dentistry" },
      },
      doctorSchema(), faqSchema(t.faqs), crumbs([["Home", ""], ["Treatments", "treatments/"], [t.name, p]]),
    ],
  });
}

function patientGuide() {
  const rel = "../";
  const stages = [
    ["calendar", "Before your first visit", ["Arrive ten minutes early to complete a short medical history", "Bring a list of medicines you take, and any recent dental X-rays", "Tell us about diabetes, heart conditions, blood thinners, allergies or pregnancy", "Eat normally unless we tell you otherwise", "Nervous? Tell us when you book — we’ll plan a gentler, slower visit"]],
    ["search", "At your consultation", ["A conversation about what bothers you and what you want", "Examination of teeth, gums, bite and soft tissues", "Digital X-rays or a 3D scan, only if needed", "Your options explained with timelines and costs", "A written, itemised plan — nothing starts without your agreement"]],
    ["tooth", "During treatment", ["Effective local anaesthesia — you feel pressure, not pain", "A ‘stop’ signal you can use at any time", "Sterile instruments opened in front of you", "We explain each step as we go", "Fixed dates for crowns, bridges and lab work — and we keep them"]],
    ["heart", "After treatment", ["Written aftercare instructions for your procedure", "A follow-up call or review appointment where needed", "Reminders for check-ups and cleanings", "Yearly reviews for implants and large restorations", "Call us straight away for swelling that keeps increasing, bleeding that won’t stop with pressure, or a fever"]],
  ];
  const body = `
${pageHero(rel, [["Home", ""], ["Patient guide", "patient-guide/"]], "Patient guide", `What to expect, <em>every step of the way</em>`, "Before, during and after your visit — so you can walk in feeling informed, calm and in control.")}
<section class="section pt-0">
  <div class="wrap">
    <ol class="guide">${stages.map(([i, h, items], n) => `<li class="g-stage" data-reveal style="--d:${n * 90}ms">
      <div class="g-head"><span class="g-num">${String(n + 1).padStart(2, "0")}</span><span class="r-icon">${icon(i)}</span><h2>${h}</h2></div>
      <ul>${items.map((x) => `<li>${icon("check")} ${esc(x)}</li>`).join("")}</ul></li>`).join("")}</ol>
  </div>
</section>
<section class="section tint">
  <div class="wrap guide-cards">
    <div class="side-card" data-reveal><h3>${icon("doc")} Payment</h3><p>We share an itemised estimate before treatment, so you know the full cost up front. Ask our front desk about accepted payment methods. <!-- TODO: list payment methods, e.g. UPI, cards, cash, EMI --></p><p>Ask us about staged payments for longer treatment plans.</p></div>
    <div class="side-card" data-reveal style="--d:90ms"><h3>${icon("shield")} Insurance</h3><p>Most health policies cover dental treatment only after an accident or when hospitalisation is needed. If your policy or employer includes OPD dental cover, we provide the bills and reports you need.</p></div>
    <div class="side-card highlight" data-reveal style="--d:180ms"><h3>${icon("phone")} Need help after hours?</h3><p>Message us on WhatsApp at ${esc(C.phone)}. For a medical emergency, go to the nearest hospital.</p><a class="btn btn-gold btn-block" href="${wa()}" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp us</a></div>
  </div>
</section>
<section class="section">
  <div class="wrap split faq-split">
    <div data-reveal><span class="eyebrow">Common questions</span><h2>Straight answers <em>before you visit</em></h2><span class="rule" aria-hidden="true"></span><p>The questions patients ask us most. There are many more in our FAQ section.</p><a class="btn btn-outline" href="${rel}faq/">All FAQs ${icon("arrow")}</a></div>
    <div class="faqs" data-reveal style="--d:120ms">${faqList(FAQS[0].items.concat(FAQS[2].items.slice(0, 2)), true)}</div>
  </div>
</section>
${ctaBand(rel)}`;
  return layout({
    title: `Patient Guide — Your Visit, Payment & Aftercare | ${C.shortName}, ${city}`,
    description: `What to expect at ${C.name}, ${city}: before your first visit, at the consultation, during treatment, aftercare, payment and after-hours help.`,
    pathname: "patient-guide/", depth: 1, body,
    schema: [crumbs([["Home", ""], ["Patient guide", "patient-guide/"]]), faqSchema(FAQS[0].items.concat(FAQS[2].items.slice(0, 2)))],
  });
}

function faqPage() {
  const rel = "../";
  const groups = [...FAQS, ...T.map((t) => ({ group: t.name, slug: t.slug, items: t.faqs }))];
  const all = groups.flatMap((g) => g.items);
  const body = `
<section class="page-hero center">
  <div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
  <div class="wrap narrow">
    ${breadcrumbs(rel, [["Home", ""], ["FAQs", "faq/"]])}
    <span class="eyebrow" data-reveal>Patient FAQs</span>
    <h1 data-reveal style="--d:80ms">Your dental questions, <em>answered</em></h1>
    <span class="rule" data-reveal aria-hidden="true"></span>
    <p class="lead" data-reveal style="--d:160ms">${all.length} answers about procedures, pain, recovery, costs and everyday care.</p>
    <label class="search" data-reveal style="--d:240ms">${icon("search")}<input type="search" id="faq-search" placeholder="Search e.g. “implant pain”, “wisdom tooth”, “crown”" aria-label="Search FAQs"></label>
  </div>
</section>
<section class="section pt-0">
  <div class="wrap faq-layout">
    <aside class="toc faq-toc" aria-label="FAQ topics"><p>Topics</p><ul>${groups.map((g, i) => `<li><a href="#g${i}">${esc(g.group)}</a></li>`).join("")}</ul></aside>
    <div>
      ${groups.map((g, i) => `<section class="faq-group" id="g${i}" data-reveal><h2>${esc(g.group)}${g.slug ? ` <a class="small-link" href="${rel}treatments/${g.slug}/">Treatment guide →</a>` : ""}</h2><div class="faqs">${faqList(g.items)}</div></section>`).join("")}
      <p class="no-results" hidden>No matching questions. <a href="${wa()}" target="_blank" rel="noopener">Ask us on WhatsApp</a> — we’re happy to help.</p>
    </div>
  </div>
</section>
${ctaBand(rel, "Still have a question?", "Message us on WhatsApp or book a consultation — honest answers, with no obligation.")}`;
  return layout({
    title: `Dental FAQs — Implants, Root Canal, Crowns, Braces & More | ${C.shortName}, ${city}`,
    description: `${all.length} answers to common dental questions: implant cost in Delhi, is root canal painful, how long crowns last, braces vs aligners, wisdom teeth, whitening and aftercare.`,
    pathname: "faq/", depth: 1, body,
    schema: [faqSchema(all), crumbs([["Home", ""], ["FAQs", "faq/"]])],
  });
}

function galleryPage() {
  const rel = "../";
  const body = `
${pageHero(rel, [["Home", ""], ["Gallery", "gallery/"]], "Gallery", `Step inside <em>our clinic</em>`, "Take a look around before you visit — from the moment you arrive to the room where your smile is cared for.")}
<section class="section pt-0">
  <div class="wrap">
    <div class="bento gallery-full">${C.gallery.map((g, i) => `<figure class="tile ${g.size || ""}" data-reveal style="--d:${(i % 3) * 90}ms" tabindex="0" data-lightbox>
      ${photo(g, rel, i < 2)}
      <figcaption><strong>${esc(g.caption)}</strong><span>${esc(g.note)}</span></figcaption>
      <span class="tile-zoom" aria-hidden="true">${icon("expand")}</span>
    </figure>`).join("")}</div>
  </div>
</section>
${ctaBand(rel, "See it for yourself", "The best way to know us is to visit. Book a consultation and we’ll show you around.")}`;
  return layout({
    title: `Clinic Gallery | ${C.name}, ${city}`,
    description: `Photos of ${C.name} in ${city}: reception, treatment suite, sterilisation room, consultation room and digital imaging.`,
    pathname: "gallery/", depth: 1, body,
    schema: [crumbs([["Home", ""], ["Gallery", "gallery/"]]), { "@context": "https://schema.org", "@type": "ImageGallery", name: `${C.name} clinic gallery`, url: url("gallery/"), about: { "@id": url("#clinic") } }],
  });
}

function contactPage() {
  const rel = "../";
  const body = `
${pageHero(rel, [["Home", ""], ["Contact us", "contact/"]], "Contact us", `We’d love to <em>hear from you</em>`, "Questions, appointments or something urgent — reach us however suits you best.")}
<section class="section pt-0">
  <div class="wrap contact-cards">
    <a class="c-card" href="tel:${C.phoneRaw}" data-reveal>${icon("phone")}<h2>Call now</h2><p>${esc(C.phone)}</p></a>
    <a class="c-card" href="${wa()}" target="_blank" rel="noopener" data-reveal style="--d:90ms">${icon("whatsapp")}<h2>WhatsApp</h2><p>Chat with our team</p></a>
    <a class="c-card" href="mailto:${C.email}" data-reveal style="--d:180ms">${icon("mail")}<h2>Email</h2><p>${esc(C.email)}</p></a>
    <a class="c-card" href="${mapLink}" target="_blank" rel="noopener" data-reveal style="--d:270ms">${icon("pin")}<h2>Directions</h2><p>${esc(city)}</p></a>
  </div>
</section>
${locationBlock(rel)}`;
  return layout({
    title: `Contact & Directions | ${C.name}, ${city}`,
    description: `Contact ${C.name} in ${city}: address, phone, WhatsApp, email, opening hours, Google map and directions. Call now or book a consultation.`,
    pathname: "contact/", depth: 1, body,
    schema: [crumbs([["Home", ""], ["Contact us", "contact/"]]), { "@context": "https://schema.org", "@type": "ContactPage", url: url("contact/"), about: { "@id": url("#clinic") } }],
  });
}

function bookPage() {
  const rel = "../";
  const body = `
${pageHero(rel, [["Home", ""], ["Book a consultation", BOOK]], "Book a consultation", `Your visit, <em>in 60 seconds</em>`, "Send your details and we’ll confirm your appointment on WhatsApp or by phone.")}
<section class="section pt-0">
  <div class="wrap book-grid">
    <form class="book-form" id="book-form" novalidate data-reveal data-wa="${C.whatsapp}" data-email="${C.email}" data-clinic="${esc(C.name)}">
      <div class="field"><label for="f-name">Full name *</label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-phone">Mobile number *</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" pattern="[0-9+ \\-]{8,15}" required></div>
      <div class="field"><label for="f-email">Email (optional)</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
      <div class="field"><label for="f-treatment">Treatment</label>
        <select id="f-treatment" name="treatment"><option value="">Not sure yet — general consultation</option>${CATS.map((c) => `<optgroup label="${esc(c)}">${byCat[c].map((t) => `<option value="${t.slug}">${esc(t.name)}</option>`).join("")}</optgroup>`).join("")}</select></div>
      <div class="field"><label for="f-date">Preferred date *</label><input id="f-date" name="date" type="date" required></div>
      <div class="field"><label for="f-time">Preferred time</label>
        <select id="f-time" name="time"><option>Morning (10 am – 1 pm)</option><option>Afternoon (1 pm – 5 pm)</option><option>Evening (5 pm – 8 pm)</option></select></div>
      <div class="field full"><label for="f-msg">Anything we should know? (optional)</label><textarea id="f-msg" name="message" rows="4" placeholder="Describe your concern or questions. Please don’t include detailed medical records."></textarea></div>
      <label class="consent full"><input type="checkbox" name="consent" required> I agree to be contacted about my appointment.</label>
      <div class="full btn-group">
        <button class="btn btn-primary btn-lg" type="submit" data-via="whatsapp">${icon("whatsapp")} Send on WhatsApp</button>
        <button class="btn btn-outline btn-lg" type="submit" data-via="email">${icon("mail")} Send by email</button>
      </div>
      <p class="form-status full" role="status" aria-live="polite"></p>
    </form>
    <aside class="book-side" data-reveal style="--d:120ms">
      <div class="side-card highlight"><h2>Prefer to talk?</h2><p>Call us and our front desk will find the best time for you.</p><a class="btn btn-gold btn-block" href="tel:${C.phoneRaw}">${icon("phone")} Call now</a></div>
      <div class="side-card"><h3>${icon("clock")} Opening hours</h3>${C.hours.map((h) => `<p><strong>${esc(h.days)}</strong><br>${esc(hoursText(h))}</p>`).join("")}</div>
      <div class="side-card"><h3>${icon("pin")} Where we are</h3><p>${esc(addressLine)}</p><a href="${mapLink}" target="_blank" rel="noopener">Get directions →</a></div>
    </aside>
  </div>
</section>`;
  return layout({
    title: `Book a Dental Consultation in ${city} | ${C.name}`,
    description: `Book a consultation at ${C.name}, ${city} in 60 seconds — on WhatsApp, by email or phone.`,
    pathname: BOOK, depth: 1, body, bodyClass: "book",
    schema: [crumbs([["Home", ""], ["Book a consultation", BOOK]])],
  });
}

function notFound() {
  return layout({
    title: `Page not found | ${C.name}`,
    description: "The page you were looking for could not be found.",
    pathname: "404.html",
    body: `<section class="page-hero center"><div class="wrap narrow"><div class="nf-art">${art("extraction", "Tooth lifting away")}</div><h1>This page has <em>gone missing</em></h1><p class="lead">Like a lost tooth — but we can help you find what you need.</p><div class="btn-group center-row"><a class="btn btn-primary" href="${url("")}">Go home</a><a class="btn btn-outline" href="${url("treatments/")}">See treatments</a></div></div></section>`,
  }).replace('content="index, follow, max-image-preview:large, max-snippet:-1"', 'content="noindex"');
}

/* ---------------------------------------------------------- SEO / GEO files */
const PAGES = ["", "about/", "treatments/", ...T.map((t) => `treatments/${t.slug}/`), "patient-guide/", "faq/", "gallery/", "contact/", BOOK];
const sitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${url(p)}</loc><lastmod>${C.lastUpdated}</lastmod><priority>${p === "" ? "1.0" : p.startsWith("treatments/") ? "0.9" : "0.7"}</priority></url>`).join("\n")}
</urlset>`;

const robots = () => `User-agent: *
Allow: /

# AI search and answer engines are welcome
${["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot"].map((b) => `User-agent: ${b}\nAllow: /`).join("\n")}

Sitemap: ${url("sitemap.xml")}
`;

const llms = () => `# ${C.name}

> Private dental and implant clinic in ${city}, ${C.address.region}, India, led by ${C.doctor.name} (${C.doctor.qualifications}). Known for strict sterilisation (Class B autoclave, single-use disposables), seamless treatment under one roof, crowns delivered on the promised date, and 3D-planned dental implants.

- Address: ${addressLine}
- Phone / WhatsApp: ${C.phone}
- Email: ${C.email}
- Hours: ${C.hours.map((h) => `${h.days} ${h.label}`).join("; ")}
- Areas served: ${C.areasServed.join(", ")}
- Book a consultation: ${url(BOOK)}

## Why patients choose us
${REASONS.map(([, h, p]) => `- ${h}: ${p}`).join("\n")}

## Treatments
${T.map((t) => `- [${t.name}](${url(`treatments/${t.slug}/`)}): ${t.summary}`).join("\n")}

## Pages
- [About](${url("about/")})
- [Patient guide](${url("patient-guide/")})
- [FAQs](${url("faq/")})
- [Gallery](${url("gallery/")})
- [Contact](${url("contact/")})

## Frequently asked questions
${[...FAQS.flatMap((g) => g.items), ...T.flatMap((t) => t.faqs.slice(0, 2))].map((f) => `### ${f.q}\n${f.a}\n`).join("\n")}`;

const manifest = () => JSON.stringify({ name: C.name, short_name: C.shortName, start_url: "./", display: "standalone", background_color: "#ffffff", theme_color: "#6B1022", icons: [{ src: "assets/favicon.svg", sizes: "any", type: "image/svg+xml" }, { src: "assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] }, null, 2);

/* ---------------------------------------------------------- build */
const copyDir = (from, to) => {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const s = path.join(from, f), d = path.join(to, f);
    fs.statSync(s).isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
};
fs.rmSync(OUT, { recursive: true, force: true });
copyDir(ASSETS, path.join(OUT, "assets"));

write("index.html", home());
write("about/index.html", about());
write("treatments/index.html", treatmentsHub());
T.forEach((t) => write(`treatments/${t.slug}/index.html`, treatmentPage(t)));
write("patient-guide/index.html", patientGuide());
write("faq/index.html", faqPage());
write("gallery/index.html", galleryPage());
write("contact/index.html", contactPage());
write(`${BOOK}index.html`, bookPage());
write("404.html", notFound());
write("sitemap.xml", sitemap());
write("robots.txt", robots());
write("llms.txt", llms());
write("site.webmanifest", manifest());
write(".nojekyll", "");

console.log(`✓ Built ${PAGES.length + 1} pages into /docs`);
