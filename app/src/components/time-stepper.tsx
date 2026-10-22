import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatTime } from '@/lib/exercises';
import { colors, fonts, radius } from '@/lib/theme';

type Props = {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
  size?: number;
};

const MINUTE_STEP = 5;

export function TimeStepper({ hour, minute, onChange, size = 72 }: Props) {
  const shift = (minutes: number) => {
    const total = (hour * 60 + minute + minutes + 24 * 60) % (24 * 60);
    onChange(Math.floor(total / 60), total % 60);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.time, { fontSize: size, lineHeight: size * 1.05 }]}>{formatTime(hour, minute)}</Text>
      <View style={styles.row}>
        <StepButton label="−1h" onPress={() => shift(-60)} />
        <StepButton label={`−${MINUTE_STEP}`} onPress={() => shift(-MINUTE_STEP)} />
        <StepButton label={`+${MINUTE_STEP}`} onPress={() => shift(MINUTE_STEP)} />
        <StepButton label="+1h" onPress={() => shift(60)} />
      </View>
    </View>
  );
}

function StepButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.step, pressed && styles.pressed]} onPress={onPress} hitSlop={4}>
      <Text style={styles.stepText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 12 },
  row: { flexDirection: 'row', gap: 8 },
  time: { color: colors.text, fontFamily: fonts.serif, letterSpacing: -1 },
  step: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 58,
    alignItems: 'center',
  },
  pressed: { transform: [{ scale: 0.94 }] },
  stepText: { color: colors.text, fontFamily: fonts.semibold, fontSize: 15 },
});
