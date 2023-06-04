import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MS_PER_RENDER} from './useTimerContext';
import {getTimeUnits} from '../utils';
import {Keyboard} from 'react-native';
import {Durations, durationsSchema} from '../models/durations';
import Toast from 'react-native-root-toast';

type Props = {
  play: () => void;
  durationText: string;
  workText: string;
  restText: string;
};

export const usePreTimer = ({
  play,
  durationText,
  workText,
  restText,
}: Props) => {
  const interval = useRef<number>();

  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(5000);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setDuration(value => {
          const newValue = value - MS_PER_RENDER;
          if (newValue <= 0) {
            setRunning(false);
            play();
            return 5000;
          }
          return newValue;
        });
      }, MS_PER_RENDER);
    } else if (interval.current) {
      clearInterval(interval.current);
    }
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [play, running]);

  const timer = useMemo(() => getTimeUnits(duration)._seconds + 1, [duration]);

  const start = useCallback(() => {
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

    setRunning(true);
  }, [durationText, restText, workText]);

  return {
    preTimerDuration: duration,
    preTimer: timer,
    setPreTimerRunning: setRunning,
    startPreTimer: start,
    preTimerRunning: running,
  };
};
