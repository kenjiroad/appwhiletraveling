import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '@/lib/theme';

type Props<T extends string | number> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function ChoiceRow<T extends string | number>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}>
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  chipSelected: { backgroundColor: colors.lime, borderColor: colors.lime },
  pressed: { transform: [{ scale: 0.96 }] },
  label: { color: colors.textMuted, fontFamily: fonts.bold, fontSize: 16 },
  labelSelected: { color: colors.onLime },
});
