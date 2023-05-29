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
};

export const TextButton: FC<Props> = ({
  children,
  style,
  largeText,
  ...props
}) => {
  const {textStyle} = useStyles();

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <Text style={[styles.text, largeText && styles.textLarge, textStyle]}>
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
  },
  textLarge: {
    fontSize: 24,
    fontWeight: '700',
  },
});
