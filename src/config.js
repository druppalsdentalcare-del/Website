/**
 * CLINIC CONFIGURATION
 * --------------------------------------------------------------
 * Everything marked  // TODO  is a placeholder. Replace it with your
 * real details, then run `npm run build`. These values feed the page
 * text, Google structured data (local SEO), sitemap and llms.txt.
 */
module.exports = {
  name: "Dr. Uppal's Dental Care",
  shortName: "Dr. Uppal's",
  tagline: "Gentle, modern dentistry for the whole family",
  siteUrl: "https://www.druppalsdentalcare.com", // TODO: your live domain (no trailing slash)

  doctor: {
    name: "Dr. Uppal",                 // TODO: full name, e.g. "Dr. Firstname Uppal"
    qualifications: "BDS, MDS",        // TODO: exact degrees
    title: "Founder & Chief Dental Surgeon",
    experienceYears: 15,               // TODO
    registration: "Registered with the State Dental Council", // TODO: reg. no.
    bio: "Dr. Uppal founded the clinic with a simple belief: every patient deserves dentistry that is honest, painless and explained clearly. With advanced training in restorative and cosmetic dentistry, Dr. Uppal combines clinical precision with a calm, unhurried chairside manner — so whether you are here for a routine check-up or a complete smile makeover, you always know what is happening and why.", // TODO: personalise
  },

  phone: "+91 98765 43210",            // TODO
  phoneRaw: "+919876543210",           // TODO: same number, digits only with country code
  whatsapp: "919876543210",            // TODO: WhatsApp number, digits only
  email: "druppalsdentalcare@gmail.com",

  address: {
    street: "Clinic address line",     // TODO
    locality: "Your City",             // TODO
    region: "Your State",              // TODO
    postalCode: "000000",              // TODO
    country: "IN",
  },
  geo: { lat: 28.6139, lng: 77.209 },  // TODO: clinic map coordinates
  mapEmbed: "https://www.google.com/maps?q=Dr.+Uppal%27s+Dental+Care&output=embed", // TODO: Google Maps embed URL
  mapLink: "https://maps.google.com/?q=Dr.+Uppal%27s+Dental+Care",                 // TODO
  googleReviewsLink: "https://maps.google.com/?q=Dr.+Uppal%27s+Dental+Care",       // TODO

  hours: [
    { days: "Monday – Saturday", open: "10:00", close: "20:00", schema: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] },
    { days: "Sunday", open: "By appointment", close: "", schema: [] },
  ], // TODO

  stats: [
    { value: 15, suffix: "+", label: "Years of experience" },       // TODO
    { value: 10000, suffix: "+", label: "Smiles treated" },          // TODO
    { value: 16, suffix: "", label: "Specialised treatments" },
    { value: 100, suffix: "%", label: "Sterilisation compliance" },
  ],

  social: {
    instagram: "", // TODO e.g. https://instagram.com/druppalsdentalcare
    facebook: "",
    youtube: "",
  },
  priceRange: "₹₹",
  lastUpdated: "2026-11-08",
};
