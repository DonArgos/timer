import React, {FC} from 'react';
import {Path} from 'react-native-svg';
import {useStyles} from '../../hooks/useStylesContext';
import {AnimatedProps} from './types';
import {AnimatedSvg} from '../../components/Animated';

export const Play: FC<AnimatedProps> = props => {
  const {borderStyle} = useStyles();

  return (
    <AnimatedSvg
      width={24}
      height={24}
      fill="none"
      stroke={borderStyle.borderColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      strokeWidth={2}
      {...props}>
      <Path d="m5 3 14 9-14 9V3z" />
    </AnimatedSvg>
  );
};
