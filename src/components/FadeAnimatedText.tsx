import React, {FC} from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {AnimateProps} from 'react-native-reanimated';
import {TextProps} from 'react-native';

type Props = AnimateProps<TextProps>;

export const FadeAnimatedText: FC<Props> = props => {
  return (
    <Animated.Text entering={FadeIn.delay(200)} exiting={FadeOut} {...props} />
  );
};
