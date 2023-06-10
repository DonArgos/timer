import {
  IosAuthorizationStatus,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
} from 'expo-notifications';
import {useCallback} from 'react';
import {useLanguage} from './useLanguage';
import {calculateOcurrences} from '../utils';
import {useAtom, useAtomValue} from 'jotai';
import {restDurationAtom, workDurationAtom} from '../atoms/timer';
import {notificationsAtom} from '../atoms/app';
import Toast from 'react-native-root-toast';

export const useNotifications = () => {
  const {label} = useLanguage();
  const workDuration = useAtomValue(workDurationAtom);
  const restDuration = useAtomValue(restDurationAtom);
  const [notifications, setNotifications] = useAtom(notificationsAtom);

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
      scheduleNotificationAsync({
        content: {
          title: label('timerFinished'),
        },
        trigger: new Date(finishedTimestamp),
      });

      let timerTimestamp = now + currentTimerDuration;
      scheduleNotificationAsync({
        content: {
          title: label(isWorking ? 'workTimerFinished' : 'restTimerFinished'),
        },
        trigger: new Date(timerTimestamp),
      });

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
          scheduleNotificationAsync({
            content: {
              title: label(
                isWorking ? 'workTimerFinished' : 'restTimerFinished',
              ),
            },
            trigger: new Date(timerTimestamp),
          });
        } else {
          break;
        }
      }
    },
    [label, notifications, restDuration, workDuration],
  );

  return {scheduleNotifications, requestPermissions};
};
