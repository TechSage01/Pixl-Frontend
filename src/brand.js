// One place for the product name. Change it here and the UI follows.
export const BRAND = {
  name: "Kartly",
  tagline: "Buy safe. Sell easy.",
  year: 2026,
  paymentsLive: true, // set to true when real payments go live; this removes every "sandbox" notice
  supportEmail: "", // add a real support address here to show "Contact Support" in the footer
};

// Shown in footers and on the listing page while payments are not live.
export const PAYMENT_NOTICE = BRAND.paymentsLive ? "" : "Payments run in a sandbox and no real money moves.";