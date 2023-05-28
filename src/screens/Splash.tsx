import React, {FC, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {MainStackScreenProps, Screens} from './types';

type Props = MainStackScreenProps<Screens.Splash>;

export const Splash: FC<Props> = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace(Screens.Timer);
    }, 300);
  }, [navigation]);

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
