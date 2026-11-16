import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_NAME, GAME_NAME, PRIVACY_URL, SUPPORT_EMAIL, TERMS_URL } from '../../config';
import { useAds } from '../../lib/ads';
import { usePremium } from '../../lib/premium';
import { colors, radius } from '../../theme';

function Row({ label, onPress, detail }: { label: string; onPress: () => void; detail?: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      {detail ? <Text style={styles.rowDetail}>{detail}</Text> : <Text style={styles.chev}>›</Text>}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { isPremium, restore, configured } = usePremium();
  const { privacyOptionsRequired, showPrivacyOptions } = useAds();

  const onRestore = async () => {
    if (!configured) return Alert.alert('Purchases are not set up yet.');
    const ok = await restore();
    Alert.alert(ok ? 'Premium restored' : 'No previous purchase found');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.group}>
          {isPremium ? (
            <Row label="Premium" detail="Active ✓" onPress={() => {}} />
          ) : (
            <Row label="⭐ Remove ads" onPress={() => router.push('/premium')} />
          )}
          <Row label="Restore purchases" onPress={onRestore} />
          {privacyOptionsRequired && <Row label="Ad privacy choices" onPress={showPrivacyOptions} />}
        </View>

        <View style={styles.group}>
          <Row label="Privacy policy" onPress={() => Linking.openURL(PRIVACY_URL)} />
          <Row label="Terms of use" onPress={() => Linking.openURL(TERMS_URL)} />
          <Row label="Contact support" onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} />
        </View>

        <Text style={styles.disclaimer}>
          {APP_NAME} is an unofficial fan guide. It is not affiliated with, endorsed or sponsored by Rockstar Games or
          Take-Two Interactive. {GAME_NAME} and related names are trademarks of their respective owners. Using cheats may
          disable trophies/achievements or saving.
        </Text>
        <Text style={styles.version}>Version {Constants.expoConfig?.version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 20 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', paddingTop: 8 },
  group: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: { color: colors.text, fontSize: 16, fontWeight: '600' },
  rowDetail: { color: colors.accent2, fontWeight: '700' },
  chev: { color: colors.textDim, fontSize: 22 },
  disclaimer: { color: colors.textDim, fontSize: 12, lineHeight: 18 },
  version: { color: colors.textDim, fontSize: 12, textAlign: 'center' },
});
