import {useAtom} from 'jotai';
import {languageAtom} from '../atoms/app';
import {createContext, useCallback, useContext, useMemo} from 'react';
import {Language, Message, language} from '../language';
import {getLocales} from 'react-native-localize';

export type LanguageContextValues = ReturnType<typeof useLanguageContext>;

export const LanguageContext = createContext<LanguageContextValues | undefined>(
  undefined,
);

export const useLanguage = () =>
  useContext(LanguageContext) || ({} as LanguageContextValues);

export const useLanguageContext = () => {
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
