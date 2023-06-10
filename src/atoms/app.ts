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

export const notificationsAtom = atomWithStorage(
  'notifications',
  true,
  getStorage(),
);
