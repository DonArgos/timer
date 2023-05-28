import {NativeStackScreenProps} from '@react-navigation/native-stack';

export enum Screens {
  Splash = 'Splash',
  Timer = 'Timer',
}

export type MainStackParams = {
  [Screens.Splash]: undefined;
  [Screens.Timer]: undefined;
};

export type MainStackScreenProps<T extends keyof MainStackParams> =
  NativeStackScreenProps<MainStackParams, T>;
