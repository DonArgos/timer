import {useAtom} from 'jotai';
import {languageAtom} from '../atoms/app';
import {useCallback} from 'react';
import {Message, language} from '../language';

export const useLanguage = () => {
  const [lang, setLanguage] = useAtom(languageAtom);

  const toggleLanguage = () =>
    setLanguage(_lang => {
      if (_lang === 'ENG') {
        return 'ESP';
      }
      return 'ENG';
    });

  const label = useCallback(
    (message: Message) => {
      return language[lang][message];
    },
    [lang],
  );

  return {toggleLanguage, label, language: lang};
};
