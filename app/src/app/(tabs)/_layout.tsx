import { Redirect, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { PillTabBar } from '@/components/pill-tab-bar';
import { cancelAlarms } from '@/lib/alarm';
import { useProStatus } from '@/lib/purchases';
import { getSettings } from '@/lib/storage';
import { colors } from '@/lib/theme';

export default function TabLayout() {
  const pro = useProStatus();
  const onboarded = getSettings() != null;

  // No subscription (trial over, cancelled…): the alarm stops ringing until you subscribe again.
  useEffect(() => {
    if (pro === false) cancelAlarms();
  }, [pro]);

  // Onboarding comes first; after that, the app needs a subscription or the free trial.
  if (onboarded && pro === null) return <View style={{ flex: 1, backgroundColor: colors.night }} />;
  if (onboarded && pro === false) return <Redirect href="/paywall" />;

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={() => <PillTabBar />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="league" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
