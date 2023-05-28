export const formatNumbers = (number: number) => {
  const newNumber = Math.floor(number);
  return newNumber < 10 ? `0${newNumber}` : `${newNumber}`;
};
