import {useAtom, useAtomValue} from 'jotai';
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
import {
  formatNumbers,
  getDurationText,
  getTimeUnits,
  getTimerAndTag,
} from '../utils';
import {Durations, durationsSchema} from '../models/durations';
import Toast from 'react-native-root-toast';
import {Keyboard} from 'react-native';
import {globalTimeModeAtom} from '../atoms/timer';
import {workTimeModeAtom} from '../atoms/timer';
import {restTimeModeAtom} from '../atoms/timer';

// 60 fps
const msPerRender = 1000 / 60;

export type TimerContextValues = ReturnType<typeof useTimerContext>;

export const TimerContext = createContext<TimerContextValues | undefined>(
  undefined,
);

export const useTimerContext = () => {
  const interval = useRef<number>();

  const [globalDuration, setGlobalDuration] = useAtom(globalDurationAtom);
  const [workDuration, setWorkDuration] = useAtom(workDurationAtom);
  const [restDuration, setRestDuration] = useAtom(restDurationAtom);

  const globalTimeMode = useAtomValue(globalTimeModeAtom);
  const workTimeMode = useAtomValue(workTimeModeAtom);
  const restTimeMode = useAtomValue(restTimeModeAtom);

  const [stopped, setStopped] = useState(true);
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(globalDuration);

  const [durationText, setDurationText] = useState(
    getDurationText(globalTimeMode, globalDuration),
  );
  const [workText, setWorkText] = useState(
    getDurationText(workTimeMode, workDuration),
  );
  const [restText, setRestText] = useState(
    getDurationText(restTimeMode, restDuration),
  );

  const iconSize = useSharedValue(1);

  const timeRef = useRef(workDuration);
  const secondsRef = useRef(workDuration);
  const secondsWorking = useRef(true);
  const percentageWorking = useRef(true);
  const previousRunning = useRef(true);

  const [hours, minutes, seconds] = useMemo(() => {
    const {_hours, _minutes, _seconds} = getTimeUnits(duration);
    return [
      formatNumbers(_hours),
      formatNumbers(_minutes),
      formatNumbers(_seconds),
    ];
  }, [duration]);

  const [timer, timeTag] = useMemo(() => {
    if (!running || running !== previousRunning.current) {
      previousRunning.current = running;
      return getTimerAndTag(secondsRef.current);
    }
    if (secondsRef.current <= 0) {
      secondsWorking.current = !secondsWorking.current;
      secondsRef.current =
        (secondsWorking.current ? workDuration : restDuration) - 1000;
    } else {
      secondsRef.current = secondsRef.current - 1000;
    }
    return getTimerAndTag(secondsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restDuration, running, workDuration, seconds]);

  const timerPercentage = useMemo(() => {
    if (stopped) {
      return 1;
    }
    if (!running || running !== previousRunning.current) {
      const totalDuration = percentageWorking.current
        ? workDuration
        : restDuration;
      return timeRef.current / totalDuration;
    }
    if (timeRef.current <= 0) {
      percentageWorking.current = !percentageWorking.current;
      timeRef.current = percentageWorking.current ? workDuration : restDuration;
    } else {
      timeRef.current = timeRef.current - msPerRender;
    }
    const totalDuration = percentageWorking.current
      ? workDuration
      : restDuration;
    return timeRef.current / totalDuration;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restDuration, workDuration, duration, running, stopped]);

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

  const globalMultiplier = useMemo(() => {
    if (globalTimeMode === 'minutes') {
      return 1000 * 60;
    }
    return 1000 * 60 * 60;
  }, [globalTimeMode]);

  const workMultiplier = useMemo(() => {
    if (workTimeMode === 'seconds') {
      return 1000;
    }
    return 1000 * 60;
  }, [workTimeMode]);

  const restMultiplier = useMemo(() => {
    if (restTimeMode === 'seconds') {
      return 1000;
    }
    return 1000 * 60;
  }, [restTimeMode]);

  const play = useCallback(() => {
    Keyboard.dismiss();
    const data: Durations = {
      global: Number.parseInt(durationText, 10),
      work: Number.parseInt(workText, 10),
      rest: Number.parseInt(restText, 10),
    };
    const result = durationsSchema.safeParse(data);

    if (!result.success) {
      Toast.show(result.error.errors[0].message);
      return;
    }

    const _duration = result.data.global * globalMultiplier;
    setGlobalDuration(_duration);
    setDuration(_duration);
    setWorkDuration(result.data.work * workMultiplier);
    setRestDuration(result.data.rest * restMultiplier);
    setStopped(value => {
      if (value) {
        timeRef.current = result.data.work * workMultiplier;
        secondsRef.current = result.data.work * workMultiplier;
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
    globalMultiplier,
    iconSize,
    restMultiplier,
    restText,
    setGlobalDuration,
    setRestDuration,
    setWorkDuration,
    workMultiplier,
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

  const resetValues = useCallback(() => {
    timeRef.current = workDuration;
    secondsRef.current = workDuration;
    percentageWorking.current = true;
    secondsWorking.current = true;
  }, [workDuration]);

  const onReset = useCallback(() => {
    resetValues();
    previousRunning.current = !previousRunning.current;
    setDuration(globalDuration);
    setRunning(true);
  }, [globalDuration, resetValues]);

  const onStop = useCallback(() => {
    resetValues();
    iconSize.value = withTiming(1, {duration: 300, easing: Easing.linear});
    setStopped(true);
    setRunning(false);
    setDuration(globalDuration);
  }, [globalDuration, iconSize, resetValues]);

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
    hours,
    minutes,
    seconds,
    onPlay,
    timer,
    timeTag,
    animatedProps,
    pauseStyle,
    playStyle,
    running,
    onReset,
    onStop,
    duration,
    timerPercentage,
  };
};
