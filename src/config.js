/**
 * CLINIC CONFIGURATION
 * --------------------------------------------------------------
 * Everything marked  // TODO  is still a placeholder. Replace it with
 * your real details, then run `npm run build`. These values feed the
 * page text, Google structured data (local SEO), sitemap and llms.txt.
 */
module.exports = {
  name: "Dr. Uppal's Dental Hub & Implant Center",
  shortName: "Dr. Uppal's",
  tagline: "Dental · Implant · Smile",
  localArea: "Pitampura, Delhi",       // shown in headings and page titles, e.g. "Dental Implants in Pitampura, Delhi"
  siteUrl: "https://druppalsdentalcare-del.github.io/Website", // TODO: change to your own domain once you have one (no trailing slash)

  doctor: {
    name: "Dr. Uppal",                 // TODO: full name, e.g. "Dr. Firstname Uppal"
    qualifications: "BDS, MDS",        // TODO: exact degrees and specialisation
    title: "Founder & Lead Dentist",
    experienceYears: null,             // TODO: e.g. 15 — shown as a badge once filled in
    implantsPlaced: null,              // TODO: e.g. 2000 — shown on the home page once filled in
    registration: "Dental Council registration no. [to be added]", // TODO
    bio: [
      "Dr. Uppal founded Dr. Uppal's Dental Hub & Implant Center to offer the kind of dentistry they would want for their own family: unhurried, honest and planned in detail. The clinical focus is dental implants and full-mouth rehabilitation, alongside cosmetic and general dentistry.",
      "Every treatment plan is explained in plain language, with the options, the trade-offs and the costs set out before anything begins.",
    ], // TODO: add training, years in practice, memberships, special interests
  },

  phone: "+91 00000 00000",            // TODO
  phoneRaw: "+910000000000",           // TODO: same number, digits with country code
  whatsapp: "910000000000",            // TODO: WhatsApp number, digits only
  email: "druppalsdentalcare@gmail.com",

  address: {
    street: "[Building and street], Rani Bagh", // TODO: building and street
    locality: "Pitampura, New Delhi",
    region: "Delhi",
    postalCode: "110034",
    country: "IN",
  },
  areasServed: ["Pitampura", "Rani Bagh", "Shalimar Bagh", "Netaji Subhash Place", "Ashok Vihar", "Punjabi Bagh", "Model Town", "Rohini"],
  geo: null,                           // TODO: exact clinic coordinates once listed on Google Maps, e.g. { lat: 28.69, lng: 77.13 }
  mapQuery: "Rani Bagh, Pitampura, New Delhi 110034", // TODO: your exact address or Google listing name
  // Directions shown on the "Dentist in Pitampura" page (left blank = line hidden)
  landmark: "",                        // TODO: e.g. "Opposite ..."
  parking: "",                         // TODO: e.g. "Free parking in front of the clinic"
  googleReviewsLink: "",               // TODO: Google Business Profile reviews link
  googleRating: null,                  // TODO: e.g. 4.9 — the rating box appears once this and the count are filled in
  googleReviewCount: null,             // TODO: e.g. 120

  /**
   * STARTING PRICES — shown on /prices/ and on matching treatment pages.
   * Leave `from` as null to show "Price on consultation". Use whole rupees, e.g. 35000.
   * `slug` links a price to its treatment page.
   */
  pricesUpdated: "",                   // TODO: e.g. "November 2026" — shown on the price page
  prices: [
    { name: "Consultation and examination", note: "Includes a written treatment plan", from: null },
    { name: "Digital X-ray (single tooth)", note: "", from: null },
    { name: "3D CBCT scan", note: "Needed for most implant plans", from: null },
    { name: "Scaling and polishing", note: "Both jaws", from: null, slug: "dental-checkup-and-cleaning" },
    { name: "Tooth-coloured filling", note: "Per tooth", from: null, slug: "tooth-fillings" },
    { name: "Root canal treatment", note: "Per tooth, crown priced separately", from: null, slug: "root-canal-treatment" },
    { name: "Ceramic (zirconia) crown", note: "Per tooth", from: null, slug: "dental-crowns-and-bridges" },
    { name: "Single dental implant with ceramic crown", note: "Implant, abutment and crown", from: null, slug: "dental-implants" },
    { name: "Full-arch fixed teeth (All-on-4 or All-on-6)", note: "Per jaw, including temporary teeth", from: null, slug: "full-mouth-rehabilitation" },
    { name: "Bone graft or sinus lift", note: "Only if your scan shows it is needed", from: null },
    { name: "Professional teeth whitening", note: "In-clinic session", from: null, slug: "teeth-whitening" },
    { name: "Porcelain veneer", note: "Per tooth", from: null, slug: "dental-veneers" },
    { name: "Braces", note: "Full course", from: null, slug: "braces" },
    { name: "Clear aligners", note: "Full course", from: null, slug: "clear-aligners" },
  ],
  implantIncludes: [
    "The implant, its abutment and a custom ceramic crown",
    "Placement under local anaesthesia, planned on a 3D scan",
    "Follow-up checks while the implant heals",
    // TODO: add the implant system/brand and your warranty, e.g. "Osstem implant with a 5-year warranty"
  ],

  // days: 0 = Sunday … 6 = Saturday. Used for the live "Open now" badge.
  hours: [
    { days: "Monday to Saturday", open: "10:00", close: "20:00", label: "10:00 am to 8:00 pm", dayNums: [1, 2, 3, 4, 5, 6], schema: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
    { days: "Sunday", open: "", close: "", label: "By appointment", dayNums: [], schema: [] },
  ], // TODO: confirm

  /**
   * CLINIC PHOTOS — put your photos in  src/assets/clinic/  using these
   * file names (JPG or WebP, ~1600px wide). Until a photo exists, an
   * elegant illustrated placeholder is shown in its place.
   */
  gallery: [
    { file: "reception.jpg", caption: "Reception", note: "A calm, welcoming arrival", art: "reception", size: "wide" },
    { file: "treatment-suite.jpg", caption: "Treatment suite", note: "Modern, comfortable dental chairs", art: "chair", size: "tall" },
    { file: "sterilisation.jpg", caption: "Sterilisation room", note: "Class B autoclave, sealed pouches", art: "steri", size: "tall" },
    { file: "consultation.jpg", caption: "Consultation room", note: "Time to talk through your plan", art: "consult" },
    { file: "waiting-lounge.jpg", caption: "Waiting lounge", note: "Relax before your visit", art: "lounge" },
    { file: "imaging.jpg", caption: "Digital imaging", note: "Low-dose digital X-rays & scans", art: "xray", size: "wide" },
    { file: "clinic-exterior.jpg", caption: "Our clinic", note: "Easy to find in Rani Bagh, Pitampura", art: "exterior", size: "wide" },
  ],

  social: {
    instagram: "", // TODO e.g. https://instagram.com/druppalsdentalcare
    facebook: "",
    practo: "",
    googleBusiness: "",
  },
  priceRange: "₹₹",
  lastUpdated: "2026-11-17",
};
