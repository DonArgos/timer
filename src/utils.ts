export const formatNumbers = (number: number) => {
  const newNumber = Math.floor(number);
  return newNumber < 10 ? `0${newNumber}` : `${newNumber}`;
};

/**
 * @param duration miliseconds
 */
export const getTimeUnits = (duration: number) => {
  const _hours = Math.floor(duration / 1000 / 60 / 60);
  const _minutes = Math.floor((duration / 1000 / 60) % 60);
  const _seconds = Math.floor((duration / 1000) % 60);
  return {_hours, _minutes, _seconds};
};

/**
 * @param duration miliseconds
 */
export const getTimerAndTag = (
  duration: number,
  minutesLabel: string,
  secondsLabel: string,
) => {
  const {_minutes, _seconds} = getTimeUnits(duration);
  return _minutes > 0
    ? [_minutes + 1, minutesLabel]
    : [_seconds + 1, secondsLabel];
};

/**
 * @param duration miliseconds
 */
export const getDurationText = (
  timeMode: 'seconds' | 'minutes' | 'hours',
  duration: number,
) => {
  if (timeMode === 'seconds') {
    return (duration / 1000).toString();
  }
  if (timeMode === 'minutes') {
    return (duration / 1000 / 60).toString();
  }
  return (duration / 1000 / 60 / 60).toString();
};

export const calculateNewTimer = (
  timePassed: number,
  working: boolean,
  currentTimer: number,
  workDuration: number,
  restDuration: number,
) => {
  const secondsPassed = Math.round(timePassed / 1000);

  for (let i = secondsPassed; i > 0; i--) {
    if (currentTimer === 0) {
      working = !working;
      currentTimer = working ? workDuration : restDuration;
    } else {
      currentTimer = currentTimer - 1000;
    }
  }

  return {currentTimer, working};
};

export const calculateOcurrences = (
  totalDuration: number,
  workDuration: number,
  restDuration: number,
) => {
  let workOccurrences = 0;
  let restOccurrences = 0;
  let sum = 0;
  let finished = false;

  while (sum <= totalDuration && !finished) {
    sum = workOccurrences * workDuration + restOccurrences * restDuration;

    if (sum <= totalDuration) {
      let added = false;
      if (sum + workDuration <= totalDuration) {
        added = true;
        workOccurrences++;
      }

      if (sum + restDuration <= totalDuration) {
        added = true;
        restOccurrences++;
      }
      if (!added) {
        finished = true;
      }
    }
  }

  return {
    workOccurrences,
    restOccurrences,
  };
};
