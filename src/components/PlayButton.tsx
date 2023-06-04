import React, {FC, useContext, useMemo} from 'react';
import Animated, {Layout} from 'react-native-reanimated';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {useStyles} from '../hooks/useStyles';
import {FadeAnimatedText} from './FadeAnimatedText';
import {Pause} from '../assets/icons/Pause';
import {Play} from '../assets/icons/Play';
import {TimerContext} from '../hooks/useTimerContext';
import {useAtomValue} from 'jotai';
import {globalDurationAtom} from '../atoms/timer';
import {ProgressCircle} from './ProgressCircle';

type Props = {
  layout: Layout;
  style?: StyleProp<ViewStyle>;
};

const LARGE_BORDER_WIDTH = 18;
const SMALL_BORDER_WIDTH = 12;

export const PlayButton: FC<Props> = ({layout, style}) => {
  const {backgroundStyle, textStyle, width} = useStyles();
  const globalDuration = useAtomValue(globalDurationAtom);
  const {
    stopped,
    timer,
    timeTag,
    iconAnimatedProps,
    pauseStyle,
    playStyle,
    running,
    onPlay,
    duration,
    timerPercentage,
    preTimerRunning,
  } = useContext(TimerContext) || {};

  const largeSize = useMemo(() => width - 32 - LARGE_BORDER_WIDTH, [width]);

  const smallSize = useMemo(
    () => largeSize - 32 - SMALL_BORDER_WIDTH * 2 - LARGE_BORDER_WIDTH,
    [largeSize],
  );

  return (
    <Animated.View layout={layout} style={styles.container}>
      <TouchableOpacity
        style={[styles.button, {width: largeSize, height: largeSize}, style]}
        onPress={() => onPlay?.()}
        disabled={(duration || 0) <= 0 || preTimerRunning}>
        <ProgressCircle
          size={largeSize}
          percentage={(duration || 0) / globalDuration}
          borderWidth={LARGE_BORDER_WIDTH}
        />
        <ProgressCircle
          size={smallSize}
          percentage={timerPercentage || 0}
          borderWidth={SMALL_BORDER_WIDTH}
        />
        {!stopped && (
          <FadeAnimatedText style={[styles.text, textStyle]} layout={layout}>
            {timer}
            <Text style={styles.timeTag}> {timeTag}</Text>
          </FadeAnimatedText>
        )}
        <Pause
          layout={layout}
          animatedProps={iconAnimatedProps}
          style={[styles.icon, backgroundStyle, pauseStyle]}
        />
        <Play
          layout={layout}
          animatedProps={iconAnimatedProps}
          style={[styles.icon, backgroundStyle, playStyle]}
        />
        {!running && !stopped && (
          <Play style={[backgroundStyle, styles.pause]} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 70,
    width: '100%',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  timeTag: {
    fontSize: 32,
    fontWeight: '700',
  },
  icon: {
    position: 'absolute',
  },
  pause: {
    position: 'absolute',
    transform: [
      {
        translateY: 65,
      },
    ],
  },
});
