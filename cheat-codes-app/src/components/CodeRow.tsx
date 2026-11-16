import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES, type CheatCode, type PlatformId } from '../data/types';
import { useAds } from '../lib/ads';
import { usePrefs } from '../lib/prefs';
import { colors, radius } from '../theme';
import { ButtonSequence } from './ButtonSequence';

export function CodeRow({ code, platform }: { code: CheatCode; platform: PlatformId }) {
  const { isFavorite, toggleFavorite } = usePrefs();
  const { onCodeOpened } = useAds();
  const input = code.inputs[platform];
  const cat = CATEGORIES.find((c) => c.id === code.category);
  const fav = isFavorite(code.id);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
      onPress={() => {
        onCodeOpened();
        router.push(`/code/${encodeURIComponent(code.id)}`);
      }}
    >
      <View style={styles.head}>
        <Text style={styles.icon}>{cat?.icon}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {code.name}
        </Text>
        {code.isNew && <Text style={styles.new}>NEW</Text>}
        <Pressable hitSlop={12} onPress={() => toggleFavorite(code.id)}>
          <Text style={[styles.star, fav && { color: colors.gold }]}>{fav ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      {input ? (
        <ButtonSequence platform={platform} input={input} size="sm" />
      ) : (
        <Text style={styles.na}>Not available on this platform</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
  name: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '700' },
  new: {
    color: colors.bg,
    backgroundColor: colors.accent,
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  star: { fontSize: 22, color: colors.textDim },
  na: { color: colors.textDim, fontStyle: 'italic' },
});
