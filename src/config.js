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
  siteUrl: "https://druppalsdentalcare-del.github.io/Website", // TODO: change to your own domain once you have one (no trailing slash)

  doctor: {
    name: "Dr. Uppal",                 // TODO: full name, e.g. "Dr. Firstname Uppal"
    qualifications: "BDS, MDS",        // TODO: exact degrees and specialisation
    title: "Founder & Lead Dentist",
    experienceYears: null,             // TODO: e.g. 15 — shown as a badge once filled in
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
    street: "[Street address, building], [Area / locality]", // TODO
    locality: "New Delhi",
    region: "Delhi",
    postalCode: "1100XX",              // TODO
    country: "IN",
  },
  areasServed: ["New Delhi", "South Delhi", "Central Delhi", "West Delhi", "Gurugram", "Noida"],
  geo: { lat: 28.6139, lng: 77.209 },  // TODO: exact clinic coordinates
  mapQuery: "Dr. Uppal's Dental Hub & Implant Center, New Delhi", // TODO: or your exact address
  googleReviewsLink: "",               // TODO: Google Business Profile reviews link

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
    { file: "clinic-exterior.jpg", caption: "Our clinic", note: "Easy to find in New Delhi", art: "exterior", size: "wide" },
  ],

  social: {
    instagram: "", // TODO e.g. https://instagram.com/druppalsdentalcare
    facebook: "",
    practo: "",
    googleBusiness: "",
  },
  priceRange: "₹₹",
  lastUpdated: "2026-11-08",
};
