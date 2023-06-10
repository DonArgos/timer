import {useAtom} from 'jotai';
import {languageAtom} from '../atoms/app';
import {useCallback, useMemo} from 'react';
import {Language, Message, language} from '../language';
import RNRestart from 'react-native-restart';
import {getLocales} from 'react-native-localize';

export const useLanguage = () => {
  const [lang, setLanguage] = useAtom(languageAtom);

  const locale = useMemo(
    () =>
      getLocales().find(
        item => item.languageCode === 'en' || item.languageCode === 'es',
      ),
    [],
  );

  const _language = useMemo(
    () => (lang || locale?.languageCode || 'en') as Language,
    [lang, locale?.languageCode],
  );

  const toggleLanguage = () => {
    setLanguage(() => {
      if (_language === 'en') {
        return 'es';
      }
      return 'en';
    });
    RNRestart.restart();
  };

  const label = useCallback(
    (message: Message) => {
      if (lang) {
        return language[lang][message];
      }
      if (!locale) {
        return language.en[message];
      }
      return language[locale.languageCode as Language][message];
    },
    [lang, locale],
  );

  return {
    toggleLanguage,
    label,
    language: _language,
  };
};
