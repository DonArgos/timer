import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage} from 'jotai/utils';

export function getStorage<T>() {
  return createJSONStorage<T>(() => AsyncStorage);
}
