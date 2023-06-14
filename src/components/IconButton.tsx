import React, {FC} from 'react';
import {
  Image,
  ImageProps,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {useStyles} from '../hooks/useStylesContext';

type Props = {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  onLongPress?: () => void;
  source: ImageProps['source'];
  testId?: string;
};

export const IconButton: FC<Props> = ({
  style,
  onPress,
  source,
  testId,
  onLongPress,
}) => {
  const {tintStyle} = useStyles();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onLongPress={onLongPress}
      onPress={onPress}
      testID={testId}>
      <Image source={source} style={tintStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
