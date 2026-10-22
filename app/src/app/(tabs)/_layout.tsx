import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/lib/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={[styles.icon, { opacity: focused ? 1 : 0.45 }]}>{emoji}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.bar,
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.label,
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Réveil', tabBarIcon: ({ focused }) => <TabIcon emoji="⏰" focused={focused} /> }}
      />
      <Tabs.Screen
        name="league"
        options={{ title: 'Ligue', tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Évolution', tabBarIcon: ({ focused }) => <TabIcon emoji="🧬" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 84, paddingTop: 8 },
  label: { fontFamily: fonts.bold, fontSize: 12 },
  icon: { fontSize: 24 },
});
