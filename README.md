# Dr. Uppal's Dental Hub & Implant Center — Website

A fast static website built on the clinic's brand guide, with SEO and GEO (AI-search) optimisation and animation throughout.

**Brand:** deep burgundy `#6B1022`, antique gold `#C9A24B` (accents only), dark gold `#8A6416` (small gold text), ivory `#F6EFE3`, charcoal `#3A3633` on white. Playfair Display SemiBold for names and headings, Lato for body text.

## Pages
| Page | Path |
|---|---|
| Home: logo + shortcut buttons → intro → clinic photos → why patients choose us → location, map, call now & booking | `/` |
| About | `/about/` |
| Treatments (16 guides, each with procedure, aftercare & FAQs) | `/treatments/` |
| Prices (starting prices, what an implant price includes) | `/prices/` |
| Dentist in Pitampura (local page: directions, areas served) | `/dentist-in-pitampura/` |
| Patient guide | `/patient-guide/` |
| FAQs (searchable) | `/faq/` |
| Gallery (with lightbox) | `/gallery/` |
| Contact us | `/contact/` |
| Book a consultation (sends via WhatsApp or email) | `/book-consultation/` |

A floating **Book a consultation** button stays on screen on every page.

## ⚠️ Before going live
1. **Clinic photos:** put them in `src/assets/clinic/` using the file names in `src/config.js → gallery`: `reception.jpg`, `treatment-suite.jpg`, `sterilisation.jpg`, `consultation.jpg`, `waiting-lounge.jpg`, `imaging.jpg`, `clinic-exterior.jpg`. Landscape works best, around 1600px wide. Until a photo is added, that tile shows an illustrated placeholder.
2. **Details:** edit every `// TODO` in `src/config.js`: domain, phone, WhatsApp, street address, map query or coordinates, landmark and parking, doctor's full name, qualifications, Dental Council registration number, years in practice and implants placed, Google rating and review count, and social links.
3. **Prices:** in `src/config.js → prices`, set each `from` to your starting price in rupees (for example `35000`), set `pricesUpdated`, and add your implant brand and warranty to `implantIncludes`. Until a price is set, the page shows "On consultation".
4. Payment methods: `src/build.js`, search for `TODO: list payment methods`.
5. Run `npm run build`.

## Build & preview
```bash
npm run build      # writes the site to /docs
npm run serve      # http://localhost:8080
npm run images     # re-renders og-image.png & apple-touch-icon.png (needs Playwright)
```

## Deploy
The finished site is in `/docs`. To publish it:
- **GitHub Pages:** Settings → Pages → branch `main`, folder `/docs`.
- **Netlify, Vercel or Cloudflare Pages:** set the publish directory to `docs` and the build command to `npm run build`.

After launch:
- Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Keep the name, address, phone and hours identical on your Google Business Profile, Practo and Justdial.
