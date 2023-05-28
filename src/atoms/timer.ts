import {atomWithStorage} from 'jotai/utils';
import {getStorage} from './storage';

// 900000 miliseconds -> 15 minutes default
export const globalDurationAtom = atomWithStorage(
  'global-duration',
  900000,
  getStorage(),
);

// 30 seconds default
export const workDurationAtom = atomWithStorage(
  'work-duration',
  30,
  getStorage(),
);

// 10 seconds default
export const restDurationAtom = atomWithStorage(
  'rest-duration',
  10,
  getStorage(),
);
