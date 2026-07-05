import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import bn from "./locales/bn.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import mr from "./locales/mr.json";
import gu from "./locales/gu.json";
import pa from "./locales/pa.json";
import kn from "./locales/kn.json";

export const LANG_STORAGE_KEY = "khetsetu_lang";
export const LANG_AUTO_KEY = "khetsetu_lang_auto";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

// Maps Indian states/union territories (as returned by reverse-geocoding)
// to the most widely spoken regional language, so the UI can auto-switch
// based on the user's detected location.
export const STATE_LANGUAGE_MAP = {
  "uttar pradesh": "hi",
  "bihar": "hi",
  "madhya pradesh": "hi",
  "rajasthan": "hi",
  "haryana": "hi",
  "delhi": "hi",
  "nct of delhi": "hi",
  "jharkhand": "hi",
  "uttarakhand": "hi",
  "himachal pradesh": "hi",
  "chhattisgarh": "hi",
  "west bengal": "bn",
  "tripura": "bn",
  "tamil nadu": "ta",
  "puducherry": "ta",
  "andhra pradesh": "te",
  "telangana": "te",
  "maharashtra": "mr",
  "goa": "mr",
  "gujarat": "gu",
  "dadra and nagar haveli and daman and diu": "gu",
  "punjab": "pa",
  "chandigarh": "pa",
  "karnataka": "kn",
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      ta: { translation: ta },
      te: { translation: te },
      mr: { translation: mr },
      gu: { translation: gu },
      pa: { translation: pa },
      kn: { translation: kn },
    },
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANG_STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
