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
  timerPauseDataAtom,
  workDurationAtom,
} from '../atoms/timer';
import {
  calculateNewTimer,
  formatNumbers,
  getDurationText,
  getTimeUnits,
  getTimerAndTag,
} from '../utils';
import {Durations, durationsSchema} from '../models/durations';
import {globalTimeModeAtom} from '../atoms/timer';
import {workTimeModeAtom} from '../atoms/timer';
import {restTimeModeAtom} from '../atoms/timer';
import {usePreTimer} from './usePreTimer';
import {AnimationState, useAnimations} from './useAnimations';
import {useAppState} from './useAppState';
import {activateKeepAwakeAsync, deactivateKeepAwake} from 'expo-keep-awake';
import {useLanguage} from './useLanguage';
import {useNotifications} from './useNotifications';

// 60 fps
export const MS_PER_RENDER = 1000 / 60;

export type TimerContextValues = ReturnType<typeof useTimerContext>;

export const TimerContext = createContext<TimerContextValues | undefined>(
  undefined,
);

export const useTimerContext = () => {
  const interval = useRef<number>();

  const [globalDuration, setGlobalDuration] = useAtom(globalDurationAtom);
  const [workDuration, setWorkDuration] = useAtom(workDurationAtom);
  const [restDuration, setRestDuration] = useAtom(restDurationAtom);
  const [timerPauseData, setTimerPauseData] = useAtom(timerPauseDataAtom);

  const globalTimeMode = useAtomValue(globalTimeModeAtom);
  const workTimeMode = useAtomValue(workTimeModeAtom);
  const restTimeMode = useAtomValue(restTimeModeAtom);

  const [stopped, setStopped] = useState(true);
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(globalDuration);

  const durationRef = useRef(duration);

  const [durationText, setDurationText] = useState(
    getDurationText(globalTimeMode, globalDuration),
  );
  const [workText, setWorkText] = useState(
    getDurationText(workTimeMode, workDuration),
  );
  const [restText, setRestText] = useState(
    getDurationText(restTimeMode, restDuration),
  );

  const {label} = useLanguage();
  const {scheduleNotifications} = useNotifications();

  const {animateIcon, iconAnimatedProps, playStyle, pauseStyle} =
    useAnimations();

  const percentageRef = useRef(workDuration);
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
      return getTimerAndTag(
        secondsRef.current,
        label('minutesTag'),
        label('secondsTag'),
      );
    }
    if (secondsRef.current <= 0) {
      secondsWorking.current = !secondsWorking.current;
      percentageWorking.current = secondsWorking.current;
      percentageRef.current = percentageWorking.current
        ? workDuration
        : restDuration;
      secondsRef.current =
        (secondsWorking.current ? workDuration : restDuration) - 1000;
    } else {
      secondsRef.current = secondsRef.current - 1000;
    }
    return getTimerAndTag(
      secondsRef.current,
      label('minutesTag'),
      label('secondsTag'),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restDuration, running, workDuration, seconds, label]);

  const timerPercentage = useMemo(() => {
    if (stopped) {
      return 1;
    }
    if (!running || running !== previousRunning.current) {
      const totalDuration = percentageWorking.current
        ? workDuration
        : restDuration;
      return percentageRef.current / totalDuration;
    }
    if (percentageRef.current <= 0) {
      return 1;
    }

    percentageRef.current = percentageRef.current - MS_PER_RENDER;

    const totalDuration = percentageWorking.current
      ? workDuration
      : restDuration;
    return percentageRef.current / totalDuration;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restDuration, workDuration, duration, running, stopped]);

  const toggleTimer = useCallback(() => {
    setStopped(value => {
      if (value) {
        animateIcon(AnimationState.FINISH);
      }
      return false;
    });
    setRunning(value => {
      if (value) {
        deactivateKeepAwake();
      } else {
        activateKeepAwakeAsync();
      }
      return !value;
    });
  }, [animateIcon]);

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
    const data: Durations = {
      global: Number.parseInt(durationText, 10),
      work: Number.parseInt(workText, 10),
      rest: Number.parseInt(restText, 10),
    };
    const result = durationsSchema.parse(data);

    const _duration = result.global * globalMultiplier;

    activateKeepAwakeAsync();
    setGlobalDuration(_duration);
    setDuration(_duration);
    setWorkDuration(result.work * workMultiplier);
    setRestDuration(result.rest * restMultiplier);
    setStopped(value => {
      if (value) {
        percentageRef.current = result.work * workMultiplier;
        secondsRef.current = result.work * workMultiplier;
        animateIcon(AnimationState.FINISH);
      }
      return false;
    });
    setRunning(value => !value);
  }, [
    animateIcon,
    durationText,
    globalMultiplier,
    restMultiplier,
    restText,
    setGlobalDuration,
    setRestDuration,
    setWorkDuration,
    workMultiplier,
    workText,
  ]);

  const {
    preTimerDuration,
    preTimer,
    setPreTimerRunning,
    startPreTimer,
    preTimerRunning,
  } = usePreTimer({
    play,
    durationText,
    restText,
    workText,
  });

  const onPause = useCallback(
    (fromBackground: boolean = false) => {
      if (fromBackground && running) {
        setTimerPauseData({
          duration: durationRef.current,
          timestamp: Date.now(),
          timerDuration: secondsRef.current,
          working: secondsWorking.current,
        });
        setRunning(false);
        setPreTimerRunning(false);

        scheduleNotifications(
          durationRef.current,
          secondsRef.current,
          secondsWorking.current,
        );
        return;
      }
      deactivateKeepAwake();
      setRunning(false);
      setPreTimerRunning(false);
    },
    [running, scheduleNotifications, setPreTimerRunning, setTimerPauseData],
  );

  const onPlay = useCallback(
    (fromBackground: boolean = false) => {
      if (fromBackground) {
        if (preTimerDuration < 5000) {
          setPreTimerRunning(true);
          return;
        }
        if (timerPauseData) {
          const timePassed = Date.now() - timerPauseData.timestamp;
          const newDuration = timerPauseData.duration - timePassed;

          const {currentTimer, working} = calculateNewTimer(
            timePassed,
            timerPauseData.working,
            timerPauseData.timerDuration,
            workDuration,
            restDuration,
          );

          // there could be a bit of time offset on the percentage so adding 300 to mitigate it
          percentageRef.current = currentTimer + 300;
          secondsRef.current = currentTimer;
          secondsWorking.current = working;
          percentageWorking.current = working;

          animateIcon(AnimationState.FINISH);

          setDuration(newDuration);
          setStopped(false);
          setRunning(true);
          setTimerPauseData(null);
          return;
        }
        if (preTimerDuration === 5000 && stopped) {
          return;
        }
        return;
      }
      if (stopped) {
        startPreTimer();
      } else {
        toggleTimer();
      }
    },
    [
      stopped,
      preTimerDuration,
      timerPauseData,
      setPreTimerRunning,
      workDuration,
      restDuration,
      animateIcon,
      setTimerPauseData,
      startPreTimer,
      toggleTimer,
    ],
  );

  useAppState(onPlay, onPause);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setDuration(value => {
          const newValue = value - MS_PER_RENDER;
          if (newValue <= 0) {
            onPause();
            return 0;
          }
          durationRef.current = newValue;
          return newValue;
        });
      }, MS_PER_RENDER);
    } else {
      if (interval.current) {
        clearInterval(interval.current);
      }
    }
    previousRunning.current = running;
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [onPause, running, setDuration]);

  const resetValues = useCallback(() => {
    durationRef.current = globalDuration;
    percentageRef.current = workDuration;
    secondsRef.current = workDuration;
    percentageWorking.current = true;
    secondsWorking.current = true;
  }, [globalDuration, workDuration]);

  const onReset = useCallback(() => {
    resetValues();
    previousRunning.current = !previousRunning.current;
    animateIcon(AnimationState.START);

    setTimerPauseData(null);
    setDuration(globalDuration);
    setRunning(false);
    setPreTimerRunning(true);
    setStopped(true);
  }, [
    animateIcon,
    globalDuration,
    resetValues,
    setPreTimerRunning,
    setTimerPauseData,
  ]);

  const onStop = useCallback(() => {
    resetValues();
    animateIcon(AnimationState.START);

    deactivateKeepAwake();
    setTimerPauseData(null);
    setStopped(true);
    setRunning(false);
    setDuration(globalDuration);
  }, [animateIcon, globalDuration, resetValues, setTimerPauseData]);

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
    toggleTimer,
    timer,
    timeTag,
    iconAnimatedProps,
    pauseStyle,
    playStyle,
    running,
    onReset,
    onStop,
    duration,
    timerPercentage,
    preTimerRunning,
    preTimer,
    preTimerDuration,
  };
};
