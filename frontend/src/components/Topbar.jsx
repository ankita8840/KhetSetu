import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const Topbar = ({ titleKey, onMenuClick }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const title = titleKey ? t(titleKey) : t("app.name");

  return (
    <header className="sticky top-0 z-20 glass border-b border-forest-100/50 px-5 lg:px-8 py-4 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-10 h-10 rounded-xl border border-forest-200 bg-white flex items-center justify-center text-forest-700 shrink-0 hover:bg-forest-50 transition-colors"
        aria-label={t("common.menu")}
      >
        <Menu size={20} />
      </button>
      <h1 className="text-2xl font-display font-bold text-ink flex-1 truncate">{title}</h1>

      <div className="flex items-center gap-3 shrink-0">
        <LanguageSwitcher />
        <button
          onClick={() => navigate("/dashboard/profile")}
          title={t("common.myAccount")}
          className="w-10 h-10 rounded-full bg-gradient-primary text-white text-sm font-bold flex items-center justify-center shadow-soft hover:shadow-glow-green hover:-translate-y-0.5 transition-all duration-300"
        >
          {initials || "?"}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
