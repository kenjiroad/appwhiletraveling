import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

/** Tapping an alarm notification goes straight to the challenge. */
export function useAlarmResponse() {
  const lastResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (lastResponse?.notification.request.content.data?.url === '/challenge') {
      router.push('/challenge');
    }
  }, [lastResponse]);
}
