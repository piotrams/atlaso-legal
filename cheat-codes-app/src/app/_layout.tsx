import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AdsProvider } from '../lib/ads';
import { CodesProvider } from '../lib/codes';
import { PremiumProvider } from '../lib/premium';
import { PrefsProvider } from '../lib/prefs';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PremiumProvider>
        <AdsProvider>
          <PrefsProvider>
            <CodesProvider>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: colors.bg },
                  headerTintColor: colors.text,
                  headerTitleStyle: { fontWeight: '800' },
                  contentStyle: { backgroundColor: colors.bg },
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="code/[id]" options={{ title: '' }} />
                <Stack.Screen name="premium" options={{ presentation: 'modal', headerShown: false }} />
              </Stack>
            </CodesProvider>
          </PrefsProvider>
        </AdsProvider>
      </PremiumProvider>
    </SafeAreaProvider>
  );
}
