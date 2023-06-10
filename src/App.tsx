import React, {FC, useEffect} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Timer} from './screens/Timer';
import {MainStackParams, Screens} from './screens/types';
import {useAtomPreloader} from './atoms/useAtomPreloader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStyles} from './hooks/useStyles';
import {Splash} from './screens/Splash';
import {Settings} from './screens/Settings';
import {RootSiblingParent} from 'react-native-root-siblings';
import {useNotifications} from './hooks/useNotifications';

const Stack = createNativeStackNavigator<MainStackParams>();

export const App: FC = () => {
  const {backgroundStyle, isDarkMode, borderStyle, textStyle} = useStyles();
  const {requestPermissions} = useNotifications();

  useAtomPreloader();

  useEffect(() => {
    requestPermissions(false);
  }, [requestPermissions]);

  return (
    <RootSiblingParent>
      <SafeAreaView style={[style.container, backgroundStyle]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <NavigationContainer
          theme={{
            dark: isDarkMode,
            colors: {
              background: backgroundStyle.backgroundColor,
              border: borderStyle.borderColor,
              card: backgroundStyle.backgroundColor,
              notification: backgroundStyle.backgroundColor,
              primary: textStyle.color,
              text: textStyle.color,
            },
          }}>
          <Stack.Navigator
            initialRouteName={Screens.Splash}
            screenOptions={{headerShown: false}}>
            <Stack.Screen name={Screens.Splash} component={Splash} />
            <Stack.Screen name={Screens.Timer} component={Timer} />
            <Stack.Screen name={Screens.Settings} component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </RootSiblingParent>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
