import {atomWithStorage} from 'jotai/utils';
import {getStorage} from './storage';

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
