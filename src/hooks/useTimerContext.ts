import {useAtom} from 'jotai';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  globalDurationAtom,
  restDurationAtom,
  workDurationAtom,
} from '../atoms/timer';
import {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {formatNumbers} from '../utils';

// 60 fps
const msPerRender = 1000 / 60;

export type TimerContextValues = ReturnType<typeof useTimerContext>;

export const TimerContext = createContext<TimerContextValues | undefined>(
  undefined,
);

export const useTimerContext = () => {
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

  return {
    stopped,
    durationText,
    setDurationText,
    workText,
    setWorkText,
    restText,
    setRestText,
    minutes,
    seconds,
    onPlay,
    timer,
    animatedProps,
    pauseStyle,
    playStyle,
    running,
    onReset,
    onStop,
  };
};
