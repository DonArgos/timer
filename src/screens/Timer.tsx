import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {formatNumbers} from '../utils';
import {useAtom} from 'jotai';
import {
  globalDurationAtom,
  restDurationAtom,
  workDurationAtom,
} from '../atoms/timer';
import Animated, {
  Easing,
  Layout,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useStyles} from '../hooks/useStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Pause} from '../assets/icons/Pause';
import {Play} from '../assets/icons/Play';
import {TextButton} from '../components/TextButton';
import {FadeAnimatedView} from '../components/FadeAnimatedView';
import {FadeAnimatedText} from '../components/FadeAnimatedText';
import {TextInput} from '../components/TextInput';

// 60 fps
const msPerRender = 1000 / 60;

export const Timer: FC = () => {
  const {backgroundStyle, textStyle, borderStyle} = useStyles();

  const interval = useRef<number>();
  const [stopped, setStopped] = useState(true);
  const [running, setRunning] = useState(false);
  const [globalDuration, setGlobalDuration] = useAtom(globalDurationAtom);
  const [duration, setDuration] = useState(globalDuration);
  const [workSeconds, setWorkSeconds] = useAtom(workDurationAtom);
  const [restSeconds, setRestSeconds] = useAtom(restDurationAtom);
  const [durationText, setDurationText] = useState(
    (globalDuration / 1000 / 60).toString(),
  );
  const [workText, setWorkText] = useState(workSeconds.toString());
  const [restText, setRestText] = useState(restSeconds.toString());
  const iconSize = useSharedValue(1);

  const timeRef = useRef(workSeconds);
  const working = useRef(true);
  const previousRunning = useRef(true);

  const [minutes, seconds] = useMemo(() => {
    const _minutes = Math.floor(duration / 1000 / 60);
    const _seconds = Math.floor((duration / 1000) % 60);
    return [formatNumbers(_minutes), formatNumbers(_seconds)];
  }, [duration]);

  const timer = useMemo(() => {
    if (!running || running !== previousRunning.current) {
      previousRunning.current = running;
      return formatNumbers(timeRef.current);
    }
    if (timeRef.current === 0) {
      working.current = !working.current;
      timeRef.current = (working.current ? workSeconds : restSeconds) - 1;
    } else {
      timeRef.current = timeRef.current - 1;
    }
    return formatNumbers(timeRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restSeconds, workSeconds, seconds, running]);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setDuration(value => value - msPerRender);
      }, msPerRender);
    } else if (interval.current) {
      clearInterval(interval.current);
    }
    previousRunning.current = running;
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [running, setDuration]);

  const onReset = useCallback(() => {
    timeRef.current = workSeconds;
    previousRunning.current = !previousRunning.current;
    setDuration(globalDuration);
  }, [globalDuration, workSeconds]);

  const onStop = useCallback(() => {
    timeRef.current = workSeconds;
    iconSize.value = withTiming(1, {duration: 300, easing: Easing.linear});
    setStopped(true);
    setRunning(false);
    setDuration(globalDuration);
  }, [globalDuration, iconSize, workSeconds]);

  const layout = useMemo(() => new Layout(), []);

  const animatedProps = useAnimatedProps(() => ({
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

  const onPlay = useCallback(() => {
    if (stopped) {
      const _duration =
        (durationText.length ? Number.parseInt(durationText, 10) : 0) *
        1000 *
        60;
      setGlobalDuration(_duration);
      setDuration(_duration);
      setWorkSeconds(workText.length ? Number.parseInt(workText, 10) : 0);
      setRestSeconds(restText.length ? Number.parseInt(restText, 10) : 0);
      setStopped(value => {
        if (value) {
          timeRef.current = workText.length ? Number.parseInt(workText, 10) : 0;
          iconSize.value = withTiming(0, {
            duration: 200,
            easing: Easing.linear,
          });
        }
        return false;
      });
      setRunning(value => !value);
      return;
    }
    setStopped(value => {
      if (value) {
        iconSize.value = withTiming(0, {
          duration: 200,
          easing: Easing.linear,
        });
      }
      return false;
    });
    setRunning(value => !value);
  }, [
    durationText,
    iconSize,
    restText,
    setGlobalDuration,
    setRestSeconds,
    setWorkSeconds,
    stopped,
    workText,
  ]);

  return (
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
        <Animated.View layout={layout}>
          <TouchableOpacity
            style={[styles.button, borderStyle, backgroundStyle]}
            onPress={onPlay}>
            {!stopped && (
              <FadeAnimatedText
                style={[styles.text, textStyle]}
                layout={layout}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'center',
    height: 250,
    width: 250,
    borderWidth: 2,
    borderRadius: 125,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  time: {
    fontSize: 70,
    marginBottom: 16,
    alignSelf: 'center',
    textAlign: 'center',
    width: '100%',
  },
  text: {
    fontSize: 70,
    width: '100%',
    textAlign: 'center',
    marginBottom: 16,
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
