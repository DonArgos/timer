import {
  IosAuthorizationStatus,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
} from 'expo-notifications';
import {useCallback} from 'react';
import {useLanguage} from './useLanguageContext';
import {calculateOcurrences} from '../utils';
import {useAtom, useAtomValue} from 'jotai';
import {restDurationAtom, workDurationAtom} from '../atoms/timer';
import {
  notificationsEnabledAtom,
  notificationsSoundEnabledAtom,
} from '../atoms/app';
import Toast from 'react-native-root-toast';
import {Message} from '../language';

export const useNotifications = () => {
  const {label} = useLanguage();
  const workDuration = useAtomValue(workDurationAtom);
  const restDuration = useAtomValue(restDurationAtom);
  const [notificationsEnabled, setNotificationsEnabled] = useAtom(
    notificationsEnabledAtom,
  );
  const [notificationsSoundEnabled, setNotificationsSoundEnabled] = useAtom(
    notificationsSoundEnabledAtom,
  );

  const requestPermissions = useCallback(
    async (showMessage: boolean = true) => {
      const settings = await getPermissionsAsync();
      const hasPermission =
        settings.granted ||
        settings.ios?.status === IosAuthorizationStatus.PROVISIONAL;

      if (settings.ios?.status === IosAuthorizationStatus.DENIED) {
        showMessage && Toast.show(label('notificationError'));
        setNotificationsEnabled(false);
        return;
      }

      if (!hasPermission) {
        const _settings = await requestPermissionsAsync();
        setNotificationsEnabled(
          _settings.granted ||
            _settings.ios?.status === IosAuthorizationStatus.PROVISIONAL,
        );
      }
    },
    [label, setNotificationsEnabled],
  );

  const schedule = useCallback(
    (message: Message, timestamp: number) => {
      scheduleNotificationAsync({
        content: {
          title: label(message),
          sound: notificationsSoundEnabled,
        },
        trigger: new Date(timestamp),
      });
    },
    [label, notificationsSoundEnabled],
  );

  const scheduleNotifications = useCallback(
    (
      currentDuration: number,
      currentTimerDuration: number,
      isWorking: boolean,
    ) => {
      if (!notificationsEnabled) {
        return;
      }

      const now = Date.now();
      const finishedTimestamp = now + currentDuration;
      schedule('timerFinished', finishedTimestamp);

      let timerTimestamp = now + currentTimerDuration;
      schedule(
        isWorking ? 'workTimerFinished' : 'restTimerFinished',
        timerTimestamp,
      );

      const {workOccurrences, restOccurrences} = calculateOcurrences(
        currentDuration,
        workDuration,
        restDuration,
      );

      for (let i = 0; i < workOccurrences + restOccurrences; i++) {
        isWorking = !isWorking;
        timerTimestamp =
          timerTimestamp + (isWorking ? workDuration : restDuration);
        if (timerTimestamp <= finishedTimestamp) {
          schedule(
            isWorking ? 'workTimerFinished' : 'restTimerFinished',
            timerTimestamp,
          );
        } else {
          break;
        }
      }
    },
    [notificationsEnabled, restDuration, schedule, workDuration],
  );

  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled(value => {
      if (!value) {
        requestPermissions();
      }
      return !value;
    });
  }, [requestPermissions, setNotificationsEnabled]);

  const toggleNotificationsSound = useCallback(() => {
    setNotificationsSoundEnabled(value => !value);
  }, [setNotificationsSoundEnabled]);

  return {
    scheduleNotifications,
    requestPermissions,
    toggleNotifications,
    toggleNotificationsSound,
    notificationsEnabled,
    notificationsSoundEnabled,
  };
};
