import {NavigationContainer} from '@react-navigation/native';
import React, {FC} from 'react';
import {useStyles} from '../hooks/useStylesContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainStackParams, Screens} from '../screens/types';
import {Splash} from '../screens/Splash';
import {Timer} from '../screens/Timer';
import {Settings} from '../screens/Settings';

const Stack = createNativeStackNavigator<MainStackParams>();

export const Navigator: FC = () => {
  const {backgroundStyle, isDarkMode, borderStyle, textStyle} = useStyles();

  return (
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
  );
};
