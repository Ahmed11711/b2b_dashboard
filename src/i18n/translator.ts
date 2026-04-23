import globalLocales from './locales/global.json';
import authLocales from './locales/auth.json';
import { logMissingKey } from './missingKeys';

export type Language = 'en' | 'ar';

export const dictionaries: Record<string, any> = {
  global: globalLocales,
  auth: authLocales,
};

let currentLang: Language = 'en';

export const setEngineLanguage = (lang: Language) => {
  currentLang = lang;
};

const getNestedValue = (obj: any, path: string[]) => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

export const t = (key: string, fallback?: string, lang: Language = currentLang): string => {
  if (!key || typeof key !== 'string') return fallback || key;

  const [namespace, ...restPath] = key.split('.');
  
  if (!namespace || restPath.length === 0) return fallback || key;

  const dict = dictionaries[namespace];
  if (!dict) {
    logMissingKey(key, lang);
    return fallback || key;
  }

  const langDict = dict[lang];
  if (!langDict) {
    logMissingKey(key, lang);
    return fallback || key;
  }

  const value = getNestedValue(langDict, restPath);
  
  if (value === undefined) {
    logMissingKey(key, lang);
    return fallback || key;
  }

  return value;
};
