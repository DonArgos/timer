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
  const preTimerInterval = useRef<number>();
  const [preTimerRunning, setPreTimerRunning] = useState(false);
  const [preTimerDuration, setPreTimerDuration] = useState(5000);

  useEffect(() => {
    if (preTimerRunning) {
      preTimerInterval.current = setInterval(() => {
        setPreTimerDuration(value => {
          const newValue = value - MS_PER_RENDER;
          if (newValue <= 0) {
            setPreTimerRunning(false);
            play();
            return 5000;
          }
          return newValue;
        });
      }, MS_PER_RENDER);
    } else if (preTimerInterval.current) {
      clearInterval(preTimerInterval.current);
    }
    return () => {
      if (preTimerInterval.current) {
        clearInterval(preTimerInterval.current);
      }
    };
  }, [play, preTimerRunning]);

  const preTimer = useMemo(
    () => getTimeUnits(preTimerDuration)._seconds + 1,
    [preTimerDuration],
  );

  const startPreTimer = useCallback(() => {
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

    setPreTimerRunning(true);
  }, [durationText, restText, workText]);

  return {preTimer, setPreTimerRunning, startPreTimer, preTimerRunning};
};
