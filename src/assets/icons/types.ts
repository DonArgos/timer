import Animated from 'react-native-reanimated';
import Svg, {SvgProps} from 'react-native-svg';

export const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type AnimatedProps = Animated.AnimateProps<SvgProps>;
