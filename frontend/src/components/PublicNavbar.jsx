import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sprout, Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const PublicNavbar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-forest-100/50">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-soft">
            <Sprout size={22} />
          </div>
          <span className="font-display text-xl font-bold text-ink">{t("app.name")}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-ink/70">
          <a href="#features" className="hover:text-forest-600 transition-colors duration-200">{t("publicNav.features")}</a>
          <a href="#how-it-works" className="hover:text-forest-600 transition-colors duration-200">{t("publicNav.howItWorks")}</a>
          <a href="#about" className="hover:text-forest-600 transition-colors duration-200">{t("publicNav.about")}</a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Link to="/login" className="hidden sm:inline text-sm font-semibold text-ink/70 hover:text-forest-600 transition-colors px-3">
            {t("publicNav.login")}
          </Link>
          <Link
            to="/register"
            className="hidden sm:inline text-sm font-semibold btn-primary px-5"
          >
            {t("publicNav.getStarted")}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="sm:hidden w-11 h-11 rounded-xl border border-forest-200 flex items-center justify-center text-forest-700 hover:bg-forest-50 transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t border-forest-100 px-5 py-6 space-y-4 bg-paper/95 backdrop-blur-lg">
          <a href="#features" onClick={() => setOpen(false)} className="block text-base font-medium text-ink/80 hover:text-forest-600">
            {t("publicNav.features")}
          </a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block text-base font-medium text-ink/80 hover:text-forest-600">
            {t("publicNav.howItWorks")}
          </a>
          <a href="#about" onClick={() => setOpen(false)} className="block text-base font-medium text-ink/80 hover:text-forest-600">
            {t("publicNav.about")}
          </a>
          <div className="flex flex-col gap-4 pt-4 border-t border-forest-100">
            <LanguageSwitcher />
            <div className="flex flex-col gap-3">
              <Link to="/login" className="text-base font-semibold text-ink/70 hover:text-forest-600 w-full text-center py-2">
                {t("publicNav.login")}
              </Link>
              <Link
                to="/register"
                className="btn-primary w-full justify-center"
              >
                {t("publicNav.getStarted")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
