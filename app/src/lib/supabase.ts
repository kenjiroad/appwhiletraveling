import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { AppState, Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** False until app/.env holds the project URL and anon key: the app then stays fully local (demo league). */
export const isSupabaseConfigured = Boolean(url && anonKey);

// The auth session lives in the Keychain on iOS; the browser preview uses localStorage.
const authStorage =
  Platform.OS === 'web'
    ? {
        getItem: async (key: string) => globalThis.localStorage?.getItem(key) ?? null,
        setItem: async (key: string, value: string) => globalThis.localStorage?.setItem(key, value),
        removeItem: async (key: string) => globalThis.localStorage?.removeItem(key),
      }
    : { getItem: SecureStore.getItemAsync, setItem: SecureStore.setItemAsync, removeItem: SecureStore.deleteItemAsync };

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { storage: authStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    })
  : null;

// Refresh the token only while the app is in the foreground, as Supabase recommends for React Native.
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

let pendingUserId: Promise<string | null> | null = null;

/**
 * Returns the signed-in user id, creating an anonymous account on first launch.
 * Never throws: offline or misconfigured simply means null, and the app keeps working locally.
 */
export function ensureUserId(): Promise<string | null> {
  if (!supabase) return Promise.resolve(null);
  pendingUserId ??= (async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) return data.session.user.id;
      const { data: created, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      return created.user?.id ?? null;
    } catch {
      pendingUserId = null; // retry on the next call
      return null;
    }
  })();
  return pendingUserId;
}
