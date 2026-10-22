// "Aube" (dawn): the app moves from night to sunrise, like its users in the morning.
export const colors = {
  night: '#0A0B1A',
  nightHigh: '#14132E',
  text: '#F6F1EA',
  textMuted: 'rgba(246,241,234,0.58)',
  textFaint: 'rgba(246,241,234,0.32)',
  glass: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.12)',
  sun: '#FF7A45',
  gold: '#FFC46B',
  rose: '#FF5E8A',
  violet: '#6B5BFF',
  onSun: '#1A0F0A',
} as const;

export const gradients = {
  night: ['#0A0B1A', '#16123A'] as const,
  dawn: ['#2A1B5C', '#C2477A', '#FF8A4C', '#FFD08A'] as const,
  sun: ['#FFC46B', '#FF7A45', '#FF5E8A'] as const,
  bar: ['#FFC46B', '#FF5E8A'] as const,
};

export const fonts = {
  serif: 'InstrumentSerif-Italic',
  regular: 'InstrumentSans-400',
  medium: 'InstrumentSans-500',
  semibold: 'InstrumentSans-600',
  bold: 'InstrumentSans-700',
} as const;

export const radius = { sm: 14, md: 22, lg: 32, pill: 999 } as const;
