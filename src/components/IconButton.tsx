import React, {FC} from 'react';
import {
  Image,
  ImageProps,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {useStyles} from '../hooks/useStyles';

type Props = {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  source: ImageProps['source'];
};

export const IconButton: FC<Props> = ({style, onPress, source}) => {
  const {tintStyle} = useStyles();

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Image source={source} style={tintStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
