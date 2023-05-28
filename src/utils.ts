export const formatNumbers = (number: number) =>
  number < 10 ? `0${number}` : `${number}`;
