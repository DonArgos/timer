import {useAtom} from 'jotai';
import {
  globalDurationAtom,
  globalTimeModeAtom,
  restDurationAtom,
  restTimeModeAtom,
  timerPauseDataAtom,
  workDurationAtom,
  workTimeModeAtom,
} from './timer';
import {
  darkModeAtom,
  languageAtom,
  notificationsEnabledAtom,
  notificationsSoundEnabledAtom,
  preTimerEnabledAtom,
} from './app';

export const useAtomPreloader = () => {
  useAtom(globalDurationAtom);
  useAtom(workDurationAtom);
  useAtom(restDurationAtom);
  useAtom(globalTimeModeAtom);
  useAtom(workTimeModeAtom);
  useAtom(restTimeModeAtom);
  useAtom(darkModeAtom);
  useAtom(timerPauseDataAtom);
  useAtom(languageAtom);
  useAtom(notificationsEnabledAtom);
  useAtom(notificationsSoundEnabledAtom);
  useAtom(preTimerEnabledAtom);
};
