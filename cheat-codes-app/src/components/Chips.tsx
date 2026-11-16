import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors } from '../theme';

export function Chips<T extends string>({
  items,
  value,
  onChange,
  accent = colors.accent,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  accent?: string;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <Pressable
            key={it.id}
            onPress={() => onChange(it.id)}
            style={[styles.chip, on && { backgroundColor: accent, borderColor: accent }]}
          >
            <Text style={[styles.text, on && { color: colors.bg }]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingHorizontal: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  text: { color: colors.text, fontWeight: '700', fontSize: 14 },
});
