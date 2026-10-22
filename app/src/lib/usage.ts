import * as SecureStore from 'expo-secure-store';

export const FREE_DAILY_SWIPES = 50;

const SWIPES_KEY = 'swipes_today';
const DELETED_KEY = 'deleted_total';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getSwipesToday(): number {
  const raw = SecureStore.getItem(SWIPES_KEY);
  if (!raw) return 0;
  const [day, count] = raw.split(':');
  return day === today() ? Number(count) : 0;
}

export function recordSwipe() {
  SecureStore.setItem(SWIPES_KEY, `${today()}:${getSwipesToday() + 1}`);
}

export function getDeletedTotal(): number {
  return Number(SecureStore.getItem(DELETED_KEY) ?? 0);
}

export function addDeleted(count: number) {
  SecureStore.setItem(DELETED_KEY, String(getDeletedTotal() + count));
}
