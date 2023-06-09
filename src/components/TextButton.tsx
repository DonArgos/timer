import React, {FC} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {useStyles} from '../hooks/useStyles';

type Props = TouchableOpacityProps & {
  largeText?: boolean;
  underline?: boolean;
};

export const TextButton: FC<Props> = ({
  children,
  style,
  largeText,
  underline,
  ...props
}) => {
  const {textStyle} = useStyles();

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <Text
        style={[
          styles.text,
          largeText && styles.textLarge,
          textStyle,
          underline && styles.underline,
        ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    textTransform: 'uppercase',
    alignSelf: 'center',
    fontWeight: '700',
  },
  textLarge: {
    fontSize: 24,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
