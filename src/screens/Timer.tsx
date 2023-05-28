import React, {FC, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import Animated, {Layout} from 'react-native-reanimated';
import {useStyles} from '../hooks/useStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextButton} from '../components/TextButton';
import {FadeAnimatedView} from '../components/FadeAnimatedView';
import {FadeAnimatedText} from '../components/FadeAnimatedText';
import {TextInput} from '../components/TextInput';
import {TimerContext, useTimerContext} from '../hooks/useTimerContext';
import {PlayButton} from '../components/PlayButton';

export const Timer: FC = () => {
  const {textStyle} = useStyles();

  const context = useTimerContext();

  const {
    stopped,
    durationText,
    setDurationText,
    workText,
    setWorkText,
    restText,
    setRestText,
    minutes,
    seconds,
    onReset,
    onStop,
  } = context;

  const layout = useMemo(() => new Layout(), []);

  return (
    <TimerContext.Provider value={context}>
      <SafeAreaView style={styles.container}>
        <Animated.View style={styles.container} layout={layout}>
          {stopped && (
            <FadeAnimatedView layout={layout}>
              <TextInput
                placeholder="Duración total"
                value={durationText}
                maxLength={9}
                onChangeText={text => setDurationText(text)}
                inputMode="numeric"
                style={styles.textInput}
              />
              <TextInput
                placeholder="Tiempo de trabajo"
                value={workText}
                maxLength={9}
                onChangeText={text => setWorkText(text)}
                inputMode="numeric"
                style={styles.textInput}
              />
              <TextInput
                placeholder="Tiempo de descanso"
                value={restText}
                maxLength={9}
                onChangeText={text => setRestText(text)}
                inputMode="numeric"
                style={styles.textInput}
              />
            </FadeAnimatedView>
          )}
          {!stopped && (
            <FadeAnimatedText style={[styles.time, textStyle]} layout={layout}>
              {minutes}:{seconds}
            </FadeAnimatedText>
          )}
          <PlayButton layout={layout} />
          {!stopped && (
            <FadeAnimatedView layout={layout}>
              <TextButton style={styles.reset} onPress={onReset}>
                Reiniciar
              </TextButton>
              <TextButton style={styles.stop} onPress={onStop}>
                Parar
              </TextButton>
            </FadeAnimatedView>
          )}
        </Animated.View>
      </SafeAreaView>
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
  textInput: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
