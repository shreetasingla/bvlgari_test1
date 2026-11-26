# BVLGARI ETERNAL — Digital Product Passport

Native cross-platform mobile application (iOS & Android) built with React Native, Expo, TypeScript, SafeAreaView, native CoreNFC / Android NFC (`react-native-nfc-manager`), and native QR camera scanning (`expo-camera`).

## Brand & Design System
- **Primary Brand Green:** Deep Emerald (`#0A3622`)
- **Background Surface:** Warm Ivory Cream (`#FAF8F5`)
- **Secondary Card:** Matte Obsidian (`#141414`)
- **Accent Metal:** Brushed Champagne Gold (`#C5A059`)
- **Typography:** Roman Serif (`Cinzel` & `Playfair Display`) paired with `Plus Jakarta Sans`

## Architecture
- `App.tsx` — Font loader (`Cinzel`, `Playfair Display`, `Plus Jakarta Sans`), `SafeAreaProvider`, and animated transition between the NFC/QR Launcher and the 5-tab Passport.
- `src/screens/LauncherScreen.tsx` — Screen 1 featuring pulsing gold NFC beacon over the custom SVG Serpenti snakehead clasp, compatibility badge, NFC tap workflow, and camera QR scanner modal.
- `src/components/PersistentHeader.tsx` — Centered BVLGARI header, Aura Consortium subtitle, Wallet export trigger, and compact hero product summary card.
- `src/navigation/PassportNavigator.tsx` — Responsive 5-tab bottom navigator (`Profile & Cert`, `Origin`, `Impact`, `Logbook`, `VIP Spa`) with `SafeAreaView` support for all iPhone & Android screen dimensions.
- `src/screens/tabs/` — All 5 Digital Product Passport screens.
- `src/services/hardwareScanner.ts` — Native CoreNFC / Android NFC reader integration with automatic simulator/Expo Go fallback.
- `preview/index.html` — Zero-dependency interactive mobile simulator preview that can be opened directly in any browser.

## Running on iOS & Android
1. Install Node.js (v20+) and dependencies:
   ```bash
   npm install
   ```
2. Start Expo (for Expo Go / QR preview):
   ```bash
   npx expo start
   ```
3. Build native iOS & Android installers from this single codebase:
   - **Cloud build for both platforms (no Xcode / Android Studio required):**
     ```bash
     npm install -g eas-cli
     eas login
     eas build --platform all --profile preview
     ```
   - **Local native builds:**
     ```bash
     npx expo prebuild
     npx expo run:ios
     npx expo run:android
     ```
# bvlgari_test1
