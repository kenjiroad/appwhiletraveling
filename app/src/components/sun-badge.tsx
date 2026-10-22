import { useEffect, useId } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, Line, LinearGradient, Rect, Stop } from 'react-native-svg';

import { RANKS } from '@/lib/progress';
import { colors } from '@/lib/theme';

/**
 * Rank emblem: a sun rising over the horizon. The higher the level, the higher the sun and the
 * more rays it has — the "aube" metaphor carried into progression.
 */
export function SunBadge({ level, size = 120, animated = true }: { level: number; size?: number; animated?: boolean }) {
  // SVG ids are global on web, so each badge needs its own gradient and clip ids.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ratio = level / (RANKS.length - 1);
  const cx = size / 2;
  const horizon = size * 0.7;
  const sunR = size * 0.19;
  const sunY = horizon + sunR * 0.55 - ratio * (horizon - sunR * 1.6);
  const rays = level === 0 ? 0 : 6 + level * 2;

  const pulse = useSharedValue(0);
  useEffect(() => {
    if (animated && rays > 0) pulse.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [animated, rays, pulse]);
  const raysStyle = useAnimatedStyle(() => ({ opacity: 0.45 + pulse.value * 0.55, transform: [{ scale: 0.96 + pulse.value * 0.06 }] }));

  return (
    <View style={{ width: size, height: size }}>
      {rays > 0 && (
        <Animated.View style={[{ position: 'absolute', width: size, height: size }, raysStyle]}>
          <Svg width={size} height={size}>
            <Defs>
              <ClipPath id={`rays${uid}`}>
                <Rect x={0} y={0} width={size} height={horizon - 2} />
              </ClipPath>
            </Defs>
            {Array.from({ length: rays }, (_, i) => {
              const a = Math.PI + (i / (rays - 1)) * Math.PI;
              const r1 = sunR * 1.35;
              const r2 = sunR * (1.8 + (i % 2) * 0.3);
              return (
                <Line
                  key={i}
                  x1={cx + Math.cos(a) * r1}
                  y1={sunY + Math.sin(a) * r1}
                  x2={cx + Math.cos(a) * r2}
                  y2={sunY + Math.sin(a) * r2}
                  stroke={colors.gold}
                  strokeWidth={Math.max(1.5, size / 70)}
                  strokeLinecap="round"
                  clipPath={`url(#rays${uid})`}
                />
              );
            })}
          </Svg>
        </Animated.View>
      )}
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id={`sun${uid}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.gold} />
            <Stop offset="1" stopColor={colors.rose} />
          </LinearGradient>
          <ClipPath id={`sky${uid}`}>
            <Rect x={0} y={0} width={size} height={horizon} />
          </ClipPath>
        </Defs>
        <Circle cx={cx} cy={sunY} r={sunR} fill={`url(#sun${uid})`} clipPath={`url(#sky${uid})`} />
        <Line x1={size * 0.1} y1={horizon} x2={size * 0.9} y2={horizon} stroke={colors.text} strokeOpacity={0.55} strokeWidth={1.5} />
        <Line x1={size * 0.28} y1={horizon + size * 0.07} x2={size * 0.72} y2={horizon + size * 0.07} stroke={colors.text} strokeOpacity={0.2} strokeWidth={1.5} />
      </Svg>
    </View>
  );
}
