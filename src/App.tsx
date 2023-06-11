import React, {FC, useEffect} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {useAtomPreloader} from './atoms/useAtomPreloader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StylesContext, useStylesContext} from './hooks/useStylesContext';
import {RootSiblingParent} from 'react-native-root-siblings';
import {useNotifications} from './hooks/useNotifications';
import {Navigator} from './navigation/Navigator';
import {LanguageContext, useLanguageContext} from './hooks/useLanguageContext';

export const App: FC = () => {
  const {requestPermissions} = useNotifications();
  const styles = useStylesContext();
  const language = useLanguageContext();

  useAtomPreloader();

  useEffect(() => {
    requestPermissions(false);
  }, [requestPermissions]);

  return (
    <RootSiblingParent>
      <LanguageContext.Provider value={language}>
        <StylesContext.Provider value={styles}>
          <SafeAreaView style={[style.container, styles.backgroundStyle]}>
            <StatusBar
              barStyle={styles.isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={styles.backgroundStyle.backgroundColor}
            />
            <Navigator />
          </SafeAreaView>
        </StylesContext.Provider>
      </LanguageContext.Provider>
    </RootSiblingParent>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
