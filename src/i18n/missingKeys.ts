const missingKeys = new Set<string>();

export const logMissingKey = (key: string, lang: string) => {
  const identifier = `[${lang}] ${key}`;
  if (!missingKeys.has(identifier)) {
    missingKeys.add(identifier);
    console.warn(`🌍 [i18n] Missing translation: ${identifier}`);
  }
};

export const getMissingKeys = () => Array.from(missingKeys);
