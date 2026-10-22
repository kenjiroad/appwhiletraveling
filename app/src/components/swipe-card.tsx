import { Image } from 'expo-image';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, useWindowDimensions } from 'react-native';

import { colors, radius } from '@/lib/theme';

export type SwipeDirection = 'keep' | 'remove';

export type SwipeCardHandle = {
  swipe: (direction: SwipeDirection) => void;
};

type Props = {
  uri: string;
  onSwiped: (direction: SwipeDirection) => void;
};

const SWIPE_THRESHOLD = 110;

export const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard(
  { uri, onSwiped },
  ref
) {
  const { width } = useWindowDimensions();
  const position = useRef(new Animated.ValueXY()).current;

  const flyOut = (direction: SwipeDirection) => {
    const x = direction === 'keep' ? width * 1.5 : -width * 1.5;
    Animated.timing(position, { toValue: { x, y: 0 }, duration: 220, useNativeDriver: true }).start(
      () => {
        position.setValue({ x: 0, y: 0 });
        onSwiped(direction);
      }
    );
  };

  useImperativeHandle(ref, () => ({ swipe: flyOut }));

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, g) => {
          if (g.dx > SWIPE_THRESHOLD) flyOut('keep');
          else if (g.dx < -SWIPE_THRESHOLD) flyOut('remove');
          else Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        },
      }),
    // flyOut only depends on width and onSwiped, which are stable for a given card
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, onSwiped]
  );

  const rotate = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-18deg', '0deg', '18deg'],
  });
  const keepOpacity = position.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const removeOpacity = position.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] },
      ]}>
      <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={120} />
      <Animated.View style={[styles.badge, styles.keepBadge, { opacity: keepOpacity }]}>
        <Text style={[styles.badgeText, { color: colors.keep }]}>GARDER</Text>
      </Animated.View>
      <Animated.View style={[styles.badge, styles.removeBadge, { opacity: removeOpacity }]}>
        <Text style={[styles.badgeText, { color: colors.remove }]}>SUPPRIMER</Text>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  badge: {
    position: 'absolute',
    top: 28,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 3,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  keepBadge: { left: 24, borderColor: colors.keep, transform: [{ rotate: '-12deg' }] },
  removeBadge: { right: 24, borderColor: colors.remove, transform: [{ rotate: '12deg' }] },
  badgeText: { fontSize: 26, fontWeight: '900', letterSpacing: 1 },
});
