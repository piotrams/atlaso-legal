import { Tabs } from 'expo-router/js-tabs';
import { Text, type ColorValue } from 'react-native';

import { colors } from '../../theme';

const icon = (glyph: string) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Text style={{ color, fontSize: 20 }}>{glyph}</Text>;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textDim,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Codes', tabBarIcon: icon('🎮') }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: icon('★') }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: icon('⚙︎') }} />
    </Tabs>
  );
}
