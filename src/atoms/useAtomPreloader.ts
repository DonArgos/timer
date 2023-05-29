import {useAtom} from 'jotai';
import {
  globalDurationAtom,
  globalTimeModeAtom,
  restDurationAtom,
  restTimeModeAtom,
  workDurationAtom,
  workTimeModeAtom,
} from './timer';
import {darkModeAtom} from './app';

export const useAtomPreloader = () => {
  useAtom(globalDurationAtom);
  useAtom(workDurationAtom);
  useAtom(restDurationAtom);
  useAtom(globalTimeModeAtom);
  useAtom(workTimeModeAtom);
  useAtom(restTimeModeAtom);
  useAtom(darkModeAtom);
};
