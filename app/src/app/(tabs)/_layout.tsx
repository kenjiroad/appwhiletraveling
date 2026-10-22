import { Tabs } from 'expo-router';

import { PillTabBar } from '@/components/pill-tab-bar';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={() => <PillTabBar />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="league" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
