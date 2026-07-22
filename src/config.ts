/**
 * ─────────────────────────────────────────────────────────────
 *  NATURECRAFTS · SITE CONFIG
 *  This is the ONLY file you need to edit.
 * ─────────────────────────────────────────────────────────────
 *
 *  SCRIPT_URL → set in the .env file (see .env.example / README).
 *
 *  While SCRIPT_URL is empty, the site runs in DEMO MODE:
 *  sample products are shown and orders are simulated locally,
 *  so you can preview everything before connecting the backend.
 */

export const CONFIG = {
  // Paste your Apps Script Web App URL between the quotes below.
  // (Optional: a VITE_SCRIPT_URL in a .env file overrides this — handy
  // if you later upload the code publicly and want the URL kept out.)
  SCRIPT_URL: (import.meta.env.VITE_SCRIPT_URL as string) || "",

  BRAND: "NatureCrafts",
  TAGLINE: "Devoted to Nature",
  ORDER_EMAIL: "naturecraftsnc.05@gmail.com",

  /** Currency symbol shown across the site */
  CURRENCY: "₹",

  /** Days added to the order date for the expected-delivery estimate */
  DELIVERY_DAYS: 7,
};
