import React, {FC, useMemo} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
} from 'react-native';

import Animated, {Layout} from 'react-native-reanimated';
import {useStyles} from '../hooks/useStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextButton} from '../components/TextButton';
import {FadeAnimatedView} from '../components/FadeAnimatedView';
import {TimerContext, useTimerContext} from '../hooks/useTimerContext';
import {PlayButton} from '../components/PlayButton';
import {MainStackScreenProps, Screens} from './types';
import {IconButton} from '../components/IconButton';
import {DurationsForm} from '../components/DurationsForm';

type Props = MainStackScreenProps<Screens.Timer>;

export const Timer: FC<Props> = () => {
  const {textStyle, isDarkMode, toggleDarkMode} = useStyles();

  const context = useTimerContext();

  const {
    stopped,
    hours,
    minutes,
    seconds,
    onReset,
    onStop,
    preTimerRunning,
    preTimer,
  } = context;

  const layout = useMemo(() => new Layout(), []);

  const minutesText = useMemo(() => {
    const _hours = Number.parseInt(hours, 10);
    if (_hours > 0) {
      return hours;
    }
    return minutes;
  }, [hours, minutes]);

  const secondsText = useMemo(() => {
    const _hours = Number.parseInt(hours, 10);
    if (_hours > 0) {
      return minutes;
    }
    return seconds;
  }, [hours, minutes, seconds]);

  return (
    <TimerContext.Provider value={context}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Animated.View style={styles.container} layout={layout}>
            {preTimerRunning ? (
              <FadeAnimatedView layout={layout}>
                <Text style={[styles.preTimer, textStyle]}>{preTimer}</Text>
                <Text style={[styles.starting, textStyle]}>iniciando</Text>
              </FadeAnimatedView>
            ) : stopped ? (
              <>
                <FadeAnimatedView
                  layout={layout}
                  style={styles.settingsContainer}>
                  <IconButton
                    onPress={toggleDarkMode}
                    source={
                      isDarkMode
                        ? require('../assets/icons/sun.png')
                        : require('../assets/icons/moon.png')
                    }
                  />
                </FadeAnimatedView>
                <DurationsForm layout={layout} />
              </>
            ) : (
              <FadeAnimatedView layout={layout} style={styles.timeContainer}>
                <Text style={[styles.minutes, textStyle]}>{minutesText}</Text>
                <Text style={[styles.colon, textStyle]}>:</Text>
                <Text style={[styles.seconds, textStyle]}>{secondsText}</Text>
              </FadeAnimatedView>
            )}
            <PlayButton layout={layout} />
            {!stopped && (
              <FadeAnimatedView layout={layout}>
                <TextButton style={styles.reset} onPress={onReset} largeText>
                  Reiniciar
                </TextButton>
                <TextButton style={styles.stop} onPress={onStop} largeText>
                  Parar
                </TextButton>
              </FadeAnimatedView>
            )}
          </Animated.View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </TimerContext.Provider>
  );
};

const textStyle: TextStyle = {
  fontSize: 70,
  fontStyle: 'italic',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  timeContainer: {
    marginBottom: 16,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  starting: {
    fontSize: 32,
    width: '100%',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
  },
  preTimer: {
    ...textStyle,
    width: '100%',
    textAlign: 'center',
  },
  minutes: {
    ...textStyle,
    flex: 1,
    textAlign: 'right',
  },
  colon: {
    ...textStyle,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  seconds: {
    ...textStyle,
    flex: 1,
    textAlign: 'left',
  },
  reset: {
    marginTop: 32,
  },
  stop: {
    marginTop: 16,
  },
  settingsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
