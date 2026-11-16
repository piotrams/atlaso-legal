import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CodeRow } from '../../components/CodeRow';
import { AdBanner } from '../../lib/ads';
import { useCodes } from '../../lib/codes';
import { usePrefs } from '../../lib/prefs';
import { colors } from '../../theme';

export default function FavoritesScreen() {
  const { codes } = useCodes();
  const { favorites, platform } = usePrefs();
  const list = favorites.map((id) => codes.find((c) => c.id === id)).filter((c) => !!c);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Text style={styles.title}>Favorites</Text>
      <FlatList
        data={list}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <CodeRow code={item} platform={platform} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>☆</Text>
            <Text style={styles.emptyText}>Tap the star on any cheat to keep it here.</Text>
          </View>
        }
      />
      <AdBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', paddingHorizontal: 16, paddingTop: 8 },
  list: { padding: 16, gap: 10, flexGrow: 1 },
  empty: { alignItems: 'center', marginTop: 80, gap: 8 },
  emptyIcon: { fontSize: 44, color: colors.textDim },
  emptyText: { color: colors.textDim, fontSize: 15 },
});
