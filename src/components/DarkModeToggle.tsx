import React, {FC} from 'react';
import {Layout} from 'react-native-reanimated';
import {StyleProp, ViewStyle} from 'react-native/types';
import {FadeAnimatedView} from './FadeAnimatedView';
import {IconButton} from './IconButton';
import {useStyles} from '../hooks/useStyles';

type Props = {
  layout: Layout;
  style: StyleProp<ViewStyle>;
  onPress: () => void;
};

export const DarkModeToggle: FC<Props> = ({layout, style, onPress}) => {
  const {isDarkMode} = useStyles();

  return (
    <FadeAnimatedView layout={layout} style={style}>
      <IconButton
        onPress={onPress}
        source={
          isDarkMode
            ? require('../assets/icons/sun.png')
            : require('../assets/icons/moon.png')
        }
      />
    </FadeAnimatedView>
  );
};
