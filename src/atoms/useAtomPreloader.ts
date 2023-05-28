import {useAtom} from 'jotai';
import {globalDurationAtom, restDurationAtom, workDurationAtom} from './timer';

export const useAtomPreloader = () => {
  useAtom(globalDurationAtom);
  useAtom(workDurationAtom);
  useAtom(restDurationAtom);
};
