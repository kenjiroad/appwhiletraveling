import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/bricolage-grotesque';
import * as Notifications from 'expo-notifications';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { colors, fonts } from '@/lib/theme';
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
  colors: { ...DarkTheme.colors, background: colors.background, card: colors.background },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.regular]: BricolageGrotesque_400Regular,
    [fonts.semibold]: BricolageGrotesque_600SemiBold,
    [fonts.bold]: BricolageGrotesque_700Bold,
    [fonts.black]: BricolageGrotesque_800ExtraBold,
  });
  useAlarmResponse();

  const ready = fontsLoaded || fontError != null;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="challenge" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
