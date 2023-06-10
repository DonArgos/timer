import {useAtomValue} from 'jotai';
import {useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import {globalDurationAtom, timerPauseDataAtom} from '../atoms/timer';
import {
  cancelAllScheduledNotificationsAsync,
  dismissAllNotificationsAsync,
} from 'expo-notifications';

export const useAppState = (
  onPlay: (fromBackground: boolean) => void,
  onPause: (fronBackground: boolean) => void,
) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const timerPauseData = useAtomValue(timerPauseDataAtom);
  const duration = useAtomValue(globalDurationAtom);

  useEffect(() => {
    cancelAllScheduledNotificationsAsync();
    dismissAllNotificationsAsync();
    if (timerPauseData && timerPauseData.duration < duration) {
      onPlay(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        cancelAllScheduledNotificationsAsync();
        dismissAllNotificationsAsync();
        onPlay(true);
      } else if (nextAppState.match(/inactive|background/)) {
        onPause(true);
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
