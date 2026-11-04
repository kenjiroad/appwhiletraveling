// Public pages Apple requires for a subscription app (privacy policy and terms of use), also linked
// from the App Store listing. Source: docs/legal/index.html, hosted by Kenji (see docs/23-app-store.md).
// 🟡 Replace with the real address once the page is online.
export const LEGAL_URL = process.env.EXPO_PUBLIC_LEGAL_URL ?? 'https://debout-app.netlify.app';

export const PRIVACY_URL = `${LEGAL_URL}/#confidentialite`;
export const TERMS_URL = `${LEGAL_URL}/#conditions`;
export const SUPPORT_URL = `${LEGAL_URL}/#support`;
