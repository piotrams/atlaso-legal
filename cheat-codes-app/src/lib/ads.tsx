import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import mobileAds, {
  AdEventType,
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

import { adUnits, INTERSTITIAL_EVERY_N_OPENS, INTERSTITIAL_MIN_INTERVAL_MS } from '../config';
import { usePremium } from './premium';

const BANNER_ID = __DEV__ ? TestIds.ADAPTIVE_BANNER : adUnits.banner;
const INTERSTITIAL_ID = __DEV__ ? TestIds.INTERSTITIAL : adUnits.interstitial;

interface AdsState {
  /** Ads SDK initialised, consent gathered, and the user is not premium. */
  adsActive: boolean;
  /** Call when the user opens a code. Shows an interstitial every N opens. */
  onCodeOpened: () => void;
  /** True in regions (EEA/UK/…) where a "privacy choices" entry point is required. */
  privacyOptionsRequired: boolean;
  showPrivacyOptions: () => Promise<void>;
}

const AdsContext = createContext<AdsState | null>(null);

export function AdsProvider({ children }: { children: ReactNode }) {
  const { status } = usePremium();
  const [ready, setReady] = useState(false);
  const [privacyOptionsRequired, setPrivacyOptionsRequired] = useState(false);
  const interstitial = useRef<InterstitialAd | null>(null);
  const loaded = useRef(false);
  const opens = useRef(0);
  const lastShown = useRef(0);
  const started = useRef(false);

  // Initialise ads only once we know the user is NOT premium.
  useEffect(() => {
    if (status !== 'free' || started.current) return;
    started.current = true;
    (async () => {
      try {
        // 1. Google UMP consent (GDPR / US state privacy). Shows a form only where required.
        await AdsConsent.requestInfoUpdate();
        const info = await AdsConsent.loadAndShowConsentFormIfRequired();
        setPrivacyOptionsRequired(
          info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED,
        );
        if (!info.canRequestAds) return;
        // 2. iOS App Tracking Transparency prompt (after UMP, as Google recommends).
        if (Platform.OS === 'ios') await requestTrackingPermissionsAsync().catch(() => {});
        // 3. Start the SDK.
        await mobileAds().initialize();
        setReady(true);
      } catch (e) {
        console.warn('[ads] init failed', e);
      }
    })();
  }, [status]);

  // Keep one interstitial preloaded.
  useEffect(() => {
    if (!ready || !INTERSTITIAL_ID) return;
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_ID);
    interstitial.current = ad;
    const subs = [
      ad.addAdEventListener(AdEventType.LOADED, () => (loaded.current = true)),
      ad.addAdEventListener(AdEventType.CLOSED, () => {
        loaded.current = false;
        ad.load();
      }),
      ad.addAdEventListener(AdEventType.ERROR, () => {
        loaded.current = false;
        setTimeout(() => ad.load(), 30_000);
      }),
    ];
    ad.load();
    return () => subs.forEach((unsub) => unsub());
  }, [ready]);

  const adsActive = ready && status === 'free';

  const onCodeOpened = useCallback(() => {
    if (!adsActive) return;
    opens.current += 1;
    const due = opens.current % INTERSTITIAL_EVERY_N_OPENS === 0;
    const cooledDown = Date.now() - lastShown.current > INTERSTITIAL_MIN_INTERVAL_MS;
    if (due && cooledDown && loaded.current && interstitial.current) {
      lastShown.current = Date.now();
      interstitial.current.show().catch(() => {});
    }
  }, [adsActive]);

  const showPrivacyOptions = useCallback(async () => {
    try {
      await AdsConsent.showPrivacyOptionsForm();
    } catch {}
  }, []);

  return (
    <AdsContext.Provider value={{ adsActive, onCodeOpened, privacyOptionsRequired, showPrivacyOptions }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  const ctx = useContext(AdsContext);
  if (!ctx) throw new Error('useAds must be used inside AdsProvider');
  return ctx;
}

/** Anchored adaptive banner. Renders nothing for premium users. */
export function AdBanner() {
  const { adsActive } = useAds();
  if (!adsActive || !BANNER_ID) return null;
  return (
    <View style={{ alignItems: 'center' }}>
      <BannerAd unitId={BANNER_ID} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}
