import React, {FC} from 'react';
import {MainStackScreenProps, Screens} from './types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, View} from 'react-native';
import {useStyles} from '../hooks/useStyles';
import {IconButton} from '../components/IconButton';

type Props = MainStackScreenProps<Screens.Settings>;

export const Settings: FC<Props> = ({navigation}) => {
  const {isDarkMode, toggleDarkMode} = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          onPress={navigation.goBack}
          source={require('../assets/icons/arrow-left.png')}
        />
        <IconButton
          onPress={toggleDarkMode}
          source={
            isDarkMode
              ? require('../assets/icons/sun.png')
              : require('../assets/icons/moon.png')
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
