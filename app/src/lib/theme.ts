export const colors = {
  background: '#0D0A1E',
  surface: '#1A1533',
  surfaceHigh: '#241D45',
  border: '#2E2654',
  text: '#FFFFFF',
  textMuted: '#A9A2C9',
  lime: '#C8FF2E',
  onLime: '#14101F',
  pink: '#FF4FA3',
  orange: '#FF8A1F',
  violet: '#7B5CFF',
  cyan: '#3DE0FF',
} as const;

export const gradients = {
  hero: ['#7B5CFF', '#FF4FA3'] as const,
  fire: ['#FF8A1F', '#FF4FA3'] as const,
  night: ['#1E1640', '#0D0A1E'] as const,
  lime: ['#C8FF2E', '#3DE0FF'] as const,
};

export const fonts = {
  black: 'Bricolage-800',
  bold: 'Bricolage-700',
  semibold: 'Bricolage-600',
  regular: 'Bricolage-400',
} as const;

export const radius = { sm: 12, md: 18, lg: 26, pill: 999 } as const;
