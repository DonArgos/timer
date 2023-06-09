import React, {FC} from 'react';
import {MainStackScreenProps, Screens} from './types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import {useStyles} from '../hooks/useStyles';
import {IconButton} from '../components/IconButton';
import {TextButton} from '../components/TextButton';
import {useLanguage} from '../hooks/useLanguage';

type Props = MainStackScreenProps<Screens.Settings>;

export const Settings: FC<Props> = ({navigation}) => {
  const {isDarkMode, toggleDarkMode, textStyle} = useStyles();

  const {language, toggleLanguage, label} = useLanguage();

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
      <View style={styles.itemContainer}>
        <Text style={[textStyle, styles.label]}>{label('changeLanguage')}</Text>
        <TextButton underline onPress={toggleLanguage}>
          {language === 'ENG' ? 'ESP' : 'ENG'}
        </TextButton>
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
  },
  label: {
    fontSize: 16,
  },
});
