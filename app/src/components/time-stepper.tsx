import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatTime } from '@/lib/exercises';
import { colors, radius } from '@/lib/theme';

type Props = {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
};

const MINUTE_STEP = 5;

export function TimeStepper({ hour, minute, onChange }: Props) {
  const shift = (minutes: number) => {
    const total = (hour * 60 + minute + minutes + 24 * 60) % (24 * 60);
    onChange(Math.floor(total / 60), total % 60);
  };

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <StepButton label="+1h" onPress={() => shift(60)} />
        <StepButton label="−1h" onPress={() => shift(-60)} />
      </View>
      <Text style={styles.time}>{formatTime(hour, minute)}</Text>
      <View style={styles.column}>
        <StepButton label={`+${MINUTE_STEP}`} onPress={() => shift(MINUTE_STEP)} />
        <StepButton label={`−${MINUTE_STEP}`} onPress={() => shift(-MINUTE_STEP)} />
      </View>
    </View>
  );
}

function StepButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.step} onPress={onPress} hitSlop={6}>
      <Text style={styles.stepText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  column: { gap: 8 },
  time: { color: colors.text, fontSize: 64, fontWeight: '800', fontVariant: ['tabular-nums'] },
  step: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 56,
    alignItems: 'center',
  },
  stepText: { color: colors.text, fontSize: 15, fontWeight: '700' },
});
