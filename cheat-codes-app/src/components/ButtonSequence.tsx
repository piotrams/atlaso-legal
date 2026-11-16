import { Platform, StyleSheet, Text, View } from 'react-native';

import type { PlatformId } from '../data/types';
import { colors } from '../theme';

type Glyph = { label: string; color: string; round: boolean };

const ARROWS: Record<string, string> = { UP: '↑', DOWN: '↓', LEFT: '←', RIGHT: '→' };

const PS: Record<string, Glyph> = {
  TRIANGLE: { label: '△', color: '#3DDC97', round: true },
  CIRCLE: { label: '○', color: '#FF5C5C', round: true },
  CROSS: { label: '✕', color: '#6EA8FF', round: true },
  X: { label: '✕', color: '#6EA8FF', round: true },
  SQUARE: { label: '□', color: '#F08CD0', round: true },
};

const XBOX: Record<string, Glyph> = {
  A: { label: 'A', color: '#5BC236', round: true },
  B: { label: 'B', color: '#E8423B', round: true },
  X: { label: 'X', color: '#3A8DDE', round: true },
  Y: { label: 'Y', color: '#F5C518', round: true },
};

function glyphFor(platform: PlatformId, raw: string): Glyph {
  const t = raw.toUpperCase();
  if (ARROWS[t]) return { label: ARROWS[t], color: colors.text, round: false };
  const face = platform === 'ps' ? PS[t] : platform === 'xbox' ? XBOX[t] : undefined;
  if (face) return face;
  return { label: t, color: colors.textDim, round: false }; // shoulders, triggers, sticks
}

export function ButtonSequence({ platform, input, size = 'md' }: { platform: PlatformId; input: string; size?: 'sm' | 'md' }) {
  // PC / phone cheats are typed text, not button presses.
  if (platform === 'pc' || platform === 'phone') {
    return <Text style={[styles.typed, size === 'sm' && styles.typedSm]}>{input}</Text>;
  }
  const dim = size === 'sm' ? 26 : 38;
  return (
    <View style={styles.row}>
      {input
        .trim()
        .split(/\s+/)
        .map((tok, i) => {
          const g = glyphFor(platform, tok);
          return (
            <View
              key={i}
              style={[
                styles.btn,
                { height: dim, minWidth: dim, borderRadius: g.round ? dim / 2 : 8, borderColor: g.color },
              ]}
            >
              <Text style={[styles.btnText, { color: g.color, fontSize: size === 'sm' ? 12 : 16 }]}>{g.label}</Text>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  btn: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: colors.surfaceHi,
  },
  btnText: { fontWeight: '800' },
  typed: {
    color: colors.accent2,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.5,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  typedSm: { fontSize: 14 },
});
