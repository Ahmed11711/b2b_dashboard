import { useTranslation as useI18nTranslation } from "react-i18next";

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  const lang = i18n.language;

  const translate = (key) => {
    if (!key) return "";
    return t(key);
  };

  return { t: translate, lang };
};
