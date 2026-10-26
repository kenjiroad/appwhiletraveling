import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
  useFonts,
} from '@expo-google-fonts/instrument-sans';
import { InstrumentSerif_400Regular_Italic } from '@expo-google-fonts/instrument-serif';
import * as Notifications from 'expo-notifications';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { syncNow } from '@/lib/sync';
import { colors, fonts } from '@/lib/theme';
import { initPurchases, requiresSubscription } from '@/lib/purchases';
import { useAlarmResponse } from '@/lib/use-alarm-response';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.night, card: colors.night },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.regular]: InstrumentSans_400Regular,
    [fonts.medium]: InstrumentSans_500Medium,
    [fonts.semibold]: InstrumentSans_600SemiBold,
    [fonts.bold]: InstrumentSans_700Bold,
    [fonts.serif]: InstrumentSerif_400Regular_Italic,
  });
  useAlarmResponse();

  // Creates the anonymous account on first launch and resends any session saved while offline.
  useEffect(() => {
    syncNow();
    initPurchases();
  }, []);

  const ready = fontsLoaded || fontError != null;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.night } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="challenge" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal', gestureEnabled: !requiresSubscription }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
