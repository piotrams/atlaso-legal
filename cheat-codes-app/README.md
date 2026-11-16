# Cheat Vault: GTA 6 cheat codes app

Expo (React Native) app for iOS and Android. Free with ads (Google AdMob), and a Premium purchase (RevenueCat) removes them.

## What's in it
- **Codes tab**: platform picker (PS5 / Xbox / PC / in-game phone), search, category filter, button sequences drawn as controller glyphs, star to favorite.
- **Code detail**: inputs for every platform, a copy button, and a warning line (e.g. "disables achievements").
- **Favorites** and **Settings** tabs (remove ads, restore purchases, ad privacy choices, legal links, unofficial-guide disclaimer).
- **Ads**: an anchored adaptive banner on every screen, plus an interstitial on every 4th code opened (at most once per 90 s). Google UMP consent → iOS ATT prompt → SDK init. Premium users never start the ad SDK.
- **Remote codes**: on launch the app fetches `../cheats/codes.json` (GitHub Pages) and uses it if its `version` is higher than the bundled one. You can publish new codes **without an app update**.

## Adding codes (when they're out)
Edit `../cheats/codes.json` (remote) and/or `src/data/codes.ts` (bundled), and **bump `version`**:
```json
{ "version": 1, "updatedAt": "2026-11-20", "codes": [
  { "id": "max-armor", "name": "Max health & armor", "category": "player",
    "inputs": { "ps": "CIRCLE L1 TRIANGLE R2 CROSS SQUARE CIRCLE RIGHT",
                "xbox": "B LB Y RT A X B RIGHT", "pc": "TURTLE", "phone": "1-999-887-853" },
    "warning": "Disables trophies/achievements", "isNew": true } ] }
```
Tokens: PS `TRIANGLE CIRCLE CROSS SQUARE L1 L2 L3 R1 R2 R3`, Xbox `A B X Y LB LT LS RB RT RS`, and both use `UP DOWN LEFT RIGHT`. Categories: `player weapons vehicles world fun`. Never change an `id` once shipped, because favorites use it.

Dev builds show fake sample codes while the list is empty. Release builds never do.

## Before release: fill in
1. `src/config.ts`: AdMob ad unit IDs, RevenueCat public keys, and check the URLs.
2. `app.json`: the real AdMob **app** IDs (the current ones are Google's test IDs), `bundleIdentifier`/`package`, name, icon and splash.
3. RevenueCat: create the entitlement `premium`, attach your product (e.g. a non-consumable "Remove ads" lifetime purchase), and add it to the current offering.
4. AdMob: set up the GDPR + US-states privacy messages (Privacy & messaging), and add `app-ads.txt` to your developer website.
5. App Store privacy labels: declare advertising data, identifiers and coarse location (via AdMob), plus purchases (via RevenueCat).

## Run
Ads and purchases are native modules, so **Expo Go won't work**. Use a development build:
```bash
npm install
npx eas-cli@latest build --profile development --platform ios   # or android
npx expo start --dev-client
```
`npx expo start --web` previews the UI only (ads are stubbed).

## App icon
Original artwork (neon vault dial + D-pad), no game assets. Source: `assets/source/icon.svg`. Edit `scripts/make-icons.js` and run `node scripts/make-icons.js assets` to regenerate every size.

## Store review note
Apple and Google often reject apps that use a game's trademark as the app name or show its logo or art. Keep the brand ("Cheat Vault"), mention the game only descriptively (e.g. subtitle "Codes for GTA 6"), use no Rockstar artwork, and keep the in-app disclaimer.
