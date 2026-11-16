/** Web stub (used only to preview the UI in a browser). Ads run on iOS/Android only. */
import { createContext, useContext, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { usePremium } from './premium';

const value = {
  adsActive: false,
  onCodeOpened: () => {},
  privacyOptionsRequired: false,
  showPrivacyOptions: async () => {},
};
const AdsContext = createContext(value);

export function AdsProvider({ children }: { children: ReactNode }) {
  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export const useAds = () => useContext(AdsContext);

/** Placeholder box so the layout shows where the banner sits. */
export function AdBanner() {
  const { isPremium } = usePremium();
  if (isPremium) return null;
  return (
    <View style={{ height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1d1b27' }}>
      <Text style={{ color: '#666', fontSize: 12 }}>Banner ad</Text>
    </View>
  );
}
