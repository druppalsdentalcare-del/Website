# Dr. Uppal's Dental Care — Website

A fast, SEO- and GEO-optimised static website for the clinic: 23 pages, no frameworks, no tracking, with animated custom illustrations for every procedure.

## What's included
| Page | Path |
|---|---|
| Home (hero, treatments, why us, doctor, whitening before/after slider, visit steps, FAQs, map) | `/` |
| About (doctor, values, sterilisation protocol, technology) | `/about/` |
| Treatments hub with category filter | `/treatments/` |
| 16 treatment guides (overview, signs, step-by-step procedure, benefits, aftercare, FAQs) | `/treatments/<slug>/` |
| Searchable FAQ centre (~90 answers) | `/faq/` |
| Book appointment (sends the request via WhatsApp or email) | `/book-appointment/` |
| Contact & directions | `/contact/` |

**SEO:** unique titles/descriptions, canonical URLs, Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`, and schema.org JSON-LD: `Dentist` (LocalBusiness), `Person`, `MedicalWebPage` + `MedicalProcedure`, `FAQPage`, `BreadcrumbList`.
**GEO (AI answer engines):** answer-first summaries and "key facts" on every treatment page, "medically reviewed by" with date, `llms.txt`, and AI crawlers explicitly allowed in `robots.txt`.

## ⚠️ Before going live — fill in your details
Edit **`src/config.js`** (every `// TODO`): domain, doctor's full name, qualifications and registration number, phone, WhatsApp, address, city, map coordinates, Google Maps embed and reviews link, opening hours, stats and social links. Then rebuild.

The city name is used in page titles and headings, so filling it in matters a lot for local search.

## Editing content
- Treatments & their FAQs: `src/treatments.js`
- General FAQs: `src/faqs.js`
- Illustrations: `src/illustrations.js`
- Styles / animations: `src/assets/styles.css`, `src/assets/main.js`

## Build & preview
```bash
npm run build      # writes the site to /docs
npm run serve      # http://localhost:8080
npm run images     # re-renders og-image.png & apple-touch-icon.png (needs Playwright)
```

## Deploy
The finished site lives in `/docs`.
- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / `docs`. Add your custom domain there.
- **Netlify / Vercel / Cloudflare Pages:** publish directory `docs`, build command `npm run build`.

After launch, submit `sitemap.xml` in Google Search Console and create/verify your **Google Business Profile** with the same name, address and phone as `config.js`. That is the most important local-SEO step.

## Recommended next steps
- Add real photos of the clinic, team and (with consent) before/after cases. Real photos build more trust than stock images.
- Link your real Google reviews (`googleReviewsLink`).
