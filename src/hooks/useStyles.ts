import {useMemo} from 'react';
import {useColorScheme, useWindowDimensions} from 'react-native';
import {colors} from '../styles';

export const useStyles = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {width, height} = useWindowDimensions();

  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: isDarkMode ? colors.black : colors.white,
    }),
    [isDarkMode],
  );

  const textStyle = useMemo(
    () => ({
      color: isDarkMode ? colors.white : colors.black,
    }),
    [isDarkMode],
  );

  const borderStyle = useMemo(
    () => ({
      borderColor: isDarkMode ? colors.white : colors.black,
    }),
    [isDarkMode],
  );

  const tintStyle = useMemo(
    () => ({
      tintColor: isDarkMode ? colors.white : colors.black,
    }),
    [isDarkMode],
  );

  const secondaryColor = useMemo(
    () => (isDarkMode ? colors.grayText : colors.gray),
    [isDarkMode],
  );

  return {
    isDarkMode,
    backgroundStyle,
    textStyle,
    borderStyle,
    tintStyle,
    secondaryColor,
    width,
    height,
  };
};
