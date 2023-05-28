import React, {FC} from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {AnimateProps} from 'react-native-reanimated';
import {ViewProps} from 'react-native-svg/lib/typescript/fabric/utils';

type Props = AnimateProps<ViewProps>;

export const FadeAnimatedView: FC<Props> = props => {
  return (
    <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut} {...props} />
  );
};
