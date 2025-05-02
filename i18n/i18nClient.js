import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationFR from './locales/fr/chat.json';
import translationEN from './locales/en/chat.json';
import translationDE from './locales/de/chat.json';
import translationES from './locales/es/chat.json';

const resources = {
  fr: { chat: translationFR },
  en: { chat: translationEN },
  de: { chat: translationDE },
  es: { chat: translationES },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
