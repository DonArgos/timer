import React, {FC} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {useStyles} from '../hooks/useStyles';

type Props = TouchableOpacityProps;

export const TextButton: FC<Props> = ({children, style, ...props}) => {
  const {textStyle} = useStyles();

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 24,
    textTransform: 'uppercase',
    alignSelf: 'center',
  },
});
