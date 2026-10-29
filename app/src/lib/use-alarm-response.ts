import * as Notifications from 'expo-notifications';
import { router, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { isAlarmDue } from '@/lib/alarm';
import { sayGoodnight } from '@/lib/sleep';
import { getSettings } from '@/lib/storage';

/**
 * Sends you to the challenge when you tap an alarm notification, and whenever the app opens
 * while the alarm is due (e.g. from the "Mes pompes" button of the AlarmKit alarm).
 */
export function useAlarmResponse() {
  const lastResponse = Notifications.useLastNotificationResponse();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const data = lastResponse?.notification.request.content.data;
    if (data?.url === '/challenge') {
      router.push('/challenge');
    } else if (data?.action === 'goodnight') {
      // Bedtime notification: the sleeping marmot goes on the lock screen right away.
      const settings = getSettings();
      if (settings) sayGoodnight(settings);
      router.navigate('/');
    }
  }, [lastResponse]);

  useEffect(() => {
    const openChallengeIfDue = () => {
      if (pathnameRef.current !== '/challenge' && isAlarmDue(getSettings())) router.push('/challenge');
    };
    openChallengeIfDue();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') openChallengeIfDue();
    });
    return () => subscription.remove();
  }, []);
}
