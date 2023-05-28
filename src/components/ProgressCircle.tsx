import React, {FC, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Svg from 'react-native-svg';
import {AnimatedCircle} from './Animated';
import {useStyles} from '../hooks/useStyles';
import {useAnimatedProps, useDerivedValue} from 'react-native-reanimated';

type Props = {
  size: number;
  percentage: number;
};

const STROKE_WIDTH = 8;

export const ProgressCircle: FC<Props> = ({size, percentage}) => {
  const {borderStyle, secondaryColor} = useStyles();
  const radius = useMemo(() => size / 2, [size]);
  const innerRadius = useMemo(() => radius - STROKE_WIDTH / 2, [radius]);
  const circumference = useMemo(() => 2 * Math.PI * innerRadius, [innerRadius]);

  const theta = useDerivedValue(() => 2 * Math.PI * percentage, [percentage]);

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: theta.value * innerRadius,
    };
  });

  return (
    <View style={styles.container}>
      <View>
        <View
          style={[
            styles.circle,
            {
              height: size,
              width: size,
              borderRadius: radius,
              borderColor: secondaryColor,
            },
          ]}
        />
        <Svg height={size} width={size}>
          <AnimatedCircle
            animatedProps={animatedCircleProps}
            cx={radius}
            cy={radius}
            fill={'transparent'}
            r={innerRadius}
            stroke={borderStyle.borderColor}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      {
        rotate: '270deg',
      },
    ],
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 8,
  },
});
