import React, {FC, useContext} from 'react';
import Animated, {Layout} from 'react-native-reanimated';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {useStyles} from '../hooks/useStyles';
import {FadeAnimatedText} from './FadeAnimatedText';
import {Pause} from '../assets/icons/Pause';
import {Play} from '../assets/icons/Play';
import {TimerContext} from '../hooks/useTimerContext';

type Props = {
  layout: Layout;
  style?: StyleProp<ViewStyle>;
};

export const PlayButton: FC<Props> = ({layout, style}) => {
  const {backgroundStyle, textStyle, borderStyle} = useStyles();
  const {
    stopped,
    timer,
    animatedProps,
    pauseStyle,
    playStyle,
    running,
    onPlay,
  } = useContext(TimerContext) || {};

  return (
    <Animated.View layout={layout}>
      <TouchableOpacity
        style={[styles.container, borderStyle, backgroundStyle, style]}
        onPress={onPlay}>
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
    alignSelf: 'center',
    height: 250,
    width: 250,
    borderWidth: 2,
    borderRadius: 125,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
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
