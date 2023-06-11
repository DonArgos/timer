import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MS_PER_RENDER} from './useTimerContext';
import {getTimeUnits} from '../utils';

type Props = {
  play: () => void;
};

export const usePreTimer = ({play}: Props) => {
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
    setRunning(true);
  }, []);

  return {
    preTimerDuration: duration,
    preTimer: timer,
    setPreTimerRunning: setRunning,
    startPreTimer: start,
    preTimerRunning: running,
  };
};
