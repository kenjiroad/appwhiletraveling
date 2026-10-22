import { Image, type ImageSource } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  source: ImageSource;
  size: number;
  /** Idle loop: slow breathing (default), a floating hover, a victory bounce, or nothing. */
  idle?: 'breathe' | 'float' | 'bounce' | 'none';
  /** Change this number to make the mascot hop once (e.g. on every rep). */
  hopKey?: number;
  /** Locked levels show as a dark silhouette. */
  silhouette?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Mascot({ source, size, idle = 'breathe', hopKey = 0, silhouette = false, onPress, style }: Props) {
  const loop = useSharedValue(0);
  const hop = useSharedValue(0);

  useEffect(() => {
    if (idle === 'none') return;
    const duration = idle === 'bounce' ? 520 : idle === 'float' ? 2200 : 1800;
    loop.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [idle, loop]);

  useEffect(() => {
    if (hopKey === 0) return;
    hop.value = withSequence(withTiming(1, { duration: 120, easing: Easing.out(Easing.quad) }), withSpring(0, { damping: 7, stiffness: 180 }));
  }, [hopKey, hop]);

  const animatedStyle = useAnimatedStyle(() => {
    const breathe = idle === 'breathe' ? loop.value : 0;
    const float = idle === 'float' ? loop.value : 0;
    const bounce = idle === 'bounce' ? loop.value : 0;
    return {
      transform: [
        { translateY: -float * 8 - bounce * 26 - hop.value * size * 0.12 },
        // Squash and stretch: a little wider when breathing out / landing, taller when jumping.
        { scaleX: 1 + breathe * 0.015 - hop.value * 0.04 + (1 - bounce) * 0.03 * (idle === 'bounce' ? 1 : 0) },
        { scaleY: 1 + breathe * 0.025 + hop.value * 0.08 },
      ],
    };
  });

  const image = (
    <Animated.View style={[{ width: size, height: size }, animatedStyle, style]}>
      <Image
        source={source}
        style={{ width: size, height: size, opacity: silhouette ? 0.9 : 1 }}
        contentFit="contain"
        tintColor={silhouette ? '#241F4A' : undefined}
      />
    </Animated.View>
  );

  return onPress ? <Pressable onPress={onPress}>{image}</Pressable> : image;
}
