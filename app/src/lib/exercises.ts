import type { Exercise } from '../../modules/rep-counter';

export const EXERCISE_LABELS: Record<Exercise, { singular: string; plural: string; emoji: string; tip: string }> = {
  pushup: {
    singular: 'pompe',
    plural: 'pompes',
    emoji: '💪',
    tip: 'Pose ton téléphone au sol, à 1 m devant toi, de profil si possible.',
  },
  squat: {
    singular: 'squat',
    plural: 'squats',
    emoji: '🦵',
    tip: 'Pose ton téléphone contre un mur, à 2 m, pour qu’on voie tout ton corps.',
  },
};

export const REP_OPTIONS = [10, 15, 20, 30];

export function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
