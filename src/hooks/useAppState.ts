import {useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';

export const useAppState = (
  onPlay: (fromBackground: boolean) => void,
  onPause: () => void,
) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onPlay(true);
      } else if (nextAppState.match(/inactive|background/)) {
        onPause();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [onPause, onPlay]);

  return {appState: appStateVisible};
};
