import {useAtom, useAtomValue} from 'jotai';
import {
  createContext,
  useCallback,
  useContext,
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
  validateNewDuration,
} from '../utils';
import {Durations, durationsSchema} from '../models/durations';
import {globalTimeModeAtom} from '../atoms/timer';
import {workTimeModeAtom} from '../atoms/timer';
import {restTimeModeAtom} from '../atoms/timer';
import {usePreTimer} from './usePreTimer';
import {useAnimations} from './useAnimations';
import {useAppState} from './useAppState';
import {activateKeepAwakeAsync, deactivateKeepAwake} from 'expo-keep-awake';
import {useLanguage} from './useLanguageContext';
import {useNotifications} from './useNotifications';
import {preTimerEnabledAtom} from '../atoms/app';
import {Keyboard} from 'react-native';
import Toast from 'react-native-root-toast';
import {Message} from '../language';

// 60 fps
export const MS_PER_RENDER = 1000 / 60;

export type TimerContextValues = ReturnType<typeof useTimerContext>;

export const TimerContext = createContext<TimerContextValues | undefined>(
  undefined,
);

export const useTimer = () =>
  useContext(TimerContext) || ({} as TimerContextValues);

export const useTimerContext = () => {
  const interval = useRef<number>();

  const [globalDuration, setGlobalDuration] = useAtom(globalDurationAtom);
  const [workDuration, setWorkDuration] = useAtom(workDurationAtom);
  const [restDuration, setRestDuration] = useAtom(restDurationAtom);
  const [timerPauseData, setTimerPauseData] = useAtom(timerPauseDataAtom);

  const [globalTimeMode, setGlobalTimeMode] = useAtom(globalTimeModeAtom);
  const [workTimeMode, setWorkTimeMode] = useAtom(workTimeModeAtom);
  const [restTimeMode, setRestTimeMode] = useAtom(restTimeModeAtom);

  const preTimerEnabled = useAtomValue(preTimerEnabledAtom);

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

  const {iconAnimatedProps, playStyle, pauseStyle} = useAnimations(stopped);

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
    setStopped(false);
    setRunning(value => {
      if (value) {
        deactivateKeepAwake();
      } else {
        activateKeepAwakeAsync();
      }
      return !value;
    });
  }, []);

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
      }
      return false;
    });
    setRunning(value => !value);
  }, [
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
  } = usePreTimer({play});

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
        Keyboard.dismiss();
        const data: Durations = {
          global: Number.parseInt(durationText, 10),
          work: Number.parseInt(workText, 10),
          rest: Number.parseInt(restText, 10),
        };
        const result = durationsSchema.safeParse(data);

        if (!result.success) {
          Toast.show(label(result.error.errors[0].message as Message));
          return;
        }

        if (preTimerEnabled) {
          startPreTimer();
        } else {
          play();
        }
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
      setTimerPauseData,
      durationText,
      workText,
      restText,
      preTimerEnabled,
      label,
      startPreTimer,
      play,
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

    setTimerPauseData(null);
    setDuration(globalDuration);
    setRunning(false);
    setPreTimerRunning(true);
    setStopped(true);
  }, [globalDuration, resetValues, setPreTimerRunning, setTimerPauseData]);

  const onStop = useCallback(() => {
    resetValues();

    deactivateKeepAwake();
    setTimerPauseData(null);
    setStopped(true);
    setRunning(false);
    setDuration(globalDuration);
  }, [globalDuration, resetValues, setTimerPauseData]);

  const toggleGlobalTimeMode = useCallback(() => {
    setGlobalTimeMode(value => {
      const [_duration, validDuration] = validateNewDuration(durationText);
      if (value === 'minutes') {
        setGlobalDuration(_value => {
          const newDuration = validDuration
            ? _duration * 1000 * 60 * 60
            : _value * 60;
          setDuration(newDuration);
          return newDuration;
        });
        return 'hours';
      }
      setGlobalDuration(_value => {
        const newDuration = validDuration ? _duration * 1000 * 60 : _value / 60;
        setDuration(newDuration);
        return newDuration;
      });
      return 'minutes';
    });
  }, [durationText, setGlobalDuration, setGlobalTimeMode]);

  const toggleWorkTimeMode = useCallback(() => {
    setWorkTimeMode(value => {
      const [_duration, validDuration] = validateNewDuration(workText);
      if (value === 'minutes') {
        setWorkDuration(_value =>
          validDuration ? _duration * 1000 : _value / 60,
        );
        return 'seconds';
      }
      setWorkDuration(_value =>
        validDuration ? _duration * 1000 * 60 : _value * 60,
      );
      return 'minutes';
    });
  }, [setWorkDuration, setWorkTimeMode, workText]);

  const toggleRestTimeMode = useCallback(() => {
    setRestTimeMode(value => {
      const [_duration, validDuration] = validateNewDuration(restText);
      if (value === 'minutes') {
        setRestDuration(_value =>
          validDuration ? _duration * 1000 : _value / 60,
        );
        return 'seconds';
      }
      setRestDuration(_value =>
        validDuration ? _duration * 1000 * 60 : _value * 60,
      );
      return 'minutes';
    });
  }, [restText, setRestDuration, setRestTimeMode]);

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
    toggleGlobalTimeMode,
    toggleWorkTimeMode,
    toggleRestTimeMode,
    globalTimeMode,
    workTimeMode,
    restTimeMode,
  };
};
