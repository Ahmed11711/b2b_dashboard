import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Language, setEngineLanguage, t } from './translator';
import { injectTranslations } from './inject';

interface LanguageContextProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
  tr: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children, defaultLanguage = 'en' }: { children: ReactNode, defaultLanguage?: Language }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  useEffect(() => {
    setEngineLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const tr = (key: string, fallback?: string) => t(key, fallback, language);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const useTranslateConfig = <T,>(config: T): T => {
  const { language } = useLanguage();
  return useMemo(() => injectTranslations(config, language), [config, language]);
};

