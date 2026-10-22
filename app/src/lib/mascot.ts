import type { ImageSource } from 'expo-image';

// One image per level, in the same order as RANKS: the mascot evolves with the player.
export const MASCOT_LEVELS: ImageSource[] = [
  require('../../assets/mascot/niveau-1-marmotte.png'),
  require('../../assets/mascot/niveau-2-escargot.png'),
  require('../../assets/mascot/niveau-3-poussin.png'),
  require('../../assets/mascot/niveau-4-coq.png'),
  require('../../assets/mascot/niveau-5-taureau.png'),
  require('../../assets/mascot/niveau-6-lion.png'),
  require('../../assets/mascot/niveau-7-machine.png'),
  require('../../assets/mascot/niveau-8-legende.png'),
];

export const MASCOT_POSES = {
  sleep: require('../../assets/mascot/pose-dort.png'),
  wake: require('../../assets/mascot/pose-reveil.png'),
  pushup: require('../../assets/mascot/pose-pompe.png'),
  squat: require('../../assets/mascot/pose-squat.png'),
  victory: require('../../assets/mascot/pose-victoire.png'),
  phone: require('../../assets/mascot/pose-telephone.png'),
} satisfies Record<string, ImageSource>;
