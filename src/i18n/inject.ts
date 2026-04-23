import { t, dictionaries } from './translator';

// Determine if a string is a valid dictionary key (e.g., 'global.username')
const isTranslationKeyPattern = (val: string): boolean => {
  if (!val || typeof val !== 'string' || val.trim() === '') return false;
  // A simple heuristic: contains at least one dot and the first part is a known namespace
  const parts = val.split('.');
  if (parts.length >= 2) {
    const namespace = parts[0];
    return !!dictionaries[namespace];
  }
  return false;
};

export const injectTranslations = <T>(config: T, lang?: 'en' | 'ar'): T => {
  if (config === null || config === undefined) {
    return config;
  }

  // Handle Arrays
  if (Array.isArray(config)) {
    return config.map(item => injectTranslations(item, lang)) as unknown as T;
  }

  // Handle Objects
  if (typeof config === 'object' && config !== null) {
    const injectedConfig: any = {};
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string' && isTranslationKeyPattern(value)) {
        injectedConfig[key] = t(value, value, lang as any);
      } else if (typeof value === 'object' || Array.isArray(value)) {
        injectedConfig[key] = injectTranslations(value, lang);
      } else {
        injectedConfig[key] = value;
      }
    }
    return injectedConfig as T;
  }

  // Handle primitives
  if (typeof config === 'string' && isTranslationKeyPattern(config)) {
    return t(config, config, lang as any) as unknown as T;
  }

  return config;
};

