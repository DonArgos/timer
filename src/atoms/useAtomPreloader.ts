import {useAtom} from 'jotai';
import {globalDurationAtom, restDurationAtom, workDurationAtom} from './timer';
import {darkModeAtom} from './app';

export const useAtomPreloader = () => {
  useAtom(globalDurationAtom);
  useAtom(workDurationAtom);
  useAtom(restDurationAtom);
  useAtom(darkModeAtom);
};
