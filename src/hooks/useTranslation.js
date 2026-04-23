import ar from "../locales/ar";
import en from "../locales/en";

const locales = { ar, en };

export const useTranslation = () => {
  const lang = localStorage.getItem("lang") || "ar";
  const translations = locales[lang] || {};

  const t = (key) => {
    if (!key) return "";
    return translations[key] || key;
  };

  return { t, lang };
};