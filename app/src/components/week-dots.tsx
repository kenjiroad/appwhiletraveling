import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { dayKey, getHistory } from '@/lib/storage';
import { colors, fonts } from '@/lib/theme';

const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** The current week, Monday to Sunday: a lit sun for each morning won. */
export function WeekDots() {
  const history = getHistory();
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  return (
    <View style={styles.row}>
      {LETTERS.map((letter, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const done = history[dayKey(date)]?.done ?? false;
        const isToday = dayKey(date) === dayKey(today);
        return (
          <View key={i} style={styles.day}>
            <View style={[styles.dot, isToday && styles.today]}>
              {done && <Animated.View entering={ZoomIn.delay(i * 60).springify()} style={styles.sun} />}
            </View>
            <Text style={[styles.letter, isToday && { color: colors.text }]}>{letter}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: 6 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: { borderWidth: 1.5, borderColor: colors.gold },
  sun: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.sun,
    shadowColor: colors.sun,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  letter: { color: colors.textFaint, fontFamily: fonts.semibold, fontSize: 12 },
});
