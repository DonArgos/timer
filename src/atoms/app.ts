import {atomWithStorage} from 'jotai/utils';
import {getStorage} from './storage';
import {Language} from '../language';

export enum DarkMode {
  UNSPECIFIED,
  FALSE,
  TRUE,
}

export const darkModeAtom = atomWithStorage<DarkMode>(
  'dark-mode',
  DarkMode.UNSPECIFIED,
  getStorage(),
);

export const languageAtom = atomWithStorage<Language | null>(
  'language',
  null,
  getStorage(),
);

export const notificationsEnabledAtom = atomWithStorage(
  'notifications-enabled',
  true,
  getStorage(),
);

export const notificationsSoundEnabledAtom = atomWithStorage(
  'notifications-sound-enabled',
  true,
  getStorage(),
);

export const preTimerEnabledAtom = atomWithStorage(
  'pre-timer-enabled',
  true,
  getStorage(),
);
