/**
 * Everything you need to fill in before release lives in this file.
 * Search for "TODO" to find each value.
 */
import { Platform } from 'react-native';

export const APP_NAME = 'Cheat Vault';
export const GAME_NAME = 'GTA 6';

/** Links shown in Settings. Hosted from this repo (see ../cheats/). */
export const PRIVACY_URL = 'https://piotrams.github.io/atlaso-legal/cheats/privacy.html'; // TODO: confirm host
export const TERMS_URL = 'https://piotrams.github.io/atlaso-legal/cheats/terms.html'; // TODO: confirm host
export const SUPPORT_EMAIL = 'piotramsdigital@gmail.com';

/**
 * Remote codes file. The app ships with the bundled list in src/data/codes.ts,
 * then fetches this JSON on launch and uses it if its `version` is higher.
 * That lets you publish new codes without an App Store review.
 * Set to '' to disable.
 */
export const REMOTE_CODES_URL = 'https://piotrams.github.io/atlaso-legal/cheats/codes.json'; // TODO: confirm host

/* ---------------------------------------------------------------- Ads --- */

/**
 * Your real AdMob ad unit IDs. In development builds Google's test IDs are
 * always used, so you never click your own live ads. Leave a value empty and
 * that ad format is simply not shown in release builds.
 * The AdMob *app* IDs go in app.json (react-native-google-mobile-ads plugin).
 */
const AD_UNITS = {
  ios: {
    banner: '', // TODO: ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx
    interstitial: '', // TODO
  },
  android: {
    banner: '', // TODO
    interstitial: '', // TODO
  },
};

export const adUnits = Platform.OS === 'android' ? AD_UNITS.android : AD_UNITS.ios;

/** Show an interstitial on every Nth code opened… */
export const INTERSTITIAL_EVERY_N_OPENS = 4;
/** …but never more often than this. */
export const INTERSTITIAL_MIN_INTERVAL_MS = 90_000;

/* ----------------------------------------------------------- Premium --- */

/** RevenueCat public SDK keys (Project settings → API keys). Safe to ship. */
export const REVENUECAT_KEYS = {
  ios: '', // TODO: appl_xxxxxxxx
  android: '', // TODO: goog_xxxxxxxx
};

/** Entitlement identifier you create in RevenueCat and attach your product(s) to. */
export const PREMIUM_ENTITLEMENT = 'premium';
