import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import enJS from './locales/en.js';
import arJS from './locales/ar.js';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          ...enTranslations,
          ...enJS,
        },
      },
      ar: {
        translation: {
          ...arTranslations,
          ...arJS,
        },
      },
    },
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      lookupLocalStorage: 'lang', // Use the user's existing key
      caches: ['localStorage'],
    },
  });

// Update HTML dir attribute and localStorage when language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  localStorage.setItem('lang', lng); // Keep 'lang' in sync for old code
});

export default i18n;