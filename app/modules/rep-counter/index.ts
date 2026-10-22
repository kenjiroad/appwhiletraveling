import { requireNativeView, requireOptionalNativeModule } from 'expo';
import type { ComponentType } from 'react';
import type { NativeSyntheticEvent, ViewProps } from 'react-native';

export type Exercise = 'pushup' | 'squat';

export type RepCounterViewProps = ViewProps & {
  exercise: Exercise;
  active: boolean;
  onRep?: (event: NativeSyntheticEvent<{ count: number }>) => void;
  onBodyVisibilityChange?: (event: NativeSyntheticEvent<{ visible: boolean }>) => void;
};

type RepCounterModule = {
  requestCameraPermissionAsync(): Promise<boolean>;
};

const nativeModule = requireOptionalNativeModule<RepCounterModule>('RepCounter');

// The module only exists in a development or production build. In Expo Go it's missing,
// and the challenge screen falls back to a tap-to-count demo mode.
export const isRepCounterAvailable = nativeModule != null;

export const RepCounterView: ComponentType<RepCounterViewProps> | null = isRepCounterAvailable
  ? requireNativeView<RepCounterViewProps>('RepCounter', 'RepCounterView')
  : null;

export async function requestCameraPermissionAsync() {
  return nativeModule ? nativeModule.requestCameraPermissionAsync() : true;
}
