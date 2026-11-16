import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chips } from '../../components/Chips';
import { CodeRow } from '../../components/CodeRow';
import { APP_NAME, GAME_NAME } from '../../config';
import { CATEGORIES, PLATFORMS, type CategoryId } from '../../data/types';
import { AdBanner } from '../../lib/ads';
import { useCodes } from '../../lib/codes';
import { usePremium } from '../../lib/premium';
import { usePrefs } from '../../lib/prefs';
import { colors, radius } from '../../theme';

type Filter = 'all' | CategoryId;

export default function CodesScreen() {
  const { codes, isSample, refreshing, refresh } = useCodes();
  const { platform, setPlatform } = usePrefs();
  const { isPremium } = usePremium();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return codes
      .filter((c) => filter === 'all' || c.category === filter)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
      .sort((a, b) => Number(!a.inputs[platform]) - Number(!b.inputs[platform])); // available first
  }, [codes, filter, query, platform]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>{APP_NAME.toUpperCase()}</Text>
          <Text style={styles.title}>{GAME_NAME} Cheats</Text>
        </View>
        {!isPremium && (
          <Pressable style={styles.proBtn} onPress={() => router.push('/premium')}>
            <Text style={styles.proText}>Remove ads</Text>
          </Pressable>
        )}
      </View>

      <Chips items={PLATFORMS.map((p) => ({ id: p.id, label: p.short }))} value={platform} onChange={setPlatform} />

      <TextInput
        style={styles.search}
        placeholder="Search cheats"
        placeholderTextColor={colors.textDim}
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
        autoCorrect={false}
      />

      <Chips
        items={[{ id: 'all' as Filter, label: 'All' }, ...CATEGORIES.map((c) => ({ id: c.id as Filter, label: `${c.icon} ${c.label}` }))]}
        value={filter}
        onChange={setFilter}
        accent={colors.accent2}
      />

      {isSample && <Text style={styles.sample}>DEV PREVIEW — sample codes, not real</Text>}

      <FlatList
        data={list}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <CodeRow code={item} platform={platform} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />}
        ListEmptyComponent={
          codes.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🕹️</Text>
              <Text style={styles.emptyTitle}>Cheats are on the way</Text>
              <Text style={styles.emptyText}>
                As soon as {GAME_NAME} cheat codes are found, they appear here automatically. Pull down to check for
                updates.
              </Text>
            </View>
          ) : (
            <Text style={styles.noResults}>No cheats match your search.</Text>
          )
        }
      />
      <AdBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  kicker: { color: colors.accent, fontWeight: '900', letterSpacing: 2, fontSize: 12 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900' },
  proBtn: { backgroundColor: colors.gold, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  proText: { color: colors.bg, fontWeight: '800', fontSize: 13 },
  search: {
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  sample: { color: colors.gold, textAlign: 'center', fontSize: 12, fontWeight: '700' },
  list: { padding: 16, paddingTop: 4, gap: 10, flexGrow: 1 },
  empty: { alignItems: 'center', padding: 32, gap: 10, marginTop: 40 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  emptyText: { color: colors.textDim, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  noResults: { color: colors.textDim, textAlign: 'center', marginTop: 40 },
});
