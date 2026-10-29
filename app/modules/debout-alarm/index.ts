import { requireOptionalNativeModule } from 'expo';

type DeboutAlarmModule = {
  isSupported(): boolean;
  isAuthorized(): boolean;
  requestAuthorizationAsync(): Promise<boolean>;
  scheduleAsync(timestamps: number[], titles: string[]): Promise<void>;
  cancelBetween(start: number, end: number): void;
  cancelAll(): void;
  scheduledCount(): number;
  areLiveActivitiesEnabled(): boolean;
  startSleepActivity(alarmTimestamp: number, challenge: string): boolean;
  endSleepActivity(): void;
};

const nativeModule = requireOptionalNativeModule<DeboutAlarmModule>('DeboutAlarm');

// AlarmKit needs a development or production build on iOS 26+. In Expo Go, on the web
// or on an older iOS, the alarm falls back to notifications.
export const isAlarmKitSupported = nativeModule?.isSupported() ?? false;

export function isAlarmKitAuthorized() {
  return isAlarmKitSupported && nativeModule!.isAuthorized();
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

export function startSleepActivity(alarm: Date, challenge: string) {
  if (!nativeModule?.startSleepActivity) return false;
  return nativeModule.startSleepActivity(alarm.getTime(), challenge);
}

export function endSleepActivity() {
  nativeModule?.endSleepActivity?.();
}
