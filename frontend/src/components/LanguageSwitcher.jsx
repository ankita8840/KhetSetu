import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Languages, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../i18n/index.js";
import { setManualLanguage } from "../utils/languageDetect.js";

const LanguageSwitcher = ({ variant = "light" }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const isDark = variant === "dark";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
          isDark
            ? "text-forest-100/85 hover:bg-forest-700/60"
            : "text-ink/70 hover:bg-forest-50 hover:text-forest-700"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Languages size={16} />
        <span className="hidden sm:inline">{current.native}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 max-h-80 overflow-y-auto scrollbar-thin bg-white border border-forest-100 rounded-xl shadow-lg z-50 py-1.5"
          role="listbox"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setManualLanguage(lang.code);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between gap-2 text-left px-3.5 py-2 text-sm text-ink/80 hover:bg-forest-50 hover:text-forest-700 transition-colors"
              role="option"
              aria-selected={lang.code === current.code}
            >
              <span>
                {lang.native}
                {lang.native !== lang.label && (
                  <span className="text-ink/40 text-xs ml-1">({lang.label})</span>
                )}
              </span>
              {lang.code === current.code && <Check size={14} className="text-forest-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
