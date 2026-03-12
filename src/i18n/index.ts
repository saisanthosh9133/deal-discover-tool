import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";
import kn from "./locales/kn.json";

// The rest of the setup configuration remains the same
// ...

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            te: { translation: te },
            kn: { translation: kn },
        },
        fallbackLng: "en",
        supportedLngs: ["en", "hi", "te", "kn"],
        detection: {
            // Check localStorage first, then browser language
            order: ["localStorage", "navigator"],
            lookupLocalStorage: "dd_language",
        },
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
