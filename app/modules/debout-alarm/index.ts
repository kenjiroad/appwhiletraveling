import { requireOptionalNativeModule, type EventSubscription } from 'expo';

type DeboutAlarmModule = {
  isSupported(): boolean;
  isAuthorized(): boolean;
  authorizationState?(): string;
  requestAuthorizationAsync(): Promise<boolean>;
  scheduleAsync(timestamps: number[], titles: string[]): Promise<void>;
  cancelBetween(start: number, end: number): void;
  cancelAll(): void;
  scheduledCount(): number;
  areLiveActivitiesEnabled(): boolean;
  startSleepActivity(alarmTimestamp: number, challenge: string, withPush: boolean): boolean;
  refreshSleepActivity?(): void;
  endSleepActivity(): void;
  addListener?(event: 'onSleepActivityToken', listener: (event: { token: string }) => void): EventSubscription;
};

const nativeModule = requireOptionalNativeModule<DeboutAlarmModule>('DeboutAlarm');

// AlarmKit needs a development or production build on iOS 26+. In Expo Go, on the web
// or on an older iOS, the alarm falls back to notifications.
export const isAlarmKitSupported = nativeModule?.isSupported() ?? false;

export function isAlarmKitAuthorized() {
  return isAlarmKitSupported && nativeModule!.isAuthorized();
}

/** "authorized", "denied", "notDetermined", or "unsupported" (older iOS, Expo Go, web, or an old build). */
export function getAlarmKitAuthorizationState() {
  if (!isAlarmKitSupported) return 'unsupported';
  return nativeModule!.authorizationState?.() ?? (nativeModule!.isAuthorized() ? 'authorized' : 'notDetermined');
}

export async function requestAlarmKitAuthorizationAsync() {
  return isAlarmKitSupported ? nativeModule!.requestAuthorizationAsync() : false;
}

export async function scheduleAlarmKitAsync(rings: { date: Date; title: string }[]) {
  if (!isAlarmKitSupported) return;
  await nativeModule!.scheduleAsync(
    rings.map((r) => r.date.getTime()),
    rings.map((r) => r.title)
  );
}

export function cancelAlarmKitBetween(start: Date, end: Date) {
  if (isAlarmKitSupported) nativeModule!.cancelBetween(start.getTime(), end.getTime());
}

export function cancelAllAlarmKit() {
  if (isAlarmKitSupported) nativeModule!.cancelAll();
}

export function getAlarmKitScheduledCount() {
  return isAlarmKitSupported ? nativeModule!.scheduledCount() : 0;
}

// Live Activities only exist in a real build (not Expo Go or the web).
export const isSleepActivitySupported = nativeModule?.areLiveActivitiesEnabled != null;

/** `withPush`: ask iOS for a push token so the server can move the marmot along the night. */
export function startSleepActivity(alarm: Date, challenge: string, withPush: boolean) {
  if (!nativeModule?.startSleepActivity) return false;
  return nativeModule.startSleepActivity(alarm.getTime(), challenge, withPush);
}

/** Puts the marmot where the night is now (when the app opens at 3 a.m., say). */
export function refreshSleepActivity() {
  nativeModule?.refreshSleepActivity?.();
}

export function addSleepActivityTokenListener(listener: (token: string) => void) {
  return nativeModule?.addListener?.('onSleepActivityToken', (event) => listener(event.token)) ?? null;
}

export function endSleepActivity() {
  nativeModule?.endSleepActivity?.();
}
