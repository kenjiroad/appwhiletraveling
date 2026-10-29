import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Exercise } from '../../modules/rep-counter';

export type Settings = {
  hour: number;
  minute: number;
  enabled: boolean;
  exercise: Exercise;
  reps: number;
  name?: string;
  /** "Toujours debout ?": one more ring 5 minutes after the challenge, in case you went back to bed. */
  wakeCheck?: boolean;
  /** Evening notification telling you it's time to sleep. */
  bedtimeReminder?: boolean;
  /** Sleep you aim for, in minutes: bedtime = alarm time minus this. */
  sleepGoalMinutes?: number;
};

// SecureStore has no web implementation; the browser preview keeps data in localStorage.
const store =
  Platform.OS === 'web'
    ? {
        getItem: (key: string) => globalThis.localStorage?.getItem(key) ?? null,
        setItem: (key: string, value: string) => globalThis.localStorage?.setItem(key, value),
      }
    : { getItem: SecureStore.getItem, setItem: SecureStore.setItem };

const SETTINGS_KEY = 'settings';
const HISTORY_KEY = 'history';
const PENDING_SYNC_KEY = 'pending-sync';
const JOKERS_KEY = 'jokers';
const WAKE_CHECK_KEY = 'wake-check';

export type DayRecord = { reps: number; done: boolean };

export const DEFAULT_SETTINGS: Settings = {
  hour: 7,
  minute: 0,
  enabled: true,
  exercise: 'pushup',
  reps: 15,
  wakeCheck: true,
  bedtimeReminder: true,
  sleepGoalMinutes: 8 * 60,
};

export const SLEEP_GOAL_OPTIONS = [7 * 60, 7.5 * 60, 8 * 60, 8.5 * 60, 9 * 60];

function readJson<T>(key: string, fallback: T): T {
  const raw = store.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getSettings(): Settings | null {
  return readJson<Settings | null>(SETTINGS_KEY, null);
}

export function saveSettings(settings: Settings) {
  store.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getHistory(): Record<string, DayRecord> {
  return readJson<Record<string, DayRecord>>(HISTORY_KEY, {});
}

/** Adds a finished session to today's total; `done` marks the daily challenge as completed. */
export function recordSession(reps: number, done: boolean) {
  const history = getHistory();
  const today = history[dayKey()] ?? { reps: 0, done: false };
  history[dayKey()] = { reps: today.reps + reps, done: today.done || done };
  store.setItem(HISTORY_KEY, JSON.stringify(history));
  markDayPending(dayKey());
  if (done && !today.done) earnJokerIfDue();
}

/** Days whose totals still have to be sent to the server (kept until a sync succeeds). */
export function getPendingDays(): string[] {
  return readJson<string[]>(PENDING_SYNC_KEY, []);
}

function markDayPending(day: string) {
  const pending = getPendingDays();
  if (!pending.includes(day)) store.setItem(PENDING_SYNC_KEY, JSON.stringify([...pending, day]));
}

export function clearPendingDays(synced: string[]) {
  store.setItem(PENDING_SYNC_KEY, JSON.stringify(getPendingDays().filter((d) => !synced.includes(d))));
}

export function isTodayCompleted() {
  return getHistory()[dayKey()]?.done ?? false;
}

/** Done, or excused with the emergency exit: either way the alarm leaves you alone today. */
export function isTodayHandled() {
  return isTodayCompleted() || getJokers().excusedDays.includes(dayKey());
}

// --- Jokers -------------------------------------------------------------------------------
// A joker protects the streak for one missed morning (like Duolingo's streak freeze).
// You start with one and earn one every 7 days in a row, up to 2.

export const MAX_JOKERS = 2;
export const DAYS_PER_JOKER = 7;

type JokerState = {
  available: number;
  /** Missed days a joker covered: they keep the streak alive without adding to it. */
  protectedDays: string[];
  /** Days skipped with the emergency exit (sick, injured…). */
  excusedDays: string[];
  /** Last day already checked for a missed morning. */
  settledUntil?: string;
};

function getJokers(): JokerState {
  return readJson<JokerState>(JOKERS_KEY, { available: 1, protectedDays: [], excusedDays: [] });
}

function saveJokers(state: JokerState) {
  store.setItem(JOKERS_KEY, JSON.stringify(state));
}

export function getJokerCount() {
  settleMissedDays();
  return getJokers().available;
}

export function isProtectedDay(day: string) {
  return getJokers().protectedDays.includes(day);
}

/** Streak ending on `cursor` (included), protected days bridging without counting. */
function streakEndingOn(cursor: Date, history: Record<string, DayRecord>, protectedDays: string[]) {
  const day = new Date(cursor);
  let streak = 0;
  for (;;) {
    const key = dayKey(day);
    if (history[key]?.done) streak += 1;
    else if (!protectedDays.includes(key)) break;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

/** Spends a joker on each missed morning since the last check, as long as there was a streak to save. */
function settleMissedDays() {
  const state = getJokers();
  const history = getHistory();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const until = dayKey(yesterday);
  if (state.settledUntil && state.settledUntil >= until) return;

  // First run: only look back two weeks.
  const cursor = state.settledUntil ? new Date(`${state.settledUntil}T12:00:00`) : new Date(yesterday);
  if (!state.settledUntil) cursor.setDate(cursor.getDate() - 14);
  cursor.setDate(cursor.getDate() + 1);

  while (dayKey(cursor) <= until) {
    const key = dayKey(cursor);
    const missed = !history[key]?.done && !state.protectedDays.includes(key);
    if (missed && state.available > 0) {
      const before = new Date(cursor);
      before.setDate(before.getDate() - 1);
      if (streakEndingOn(before, history, state.protectedDays) > 0) {
        state.available -= 1;
        state.protectedDays.push(key);
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  state.settledUntil = until;
  saveJokers(state);
}

function earnJokerIfDue() {
  const streak = getStreak();
  if (streak > 0 && streak % DAYS_PER_JOKER === 0) {
    const state = getJokers();
    state.available = Math.min(MAX_JOKERS, state.available + 1);
    saveJokers(state);
  }
}

/**
 * Emergency exit (sick, injured…): today's alarm stops without completing the day.
 * Spends a joker so the streak survives, if there is one. Returns whether a joker was used.
 */
export function excuseToday() {
  settleMissedDays();
  const state = getJokers();
  const today = dayKey();
  if (!state.excusedDays.includes(today)) state.excusedDays.push(today);
  const usedJoker = state.available > 0 && !state.protectedDays.includes(today);
  if (usedJoker) {
    state.available -= 1;
    state.protectedDays.push(today);
  }
  saveJokers(state);
  return usedJoker;
}

/** Consecutive completed days ending today (or yesterday, if today isn't done yet). Jokers bridge missed days. */
export function getStreak() {
  settleMissedDays();
  const history = getHistory();
  const { protectedDays } = getJokers();
  const cursor = new Date();
  if (!history[dayKey(cursor)]?.done && !protectedDays.includes(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  return streakEndingOn(cursor, history, protectedDays);
}

// --- "Toujours debout ?" ------------------------------------------------------------------

/** When the follow-up ring after the challenge is due, if any. */
export function getWakeCheck(): Date | null {
  const at = readJson<number | null>(WAKE_CHECK_KEY, null);
  return at && at > Date.now() ? new Date(at) : null;
}

export function setWakeCheck(at: Date | null) {
  store.setItem(WAKE_CHECK_KEY, JSON.stringify(at ? at.getTime() : null));
}

export function getBestStreak() {
  const history = getHistory();
  const days = Object.keys(history)
    .filter((d) => history[d].done)
    .sort();
  let best = 0;
  let current = 0;
  let previous: Date | null = null;
  for (const day of days) {
    const date = new Date(`${day}T12:00:00`);
    const consecutive = previous && Math.round((date.getTime() - previous.getTime()) / 86_400_000) === 1;
    current = consecutive ? current + 1 : 1;
    best = Math.max(best, current);
    previous = date;
  }
  return best;
}

export function getTotals() {
  const records = Object.values(getHistory());
  return {
    reps: records.reduce((sum, r) => sum + r.reps, 0),
    completedDays: records.filter((r) => r.done).length,
  };
}

/** Reps since Monday of the current week. */
export function getWeekReps() {
  const history = getHistory();
  const cursor = new Date();
  const daysSinceMonday = (cursor.getDay() + 6) % 7;
  let total = 0;
  for (let i = 0; i <= daysSinceMonday; i++) {
    total += history[dayKey(cursor)]?.reps ?? 0;
    cursor.setDate(cursor.getDate() - 1);
  }
  return total;
}
