import { useTranslation as useI18nTranslation } from "react-i18next";
import ar from "../locales/ar";
import en from "../locales/en";

const locales = { ar, en };

export const useTranslation = () => {
  const { t: i18nTranslate, i18n } = useI18nTranslation();
  
  // Normalize language to 'en' or 'ar'
  const lang = i18n.language ? i18n.language.split('-')[0] : (localStorage.getItem("lang") || "ar");
  const translations = locales[lang] || {};

  const t = (key) => {
    if (!key) return "";
    
    // 1. Try flat translations from the original .js files first (to maintain existing algorithm)
    if (translations[key]) {
      return translations[key];
    }
    
    // 2. Try i18next for new nested keys or fallbacks
    return i18nTranslate(key);
  };

  return { t, lang };
};
