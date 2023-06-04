import {useCallback} from 'react';
import {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export enum AnimationState {
  START,
  FINISH,
}

export const useAnimations = () => {
  const iconSize = useSharedValue(1);

  const animateIcon = useCallback(
    (state: AnimationState) => {
      if (state === AnimationState.START) {
        iconSize.value = withTiming(1, {duration: 300, easing: Easing.linear});
      } else {
        iconSize.value = withTiming(0, {duration: 200, easing: Easing.linear});
      }
    },
    [iconSize],
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

  return {animateIcon, iconAnimatedProps, playStyle, pauseStyle};
};
