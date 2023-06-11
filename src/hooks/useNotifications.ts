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
import {notificationsAtom, notificationsSoundAtom} from '../atoms/app';
import Toast from 'react-native-root-toast';
import {Message} from '../language';

export const useNotifications = () => {
  const {label} = useLanguage();
  const workDuration = useAtomValue(workDurationAtom);
  const restDuration = useAtomValue(restDurationAtom);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [notificationsSound, setNotificationsSound] = useAtom(
    notificationsSoundAtom,
  );

  const requestPermissions = useCallback(
    async (showMessage: boolean = true) => {
      const settings = await getPermissionsAsync();
      const hasPermission =
        settings.granted ||
        settings.ios?.status === IosAuthorizationStatus.PROVISIONAL;

      if (settings.ios?.status === IosAuthorizationStatus.DENIED) {
        showMessage && Toast.show(label('notificationError'));
        setNotifications(false);
        return;
      }

      if (!hasPermission) {
        const _settings = await requestPermissionsAsync();
        setNotifications(
          _settings.granted ||
            _settings.ios?.status === IosAuthorizationStatus.PROVISIONAL,
        );
      }
    },
    [label, setNotifications],
  );

  const schedule = useCallback(
    (message: Message, timestamp: number) => {
      scheduleNotificationAsync({
        content: {
          title: label(message),
          sound: notificationsSound,
        },
        trigger: new Date(timestamp),
      });
    },
    [label, notificationsSound],
  );

  const scheduleNotifications = useCallback(
    (
      currentDuration: number,
      currentTimerDuration: number,
      isWorking: boolean,
    ) => {
      if (!notifications) {
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
    [notifications, restDuration, schedule, workDuration],
  );

  const toggleNotifications = useCallback(() => {
    setNotifications(value => {
      if (!value) {
        requestPermissions();
      }
      return !value;
    });
  }, [requestPermissions, setNotifications]);

  const toggleNotificationsSound = useCallback(() => {
    setNotificationsSound(value => !value);
  }, [setNotificationsSound]);

  return {
    scheduleNotifications,
    requestPermissions,
    toggleNotifications,
    toggleNotificationsSound,
    notifications,
    notificationsSound,
  };
};
