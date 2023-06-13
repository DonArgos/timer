import {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

export const useAnimations = (stopped: boolean) => {
  const iconSize = useDerivedValue(
    () =>
      stopped
        ? withTiming(1, {duration: 300, easing: Easing.linear})
        : withTiming(0, {duration: 200, easing: Easing.linear}),
    [stopped],
  );

  const iconAnimatedProps = useAnimatedProps(() => ({
    width: interpolate(iconSize.value, [0, 1], [24, 96]),
    height: interpolate(iconSize.value, [0, 1], [24, 96]),
  }));

  const playStyle = useAnimatedStyle(() => ({
    opacity: interpolate(iconSize.value, [0, 1], [0, 1]),
    transform: [
      {
        translateY: interpolate(iconSize.value, [0, 1], [65, 0]),
      },
    ],
  }));

  const pauseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(iconSize.value, [0, 1], [65, 0]),
      },
    ],
  }));

  return {iconAnimatedProps, playStyle, pauseStyle};
};
