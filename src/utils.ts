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
export const getTimerAndTag = (duration: number) => {
  const {_minutes, _seconds} = getTimeUnits(duration);
  return _minutes > 0 ? [_minutes + 1, 'min'] : [_seconds + 1, 'seg'];
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
