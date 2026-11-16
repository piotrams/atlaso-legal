import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PurchasesPackage } from 'react-native-purchases';

import { usePremium } from '../lib/premium';
import { colors, radius } from '../theme';

const PERKS = ['No banner ads', 'No full-screen ads', 'Support future updates & new codes'];

function packageTitle(pkg: PurchasesPackage) {
  switch (pkg.packageType) {
    case 'LIFETIME':
      return 'Lifetime';
    case 'ANNUAL':
      return 'Yearly';
    case 'MONTHLY':
      return 'Monthly';
    case 'WEEKLY':
      return 'Weekly';
    default:
      return pkg.product.title;
  }
}

export default function PremiumScreen() {
  const { packages, purchase, restore, configured, isPremium } = usePremium();
  const [busy, setBusy] = useState<string | null>(null);

  const buy = async (pkg: PurchasesPackage) => {
    setBusy(pkg.identifier);
    const result = await purchase(pkg);
    setBusy(null);
    if (result === 'success') router.back();
    else if (result === 'error') Alert.alert('Purchase failed', 'Please try again.');
  };

  const onRestore = async () => {
    setBusy('restore');
    const ok = await restore();
    setBusy(null);
    if (ok) router.back();
    else Alert.alert('No previous purchase found');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable style={styles.close} onPress={() => router.back()} hitSlop={12}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={styles.badge}>⭐</Text>
        <Text style={styles.title}>Go Premium</Text>
        <Text style={styles.subtitle}>Every cheat, zero interruptions.</Text>
      </View>

      <View style={styles.perks}>
        {PERKS.map((p) => (
          <Text key={p} style={styles.perk}>
            ✓ {p}
          </Text>
        ))}
      </View>

      <View style={styles.buy}>
        {isPremium ? (
          <Text style={styles.note}>You already have Premium. Thanks!</Text>
        ) : !configured ? (
          <Text style={styles.note}>Purchases aren’t configured yet (add RevenueCat keys in src/config.ts).</Text>
        ) : packages.length === 0 ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          packages.map((pkg) => (
            <Pressable key={pkg.identifier} style={styles.pkg} onPress={() => buy(pkg)} disabled={!!busy}>
              {busy === pkg.identifier ? (
                <ActivityIndicator color={colors.bg} />
              ) : (
                <>
                  <Text style={styles.pkgTitle}>{packageTitle(pkg)}</Text>
                  <Text style={styles.pkgPrice}>{pkg.product.priceString}</Text>
                </>
              )}
            </Pressable>
          ))
        )}
        <Pressable onPress={onRestore} disabled={!!busy || !configured}>
          <Text style={styles.restore}>{busy === 'restore' ? 'Restoring…' : 'Restore purchases'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: 'space-between' },
  close: { alignSelf: 'flex-end' },
  closeText: { color: colors.textDim, fontSize: 22 },
  hero: { alignItems: 'center', gap: 6 },
  badge: { fontSize: 64 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900' },
  subtitle: { color: colors.textDim, fontSize: 17 },
  perks: { gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 20 },
  perk: { color: colors.text, fontSize: 17, fontWeight: '600' },
  buy: { gap: 12 },
  pkg: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
  },
  pkgTitle: { color: colors.bg, fontWeight: '900', fontSize: 17 },
  pkgPrice: { color: colors.bg, fontWeight: '900', fontSize: 17 },
  note: { color: colors.textDim, textAlign: 'center' },
  restore: { color: colors.textDim, textAlign: 'center', padding: 8, textDecorationLine: 'underline' },
});
