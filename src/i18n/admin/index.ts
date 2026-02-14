import localeAr from './locales/ar.json';
import localeEn from './locales/en.json';

export const getLocaleText = (key: keyof typeof localeAr) => {
  return {
    ar: localeAr[key],
    en: localeEn[key],
  };
}

export const getLocaleTextByLanguage = (key: keyof typeof localeAr, language: string) => {
  return {
    ar: localeAr[key],
    en: localeEn[key],
  }[language];
}