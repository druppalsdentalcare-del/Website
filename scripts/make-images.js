// Renders og-image.png (1200x630) and apple-touch-icon.png (180x180) into src/assets using Playwright.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const C = require("../src/config");
const art = require("../src/illustrations");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const css = fs.readFileSync(path.join(__dirname, "../src/assets/styles.css"), "utf8");
  const fonts = '<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap" rel="stylesheet">';
  await p.setContent(`<html><head>${fonts}<style>${css}
  body{margin:0;width:1200px;height:630px;overflow:hidden;background:#fff;display:flex;align-items:center;padding:0 90px;gap:30px;border-bottom:14px solid #6B1022}
  body::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 85% 40%,#F6EFE3,transparent 55%)}
  .art *{animation:none!important}.a-dash{stroke-dashoffset:0}.a-sweep,.a-whiten{opacity:0}
  .l{flex:1;position:relative}.logo-name{font-size:96px}.logo-tag{font-size:22px;margin-top:18px}.logo-diamond{width:26px;height:26px}
  .rule{width:110px;height:3px;margin:34px 0 26px}.l p{font-size:30px;color:#3A3633;margin:0;font-family:Lato}
  .r{width:420px;position:relative}</style></head>
  <body><div class="l"><span class="logo"><span class="logo-text"><span class="logo-name"><small>Dr.</small> Uppal’s</span><span class="logo-tag">Dental<i>·</i>Implant<i>·</i>Smile</span></span></span><span class="rule"></span><p>Dental &amp; implant care in ${C.address.locality}</p></div><div class="r">${art("hero")}</div></body></html>`);
  await p.waitForTimeout(2000);
  await p.screenshot({ path: path.join(__dirname, "../src/assets/og-image.png") });
  await p.setViewportSize({ width: 180, height: 180 });
  const fav = fs.readFileSync(path.join(__dirname, "../src/assets/favicon.svg"), "utf8");
  await p.setContent(`<html><head>${fonts}</head><body style="margin:0">${fav.replace("<svg", '<svg width="180" height="180"').replace('rx="14"', 'rx="0"')}</body></html>`);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: path.join(__dirname, "../src/assets/apple-touch-icon.png") });
  await b.close();
  console.log("images written");
})();
