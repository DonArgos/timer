import React, {FC} from 'react';
import {MainStackScreenProps, Screens} from './types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  Linking,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useStyles} from '../hooks/useStylesContext';
import {IconButton} from '../components/IconButton';
import {TextButton} from '../components/TextButton';
import {useLanguage} from '../hooks/useLanguageContext';
import {useNotifications} from '../hooks/useNotifications';
import {useAtom} from 'jotai';
import {preTimerEnabledAtom} from '../atoms/app';

type Props = MainStackScreenProps<Screens.Settings>;

export const Settings: FC<Props> = ({navigation}) => {
  const {isDarkMode, toggleDarkMode, textStyle, tintStyle} = useStyles();
  const {language, toggleLanguage, label} = useLanguage();
  const {
    toggleNotifications,
    toggleNotificationsSound,
    notificationsEnabled,
    notificationsSoundEnabled,
  } = useNotifications();

  const [preTimerEnabled, setPreTimerEnabled] = useAtom(preTimerEnabledAtom);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          testId="back-button"
          onPress={navigation.goBack}
          source={require('../assets/icons/arrow-left.png')}
        />
        <Text style={[textStyle, styles.headerText]}>{label('settings')}</Text>
        <IconButton
          testId={`style-button-${isDarkMode ? 'dark' : 'light'}`}
          onPress={toggleDarkMode}
          source={
            isDarkMode
              ? require('../assets/icons/sun.png')
              : require('../assets/icons/moon.png')
          }
        />
      </View>
      <View style={styles.itemContainer}>
        <Text style={[textStyle, styles.label]}>{label('preTimer')}</Text>
        <Switch
          style={styles.switch}
          value={preTimerEnabled}
          onValueChange={setPreTimerEnabled}
        />
      </View>
      <View style={styles.itemContainer}>
        <Text style={[textStyle, styles.label]}>{label('notifications')}</Text>
        <Switch
          style={styles.switch}
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>
      <View style={styles.itemContainer}>
        <Text style={[textStyle, styles.label]}>
          {label('notificationsSound')}
        </Text>
        <Switch
          style={styles.switch}
          value={notificationsSoundEnabled}
          onValueChange={toggleNotificationsSound}
          disabled={!notificationsEnabled}
        />
      </View>
      <View style={styles.itemContainer}>
        <Text
          style={[textStyle, styles.label]}
          testID={`language-label-${language}`}>
          {label('changeLanguage')}
        </Text>
        <TextButton underline onPress={toggleLanguage} testID="language-button">
          {language === 'en' ? 'ESP' : 'ENG'}
        </TextButton>
      </View>
      <TouchableOpacity
        style={styles.github}
        onPress={() => Linking.openURL('https://github.com/DonArgos/timer')}>
        <Image
          source={require('../assets/icons/github.png')}
          style={tintStyle}
        />
        <Text style={[textStyle, styles.githubText]}>DonArgos / timer</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  github: {
    marginHorizontal: 16,
    flexDirection: 'row',
    marginTop: 'auto',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  githubText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '700',
  },
  switch: {
    marginRight: 16,
  },
});
