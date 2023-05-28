import React, {FC} from 'react';
import {Path} from 'react-native-svg';
import {useStyles} from '../../hooks/useStyles';
import {AnimatedProps} from './types';
import {AnimatedSvg} from '../../components/Animated';

export const Pause: FC<AnimatedProps> = props => {
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
      <Path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </AnimatedSvg>
  );
};
