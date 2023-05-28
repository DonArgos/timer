import React, {FC, useContext} from 'react';
import Animated, {Layout} from 'react-native-reanimated';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
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

const SIZE = 298;

export const PlayButton: FC<Props> = ({layout, style}) => {
  const {backgroundStyle, textStyle} = useStyles();
  const globalDuration = useAtomValue(globalDurationAtom);
  const {
    stopped,
    timer,
    animatedProps,
    pauseStyle,
    playStyle,
    running,
    onPlay,
    duration,
    timerPercentage,
  } = useContext(TimerContext) || {};

  return (
    <Animated.View layout={layout} style={styles.container}>
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={onPlay}
        disabled={(duration || 0) <= 0}>
        <ProgressCircle
          size={298}
          percentage={(duration || 0) / globalDuration}
        />
        <ProgressCircle size={250} percentage={timerPercentage || 0} />
        {!stopped && (
          <FadeAnimatedText style={[styles.text, textStyle]} layout={layout}>
            {timer}
          </FadeAnimatedText>
        )}
        <Pause
          layout={layout}
          animatedProps={animatedProps}
          style={[styles.icon, backgroundStyle, pauseStyle]}
        />
        <Play
          layout={layout}
          animatedProps={animatedProps}
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
    height: SIZE,
    width: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 70,
    width: '100%',
    textAlign: 'center',
    marginBottom: 16,
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
