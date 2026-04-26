import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const handleLanguageChange = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      localStorage.setItem("userLanguage", lang);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 text-gray-700 bg-white border border-gray-200 rounded-full shadow-xs transition-all duration-300 ease-in-out hover:bg-[#FFF0F5] hover:border-[#FFB6C1] hover:text-[#DB7093] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/50 active:scale-[0.97] dark:bg-gray-900 dark:border-white-800 dark:text-gray-300 dark:hover:bg-gray-800 dropdown-toggle"
      >
        <span className="flex items-center justify-center w-5 h-5 overflow-hidden rounded-full shadow-inner ring-1 ring-black/5">
          <span className="text-base leading-none">{currentLanguage.flag}</span>
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-inherit">
          {currentLanguage.code}
        </span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180 text-[#DB7093]" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-44 mt-3 overflow-hidden border-0 shadow-2xl ring-1 ring-black/5"
      >
        <div className="p-1.5 bg-white dark:bg-gray-900">
          <div className="px-3 py-2 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Select Language
          </div>
          {languages.map((lang) => (
            <DropdownItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                i18n.language === lang.code
                  ? "bg-[#FFF0F5] text-[#DB7093] font-semibold shadow-xs"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm ring-1 ring-black/5 text-base">
                  {lang.flag}
                </span>
                <span className="text-sm tracking-tight">{lang.name}</span>
              </div>
              {i18n.language === lang.code && (
                <svg
                  className="w-4 h-4 text-[#DB7093]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </DropdownItem>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};

export default LanguageSelector;
