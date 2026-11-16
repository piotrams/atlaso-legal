import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ButtonSequence } from '../../components/ButtonSequence';
import { CATEGORIES, PLATFORMS } from '../../data/types';
import { AdBanner } from '../../lib/ads';
import { useCodes } from '../../lib/codes';
import { usePrefs } from '../../lib/prefs';
import { colors, radius } from '../../theme';

export default function CodeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { codes } = useCodes();
  const { platform, isFavorite, toggleFavorite } = usePrefs();
  const [copied, setCopied] = useState<string | null>(null);
  const code = codes.find((c) => c.id === id);

  if (!code) {
    return (
      <View style={styles.screen}>
        <Text style={styles.missing}>This cheat is no longer available.</Text>
      </View>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === code.category);
  const fav = isFavorite(code.id);
  // Selected platform first, then the others that have this cheat.
  const platforms = [...PLATFORMS].sort((a, b) => Number(b.id === platform) - Number(a.id === platform)).filter((p) => code.inputs[p.id]);

  const copy = async (pid: string, text: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCopied(pid);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable hitSlop={12} onPress={() => toggleFavorite(code.id)}>
              <Text style={{ fontSize: 24, color: fav ? colors.gold : colors.textDim }}>{fav ? '★' : '☆'}</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.cat}>
          {cat?.icon} {cat?.label.toUpperCase()}
        </Text>
        <Text style={styles.name}>{code.name}</Text>
        {code.description && <Text style={styles.desc}>{code.description}</Text>}
        {code.warning && <Text style={styles.warning}>⚠️ {code.warning}</Text>}

        {platforms.map((p) => {
          const input = code.inputs[p.id]!;
          return (
            <View key={p.id} style={[styles.card, p.id === platform && styles.cardActive]}>
              <View style={styles.cardHead}>
                <Text style={styles.platform}>{p.label}</Text>
                <Pressable onPress={() => copy(p.id, input)} hitSlop={8}>
                  <Text style={styles.copy}>{copied === p.id ? 'Copied ✓' : 'Copy'}</Text>
                </Pressable>
              </View>
              <ButtonSequence platform={p.id} input={input} />
            </View>
          );
        })}
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14 },
  missing: { color: colors.textDim, textAlign: 'center', marginTop: 60 },
  cat: { color: colors.accent2, fontWeight: '800', letterSpacing: 1.5, fontSize: 12 },
  name: { color: colors.text, fontSize: 28, fontWeight: '900' },
  desc: { color: colors.textDim, fontSize: 16, lineHeight: 23 },
  warning: {
    color: colors.gold,
    backgroundColor: '#2A2312',
    padding: 12,
    borderRadius: radius.sm,
    overflow: 'hidden',
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14,
  },
  cardActive: { borderColor: colors.accent },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  platform: { color: colors.text, fontWeight: '800', fontSize: 16 },
  copy: { color: colors.accent, fontWeight: '800' },
});
