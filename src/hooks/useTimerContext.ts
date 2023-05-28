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
  const [workDuration, setWorkDuration] = useAtom(workDurationAtom);
  const [restDuration, setRestDuration] = useAtom(restDurationAtom);
  const [durationText, setDurationText] = useState(
    (globalDuration / 1000 / 60).toString(),
  );
  const [workText, setWorkText] = useState((workDuration / 1000).toString());
  const [restText, setRestText] = useState((restDuration / 1000).toString());
  const iconSize = useSharedValue(1);

  const timeRef = useRef(workDuration);
  const working = useRef(true);
  const previousRunning = useRef(true);

  const [minutes, seconds] = useMemo(() => {
    const _minutes = Math.floor(duration / 1000 / 60);
    const _seconds = Math.floor((duration / 1000) % 60);
    return [formatNumbers(_minutes), formatNumbers(_seconds)];
  }, [duration]);

  const [timer, timerPercentage] = useMemo(() => {
    if (!running || running !== previousRunning.current) {
      previousRunning.current = running;
      const time = timeRef.current / 1000;
      return [Math.floor(time), 1];
    }
    if (timeRef.current <= 0) {
      working.current = !working.current;
      timeRef.current =
        (working.current ? workDuration : restDuration) - msPerRender;
    } else {
      timeRef.current = timeRef.current - msPerRender;
    }
    const time = timeRef.current / 1000;
    const totalDuration = working.current ? workDuration : restDuration;
    return [Math.floor(time), timeRef.current / totalDuration];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restDuration, workDuration, duration, running]);

  const pause = useCallback(() => {
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
  }, [iconSize]);

  const play = useCallback(() => {
    const _duration =
      (durationText.length ? Number.parseInt(durationText, 10) : 0) * 1000 * 60;
    setGlobalDuration(_duration);
    setDuration(_duration);
    setWorkDuration(workText.length ? Number.parseInt(workText, 10) * 1000 : 0);
    setRestDuration(restText.length ? Number.parseInt(restText, 10) * 1000 : 0);
    setStopped(value => {
      if (value) {
        timeRef.current = workText.length
          ? Number.parseInt(workText, 10) * 1000
          : 0;
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
    setRestDuration,
    setWorkDuration,
    workText,
  ]);

  const onPlay = useCallback(() => {
    if (stopped) {
      play();
    } else {
      pause();
    }
  }, [pause, play, stopped]);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setDuration(value => {
          const newValue = value - msPerRender;
          if (newValue <= 0) {
            pause();
            return 0;
          }
          return newValue;
        });
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
  }, [pause, running, setDuration]);

  const onReset = useCallback(() => {
    timeRef.current = workDuration;
    previousRunning.current = !previousRunning.current;
    setDuration(globalDuration);
    setRunning(true);
  }, [globalDuration, workDuration]);

  const onStop = useCallback(() => {
    timeRef.current = workDuration;
    iconSize.value = withTiming(1, {duration: 300, easing: Easing.linear});
    setStopped(true);
    setRunning(false);
    setDuration(globalDuration);
  }, [globalDuration, iconSize, workDuration]);

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
    duration,
    timeRef,
    working,
    timerPercentage,
  };
};
