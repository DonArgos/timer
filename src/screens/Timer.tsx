import React, {FC, useMemo} from 'react';
import {Keyboard, StyleSheet, TouchableWithoutFeedback} from 'react-native';

import Animated, {Layout} from 'react-native-reanimated';
import {useStyles} from '../hooks/useStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextButton} from '../components/TextButton';
import {FadeAnimatedView} from '../components/FadeAnimatedView';
import {FadeAnimatedText} from '../components/FadeAnimatedText';
import {TimerContext, useTimerContext} from '../hooks/useTimerContext';
import {PlayButton} from '../components/PlayButton';
import {MainStackScreenProps, Screens} from './types';
import {IconButton} from '../components/IconButton';
import {DurationsForm} from '../components/DurationsForm';

type Props = MainStackScreenProps<Screens.Timer>;

export const Timer: FC<Props> = () => {
  const {textStyle, isDarkMode, toggleDarkMode} = useStyles();

  const context = useTimerContext();

  const {stopped, minutes, seconds, onReset, onStop} = context;

  const layout = useMemo(() => new Layout(), []);

  return (
    <TimerContext.Provider value={context}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Animated.View style={styles.container} layout={layout}>
            {stopped ? (
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
              <FadeAnimatedText
                style={[styles.time, textStyle]}
                layout={layout}>
                {minutes}:{seconds}
              </FadeAnimatedText>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  time: {
    fontSize: 70,
    marginBottom: 16,
    alignSelf: 'center',
    textAlign: 'center',
    width: '100%',
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
