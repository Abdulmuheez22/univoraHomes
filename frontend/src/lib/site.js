/** Single source of truth for public contact details used across marketing pages. */
export const SITE_NAME = "Univora Homes";

export const SUPPORT_EMAIL = "univorahomes@gmail.com";
export const MAILTO_SUPPORT = `mailto:${SUPPORT_EMAIL}`;

export const WHATSAPP_DISPLAY = "0901 794 2879";
export const WHATSAPP_URL = "https://wa.me/2349017942879";

export const mailtoWithSubject = (subject) =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

/** Shared across the Terms of Service and Privacy Policy pages. Bump when either is revised. */
export const LEGAL_LAST_UPDATED = "12 October 2026";

export const LEGAL_JURISDICTION = "Federal Republic of Nigeria";
