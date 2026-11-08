// Renders og-image.png (1200x630) and apple-touch-icon.png (180x180) into src/assets using Playwright.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const C = require("../src/config");
const art = require("../src/illustrations");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const fav = fs.readFileSync(path.join(__dirname, "../src/assets/favicon.svg"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "../src/assets/styles.css"), "utf8");
  await p.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet"><style>${css}
  body{margin:0;width:1200px;height:630px;overflow:hidden;background:linear-gradient(135deg,#f2fbf9,#dff1ee);display:flex;align-items:center;padding:0 80px;gap:40px;font-family:'Plus Jakarta Sans',sans-serif}
  .art *{animation:none!important}.a-dash{stroke-dashoffset:0}.a-sweep,.a-whiten{opacity:0}
  .l{flex:1}.l h1{font-family:Fraunces,serif;font-size:76px;line-height:1.02;color:#0b2b36;margin:24px 0 18px;font-weight:500}.l h1 em{color:#0e7c86}
  .l p{font-size:26px;color:#33505b;margin:0}.f{width:72px}.r{width:430px}</style></head>
  <body><div class="l"><div class="f">${fav}</div><h1>${C.name.replace("Dental Care", "<em>Dental Care</em>")}</h1><p>${C.tagline}</p></div><div class="r">${art("hero")}</div></body></html>`);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(__dirname, "../src/assets/og-image.png") });
  await p.setViewportSize({ width: 180, height: 180 });
  await p.setContent(`<html><body style="margin:0">${fav.replace("<svg", '<svg width="180" height="180"').replace('rx="12"', 'rx="0"')}</body></html>`);
  await p.screenshot({ path: path.join(__dirname, "../src/assets/apple-touch-icon.png") });
  await b.close();
  console.log("images written");
})();
