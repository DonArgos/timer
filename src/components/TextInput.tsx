import React, {FC} from 'react';
import {
  View,
  TextInput as TextInputBase,
  TextInputProps,
  Text,
  StyleSheet,
} from 'react-native';
import {useStyles} from '../hooks/useStyles';

type Props = TextInputProps;

export const TextInput: FC<Props> = ({placeholder, style, ...props}) => {
  const {borderStyle, textStyle} = useStyles();

  return (
    <View style={style}>
      {Boolean(placeholder) && (
        <Text style={[styles.text, textStyle]}>{placeholder}</Text>
      )}
      <TextInputBase
        style={[styles.textInput, textStyle, borderStyle]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
});
