/**
 * Hand-crafted, animated SVG illustrations for every procedure.
 * Animations are driven by CSS classes in styles.css (a-*) and are
 * disabled automatically for users who prefer reduced motion.
 */
const MOLAR =
  "M70 62c0-20 22-28 50-17 28-11 50-3 50 17 2 34-6 56-12 78-5 28-9 62-21 66-11 4-9-36-17-52-8 16-6 56-17 52-12-4-16-38-21-66-6-22-14-44-12-78z";
const INCISOR =
  "M94 46c18-9 34-9 52 0 7 34 5 62-2 86-6 24-12 58-24 74-12-16-18-50-24-74-7-24-9-52-2-86z";

const defs = (id) => `
<defs>
  <linearGradient id="${id}-t" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e7ec"/></linearGradient>
  <radialGradient id="${id}-bg" cx="50%" cy="38%" r="62%"><stop offset="0" stop-color="#f2fbf9"/><stop offset="1" stop-color="#d4eeea"/></radialGradient>
  <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2dd4bf"/><stop offset="1" stop-color="#0e7490"/></linearGradient>
  <linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7dca8"/><stop offset="1" stop-color="#c39a5a"/></linearGradient>
  <linearGradient id="${id}-gum" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7a9b9"/><stop offset="1" stop-color="#df6d89"/></linearGradient>
  <linearGradient id="${id}-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9fb3bf"/><stop offset=".5" stop-color="#eef4f7"/><stop offset="1" stop-color="#8aa0ad"/></linearGradient>
  <linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <clipPath id="${id}-circle"><circle cx="120" cy="120" r="104"/></clipPath>
  <clipPath id="${id}-molar"><path d="${MOLAR}"/></clipPath>
  <clipPath id="${id}-inc"><path d="${INCISOR}"/></clipPath>
  <filter id="${id}-soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0f3b4a" flood-opacity=".16"/></filter>
</defs>`;

const frame = (id, label, inner, clip = true) => `<svg class="art" viewBox="0 0 240 240" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${defs(id)}
<circle cx="120" cy="120" r="104" fill="url(#${id}-bg)"/>
<circle class="a-spin-slow" cx="120" cy="120" r="113" fill="none" stroke="#0e7490" stroke-opacity=".22" stroke-width="1.5" stroke-dasharray="2 9"/>
${clip ? `<g clip-path="url(#${id}-circle)">${inner}</g>` : inner}</svg>`;

const molar = (id, cls = "") =>
  `<g class="${cls}" filter="url(#${id}-soft)"><path d="${MOLAR}" fill="url(#${id}-t)" stroke="#c4d5dc" stroke-width="2"/><path d="M86 70c3-11 14-16 26-12" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>`;

const sparkle = (x, y, s = 1, delay = 0, fill = "#d4ad6a") =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path class="a-sparkle" style="animation-delay:${delay}s" d="M0-12C1.5-3 3-1.5 12 0 3 1.5 1.5 3 0 12-1.5 3-3 1.5-12 0-3-1.5-1.5-3 0-12z" fill="${fill}"/></g>`;

const shine = (id, clip) =>
  `<g clip-path="url(#${id}-${clip})"><rect class="a-sweep" x="20" y="20" width="40" height="200" fill="url(#${id}-shine)" transform="skewX(-18)"/></g>`;

const frontTooth = (x, y, w, h, fill, flip = false) => {
  const r = Math.min(w / 2.4, 12);
  return flip
    ? `<path d="M${x} ${y + h}V${y + r}q0-${r} ${r}-${r}h${w - 2 * r}q${r} 0 ${r} ${r}V${y + h}z" fill="${fill}" stroke="#c4d5dc" stroke-width="1.5"/>`
    : `<path d="M${x} ${y}V${y + h - r}q0 ${r} ${r} ${r}h${w - 2 * r}q${r} 0 ${r}-${r}V${y}z" fill="${fill}" stroke="#c4d5dc" stroke-width="1.5"/>`;
};

const UPPER_W = [18, 22, 26, 30, 30, 26, 22, 18];
const upperCenters = () => {
  const total = UPPER_W.reduce((a, b) => a + b, 0) + 7 * 2;
  let x = 120 - total / 2;
  return UPPER_W.map((w) => { const c = x + w / 2; x += w + 2; return c; });
};
const upperRow = (id, y = 92, fill) => {
  const widths = UPPER_W;
  const total = widths.reduce((a, b) => a + b, 0) + 7 * 2;
  let x = 120 - total / 2;
  return widths
    .map((w, i) => {
      const h = [34, 40, 46, 52, 52, 46, 40, 34][i];
      const s = frontTooth(x, y, w, h, fill || `url(#${id}-t)`);
      x += w + 2;
      return s;
    })
    .join("");
};
const lowerRow = (id, y = 150, fill) => {
  const widths = [20, 22, 22, 20, 20, 22, 22, 20];
  const total = widths.reduce((a, b) => a + b, 0) + 7 * 2;
  let x = 120 - total / 2;
  return widths
    .map((w, i) => {
      const h = [30, 34, 38, 40, 40, 38, 34, 30][i];
      const s = frontTooth(x, y - h, w, h, fill || `url(#${id}-t)`, true);
      x += w + 2;
      return s;
    })
    .join("");
};

const arts = {
  hero: (id) => frame(id, "Animated illustration of a healthy, sparkling tooth", `
    <g class="a-orbit"><circle cx="120" cy="10" r="7" fill="url(#${id}-g)"/></g>
    <g class="a-orbit a-delay-2"><circle cx="120" cy="10" r="5" fill="url(#${id}-gold)"/></g>
    <g class="a-float">${molar(id)}${shine(id, "molar")}</g>
    ${sparkle(184, 62, 1.3, 0)}${sparkle(56, 168, 0.9, 0.7)}${sparkle(178, 182, 0.7, 1.3, "#2dd4bf")}${sparkle(62, 70, 0.6, 1.9, "#2dd4bf")}`, false),

  checkup: (id) => frame(id, "Dental check-up illustration with magnifying glass", `
    <g class="a-float">${molar(id)}</g>
    <g class="a-scan"><circle cx="160" cy="150" r="28" fill="#ffffff" fill-opacity=".45" stroke="url(#${id}-g)" stroke-width="7"/><path d="M180 171l26 26" stroke="#0e7490" stroke-width="11" stroke-linecap="round"/></g>
    <g transform="translate(58 52)"><circle r="17" fill="url(#${id}-g)"/><path class="a-dash" d="M-8 0l5 6 11-12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></g>
    ${sparkle(190, 62, 0.9, 0.4)}`),

  filling: (id) => frame(id, "Tooth-coloured filling illustration", `
    <g class="a-float">${molar(id)}
      <path d="M104 64c6-8 26-8 32 0 4 10-2 22-16 22s-20-12-16-22z" fill="#8a6650"/>
      <path class="a-fillin" d="M104 64c6-8 26-8 32 0 4 10-2 22-16 22s-20-12-16-22z" fill="#eef7f6" stroke="#2dd4bf" stroke-width="2"/>
    </g>
    <g class="a-bob"><rect x="150" y="14" width="18" height="46" rx="8" transform="rotate(28 159 37)" fill="url(#${id}-metal)"/><path class="a-glow" d="M146 54L118 66l18 12z" fill="#7dd3fc" fill-opacity=".55"/></g>
    ${sparkle(64, 160, 0.8, 0.5, "#2dd4bf")}`),

  rootcanal: (id) => frame(id, "Root canal treatment illustration showing cleaned canals", `
    <g class="a-float">
      <path d="${MOLAR}" fill="url(#${id}-t)" fill-opacity=".75" stroke="#c4d5dc" stroke-width="2" filter="url(#${id}-soft)"/>
      <path d="M100 78c0-12 40-12 40 0v14c0 8-40 8-40 0z" fill="#fca5a5" fill-opacity=".5"/>
      <path class="a-dash a-loop" d="M108 92c-4 30-10 60-12 100M132 92c4 30 10 60 12 100M100 82c0-10 40-10 40 0" fill="none" stroke="url(#${id}-g)" stroke-width="6" stroke-linecap="round" pathLength="1"/>
    </g>
    <g class="a-probe"><path d="M132 2v80" stroke="url(#${id}-metal)" stroke-width="3"/><rect x="124" y="-6" width="16" height="16" rx="4" fill="url(#${id}-gold)"/></g>
    ${sparkle(186, 160, 0.8, 0.2)}${sparkle(58, 72, 0.6, 1.1, "#2dd4bf")}`),

  extraction: (id) => frame(id, "Gentle tooth extraction illustration", `
    <path d="M30 186c30-20 150-20 180 0v40H30z" fill="url(#${id}-gum)"/>
    <g class="a-lift">${molar(id)}</g>
    <path class="a-dash a-loop" d="M196 150V70m-12 12l12-12 12 12" fill="none" stroke="#0e7490" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>
    ${sparkle(60, 120, 0.8, 0.3, "#2dd4bf")}`),

  gum: (id) => frame(id, "Healthy gums illustration", `
    <g class="a-float">${molar(id)}
      <path d="M58 140c18-12 34 6 62-6 28 12 44-6 62 6v76H58z" fill="url(#${id}-gum)" opacity=".95"/>
      <path d="M66 150c14-8 28 4 54-4 26 8 40-4 54 4" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>
    </g>
    <circle class="a-ring" cx="120" cy="120" r="70" fill="none" stroke="#2dd4bf" stroke-width="3"/>
    <circle class="a-ring a-delay-2" cx="120" cy="120" r="70" fill="none" stroke="#2dd4bf" stroke-width="3"/>
    <g transform="translate(190 70)"><path class="a-sparkle" d="M-3-12h6v9h9v6h-9v9h-6v-9h-9v-6h9z" fill="#14b8a6"/></g>
    <g transform="translate(52 96)"><path class="a-sparkle" style="animation-delay:.8s" d="M-2-8h4v6h6v4h-6v6h-4v-6h-6v-4h6z" fill="#14b8a6"/></g>`),

  kids: (id) => frame(id, "Happy child's tooth illustration", `
    <g class="a-bounce">${molar(id)}
      <circle cx="102" cy="92" r="6" fill="#0f3b4a"/><circle cx="138" cy="92" r="6" fill="#0f3b4a"/>
      <circle cx="104" cy="90" r="2" fill="#fff"/><circle cx="140" cy="90" r="2" fill="#fff"/>
      <path d="M106 112q14 14 28 0" fill="none" stroke="#0f3b4a" stroke-width="5" stroke-linecap="round"/>
      <circle cx="90" cy="108" r="7" fill="#f9a8b8" opacity=".7"/><circle cx="150" cy="108" r="7" fill="#f9a8b8" opacity=".7"/>
    </g>
    <g transform="translate(184 150)"><g class="a-wiggle"><rect x="-6" y="-46" width="12" height="70" rx="6" fill="url(#${id}-g)"/><rect x="-9" y="-62" width="18" height="20" rx="4" fill="#fff" stroke="#9fd8cf" stroke-width="2"/></g></g>
    ${sparkle(56, 60, 1, 0)}${sparkle(188, 54, 0.8, 0.6, "#f472b6")}${sparkle(50, 176, 0.7, 1.2, "#2dd4bf")}`),

  emergency: (id) => frame(id, "Emergency dental care illustration", `
    <g class="a-shake">${molar(id)}
      <path class="a-dash a-loop" d="M122 44l-10 24 14 8-12 22 10 6-8 18" fill="none" stroke="#e11d48" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>
    </g>
    <path class="a-dash a-loop" d="M18 200h50l10-20 12 36 12-50 12 34h108" fill="none" stroke="#0e7490" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>
    <g transform="translate(186 58)"><g class="a-pulse"><circle r="22" fill="#e11d48"/><path d="M-4-12h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="#fff"/></g></g>`),

  crown: (id) => frame(id, "Dental crown being placed on a tooth", `
    <g clip-path="url(#${id}-lowcut)">${molar(id)}</g>
    <defs><clipPath id="${id}-lowcut"><rect x="0" y="104" width="240" height="140"/></clipPath><clipPath id="${id}-topcut"><rect x="0" y="0" width="240" height="108"/></clipPath></defs>
    <rect x="86" y="96" width="68" height="16" rx="6" fill="#e9d6c4"/>
    <g class="a-drop"><g clip-path="url(#${id}-topcut)"><path d="${MOLAR}" fill="url(#${id}-gold)" stroke="#b88c4a" stroke-width="2"/></g>${shine(id, "molar")}</g>
    ${sparkle(184, 70, 1, 0.4)}${sparkle(58, 120, 0.7, 1, "#2dd4bf")}`),

  implant: (id) => frame(id, "Dental implant with crown illustration", `
    <path d="M24 150c40-14 152-14 192 0v80H24z" fill="url(#${id}-gum)"/>
    <path d="M24 168c40-8 152-8 192 0v62H24z" fill="#f3e3cf"/>
    <g>
      <path d="M106 130h28l-4 76c0 6-20 6-20 0z" fill="url(#${id}-metal)" stroke="#7f95a3" stroke-width="1.5"/>
      ${[142, 154, 166, 178, 190].map((y) => `<path d="M104 ${y}l32-6" stroke="#7f95a3" stroke-width="3" stroke-linecap="round"/>`).join("")}
      <rect x="110" y="114" width="20" height="18" rx="3" fill="url(#${id}-metal)" stroke="#7f95a3"/>
    </g>
    <g class="a-drop"><path d="M74 72c0-20 20-26 46-16 26-10 46-4 46 16 0 22-6 38-12 44H86c-6-6-12-22-12-44z" fill="url(#${id}-t)" stroke="#c4d5dc" stroke-width="2" filter="url(#${id}-soft)"/><path d="M88 74c3-10 12-14 22-11" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>
    ${sparkle(190, 56, 1, 0.2)}${sparkle(50, 92, 0.7, 0.9, "#2dd4bf")}`),

  denture: (id) => frame(id, "Complete denture illustration", `
    <g class="a-float">
      <path d="M40 120c0-56 36-80 80-80s80 24 80 80c0 14-14 18-26 10-10-30-28-46-54-46s-44 16-54 46c-12 8-26 4-26-10z" fill="url(#${id}-gum)" filter="url(#${id}-soft)"/>
      ${Array.from({ length: 12 }, (_, i) => {
        const a = Math.PI * (0.98 - (i * 0.96) / 11);
        const x = 120 + Math.cos(a) * 64, y = 118 - Math.sin(a) * 60;
        return `<rect x="${(x - 9).toFixed(1)}" y="${(y - 11).toFixed(1)}" width="18" height="22" rx="7" fill="url(#${id}-t)" stroke="#c4d5dc" transform="rotate(${(90 - (a * 180) / Math.PI).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      }).join("")}
    </g>
    ${sparkle(190, 186, 0.9, 0.3)}${sparkle(52, 186, 0.6, 1.1, "#2dd4bf")}`),

  fullmouth: (id) => frame(id, "Full mouth rehabilitation illustration", `
    <path d="M30 70q90-34 180 0v26H30z" fill="url(#${id}-gum)"/>
    <path d="M30 172q90 34 180 0v-24H30z" fill="url(#${id}-gum)"/>
    <g class="a-bite-top">${upperRow(id, 88)}</g>
    <g class="a-bite-bottom">${lowerRow(id, 154)}</g>
    <g clip-path="url(#${id}-mouth)"><rect class="a-sweep" x="10" y="60" width="40" height="120" fill="url(#${id}-shine)" transform="skewX(-18)"/></g>
    <defs><clipPath id="${id}-mouth"><rect x="40" y="88" width="160" height="66"/></clipPath></defs>
    ${sparkle(198, 46, 1, 0.2)}${sparkle(42, 196, 0.7, 1, "#2dd4bf")}`),

  whitening: (id) => frame(id, "Teeth whitening illustration", `
    <g class="a-float">${molar(id)}
      <path class="a-whiten" d="${MOLAR}" fill="#e3c27a" fill-opacity=".55"/>
      ${shine(id, "molar")}
    </g>
    ${sparkle(186, 58, 1.4, 0)}${sparkle(56, 80, 1, 0.5)}${sparkle(190, 176, 0.8, 1, "#2dd4bf")}${sparkle(48, 170, 0.7, 1.5)}`),

  veneer: (id) => frame(id, "Porcelain veneer illustration", `
    <g filter="url(#${id}-soft)"><path d="${INCISOR}" fill="#ecdcb8" stroke="#d1bd94" stroke-width="2"/></g>
    <path d="M110 70l6 8-4 8" fill="none" stroke="#b39a6c" stroke-width="2"/>
    <g class="a-slide"><path d="${INCISOR}" fill="url(#${id}-t)" fill-opacity=".97" stroke="#c4d5dc" stroke-width="2"/>${shine(id, "inc")}<path d="M104 56c8-4 16-5 22-4" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>
    ${sparkle(184, 60, 1.1, 0.3)}${sparkle(56, 160, 0.8, 1, "#2dd4bf")}`),

  smile: (id) => frame(id, "Smile makeover illustration", `
    <path d="M30 96q90-30 180 0q-10 96-90 100Q40 192 30 96z" fill="#b4314f"/>
    <path d="M36 98q84-26 168 0v10q-84-20-168 0z" fill="url(#${id}-gum)"/>
    ${upperRow(id, 100)}
    <path d="M58 160q62 40 124 0" fill="none" stroke="#e9a0b1" stroke-width="6" stroke-linecap="round" opacity=".6"/>
    <g clip-path="url(#${id}-sm)"><rect class="a-sweep" x="10" y="80" width="40" height="80" fill="url(#${id}-shine)" transform="skewX(-18)"/></g>
    <defs><clipPath id="${id}-sm"><rect x="40" y="100" width="160" height="56"/></clipPath></defs>
    ${sparkle(196, 66, 1.2, 0)}${sparkle(46, 66, 0.8, 0.6)}${sparkle(176, 196, 0.8, 1.2, "#2dd4bf")}`),

  braces: (id) => frame(id, "Orthodontic braces illustration", `
    <path d="M30 76q90-30 180 0v22H30z" fill="url(#${id}-gum)"/>
    <g class="a-align">${upperRow(id, 92)}</g>
    ${upperCenters().map((c) => `<rect x="${(c - 6).toFixed(1)}" y="112" width="12" height="11" rx="2.5" fill="url(#${id}-metal)" stroke="#7f95a3"/>`).join("")}
    <path class="a-dash" d="M14 118q106 8 212 0" fill="none" stroke="#5f7684" stroke-width="2.5" pathLength="1"/>
    ${sparkle(196, 168, 1, 0.3, "#2dd4bf")}${sparkle(46, 172, 0.8, 1)}`),

  aligner: (id) => frame(id, "Clear aligner being fitted over teeth", `
    <path d="M30 120q90-30 180 0v26H30z" fill="url(#${id}-gum)"/>
    ${upperRow(id, 136)}
    <g class="a-drop-soft"><path d="M18 128q102-26 204 0v34c0 18-8 26-18 26H36c-10 0-18-8-18-26z" fill="#e0f7fb" fill-opacity=".38" stroke="#22d3ee" stroke-width="2.5"/><path d="M34 140q86-18 172 0" fill="none" stroke="#fff" stroke-width="3" stroke-opacity=".9"/></g>
    ${sparkle(190, 60, 1.2, 0.2)}${sparkle(54, 70, 0.8, 0.8, "#2dd4bf")}`),
};

let counter = 0;
module.exports = function art(key, label) {
  counter += 1;
  const id = `a${counter}${key.slice(0, 3)}`;
  const fn = arts[key] || arts.hero;
  let svg = fn(id);
  if (label) svg = svg.replace(/aria-label="[^"]*"/, `aria-label="${label.replace(/"/g, "&quot;")}"`);
  return svg;
};
module.exports.MOLAR = MOLAR;
