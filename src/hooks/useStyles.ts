import {useCallback, useMemo} from 'react';
import {useColorScheme, useWindowDimensions} from 'react-native';
import {colors} from '../styles';
import {useAtom} from 'jotai';
import {DarkMode, darkModeAtom} from '../atoms/app';

export const useStyles = () => {
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const isDarkMode = useMemo(
    () =>
      darkMode === DarkMode.UNSPECIFIED
        ? colorScheme === 'dark'
        : darkMode === DarkMode.TRUE,
    [colorScheme, darkMode],
  );

  const toggleDarkMode = useCallback(() => {
    if (isDarkMode) {
      setDarkMode(DarkMode.FALSE);
    } else {
      setDarkMode(DarkMode.TRUE);
    }
  }, [isDarkMode, setDarkMode]);

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
    toggleDarkMode,
  };
};
