import { requireOptionalNativeModule } from 'expo';

type DeboutAlarmModule = {
  isSupported(): boolean;
  isAuthorized(): boolean;
  requestAuthorizationAsync(): Promise<boolean>;
  scheduleAsync(timestamps: number[], title: string): Promise<void>;
  cancelBetween(start: number, end: number): void;
  cancelAll(): void;
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

export async function scheduleAlarmKitAsync(dates: Date[], title: string) {
  if (isAlarmKitSupported) await nativeModule!.scheduleAsync(dates.map((d) => d.getTime()), title);
}

export function cancelAlarmKitBetween(start: Date, end: Date) {
  if (isAlarmKitSupported) nativeModule!.cancelBetween(start.getTime(), end.getTime());
}

export function cancelAllAlarmKit() {
  if (isAlarmKitSupported) nativeModule!.cancelAll();
}
