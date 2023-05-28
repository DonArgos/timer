import {atomWithStorage} from 'jotai/utils';
import {getStorage} from './storage';

// 900000 miliseconds -> 15 minutes default
export const globalDurationAtom = atomWithStorage(
  'global-duration',
  900000,
  getStorage(),
);

// 30000 miliseconds -> 30 seconds default
export const workDurationAtom = atomWithStorage(
  'work-duration',
  30000,
  getStorage(),
);

// 10000 miliseconds -> 10 seconds default
export const restDurationAtom = atomWithStorage(
  'rest-duration',
  10000,
  getStorage(),
);
