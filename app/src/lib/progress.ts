import { getTotals } from '@/lib/storage';

export type Rank = { name: string; emoji: string; minXp: number; color: string; tagline: string };

// Each rep is worth 1 XP and each completed morning gives a bonus, so regularity beats one big session.
export const XP_PER_COMPLETED_DAY = 25;

export const RANKS: Rank[] = [
  { name: 'Marmotte', emoji: '😴', minXp: 0, color: '#A9A2C9', tagline: 'Encore 5 minutes…' },
  { name: 'Escargot', emoji: '🐌', minXp: 100, color: '#3DE0FF', tagline: 'Ça avance. Doucement.' },
  { name: 'Poussin', emoji: '🐣', minXp: 300, color: '#FFD23F', tagline: 'Tu sors de la coquille.' },
  { name: 'Coq', emoji: '🐓', minXp: 700, color: '#FF8A1F', tagline: 'C’est toi qui réveilles les autres.' },
  { name: 'Taureau', emoji: '🐂', minXp: 1500, color: '#FF4FA3', tagline: 'Rien ne t’arrête.' },
  { name: 'Lion', emoji: '🦁', minXp: 3000, color: '#FFB21F', tagline: 'Le roi du matin.' },
  { name: 'Machine', emoji: '🦾', minXp: 6000, color: '#7B5CFF', tagline: 'Plus humain, plus ou moins.' },
  { name: 'Légende', emoji: '👑', minXp: 12000, color: '#C8FF2E', tagline: 'On parlera de toi.' },
];

export function xpFrom(reps: number, completedDays: number) {
  return reps + completedDays * XP_PER_COMPLETED_DAY;
}

export function getXp() {
  const { reps, completedDays } = getTotals();
  return xpFrom(reps, completedDays);
}

export function rankFor(xp: number) {
  let index = 0;
  RANKS.forEach((rank, i) => {
    if (xp >= rank.minXp) index = i;
  });
  const rank = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const progress = next ? (xp - rank.minXp) / (next.minXp - rank.minXp) : 1;
  return { rank, next, index, progress, xpToNext: next ? next.minXp - xp : 0 };
}
