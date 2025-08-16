import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";

const resources = {
  en: { translation: translationEN },
  de: { translation: translationDE }
};

i18n
  .use(LanguageDetector)  // Detektiert die Sprache des Benutzers
  .use(initReactI18next) // Bindet i18next an React
  .init({
    resources,
    fallbackLng: "en", // verwenden Sie Englisch als Fallback-Sprache
    interpolation: {
      escapeValue: false // React bereits vor XSS-Angriffen schützt
    }
  });

export default i18n;
