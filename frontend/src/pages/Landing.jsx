import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sprout,
  CloudSun,
  LineChart,
  Bug,
  MessageCircleHeart,
  Landmark,
  ArrowRight,
  Languages,
  Stars,
} from "lucide-react";
import PublicNavbar from "../components/PublicNavbar.jsx";
import SoilCrossSection from "../components/SoilCrossSection.jsx";

const FEATURE_ICONS = [Sprout, LineChart, Bug, CloudSun, MessageCircleHeart, Landmark];
const STEP_KEYS = ["step1", "step2", "step3"];

const Landing = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-hero min-h-screen">
      <PublicNavbar />

      {/* Decorative elements */}
      <div className="absolute top-32 left-10 w-32 h-32 bg-forest-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-soft" />
      <div className="absolute top-60 right-20 w-48 h-48 bg-harvest-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-soft" style={{ animationDelay: "1s" }} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up-fade">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 bg-forest-100/80 px-4 py-2 rounded-full mb-6">
                <Stars size={16} className="text-harvest-600" />
                {t("landing.badge")}
              </span>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink mt-4 leading-[1.05]">
                {t("landing.titleLine1")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-primary">
                  {t("landing.titleLine2")}
                </span>
              </h1>
              <p className="text-ink/70 text-lg md:text-xl mt-6 max-w-lg leading-relaxed">
                {t("landing.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link
                  to="/register"
                  className="btn-primary text-base py-4 px-8"
                >
                  {t("landing.ctaPrimary")}
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#how-it-works"
                  className="btn-secondary text-base py-4 px-8"
                >
                  {t("landing.ctaSecondary")}
                </a>
              </div>
              <p className="text-sm text-ink/50 mt-6">{t("landing.trustNote")}</p>

              <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg">
                <div className="text-center">
                  <p className="font-display text-4xl font-bold text-forest-600">12+</p>
                  <p className="text-sm text-ink/60 mt-1">{t("landing.statFarmers")}</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-4xl font-bold text-forest-600">50+</p>
                  <p className="text-sm text-ink/60 mt-1">{t("landing.statCrops")}</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-4xl font-bold text-forest-600 flex items-center justify-center gap-2">
                    <Languages size={24} className="text-harvest-500" />
                    9
                  </p>
                  <p className="text-sm text-ink/60 mt-1">{t("landing.statLanguages")}</p>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-up-fade stagger-1">
              <div className="absolute -inset-6 bg-gradient-primary/20 rounded-[3rem] blur-xl -z-10" />
              <div className="rounded-[2.5rem] overflow-hidden border border-forest-100/50 shadow-large aspect-square max-w-lg mx-auto w-full">
                <SoilCrossSection />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="soil-divider" />

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-5 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink">
            {t("landing.featuresTitle")}
          </h2>
          <p className="text-ink/65 text-lg mt-4 max-w-2xl mx-auto">
            {t("landing.featuresSubtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURE_ICONS.map((Icon, i) => (
            <div
              key={i}
              className="card-p card-hover group animate-slide-up-fade"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-100 to-forest-200 text-forest-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Icon size={26} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink group-hover:text-forest-700 transition-colors">
                {t(`landing.feature${i + 1}Title`)}
              </h3>
              <p className="text-ink/65 mt-3 leading-relaxed">
                {t(`landing.feature${i + 1}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16">
            {t("landing.howTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {STEP_KEYS.map((key, i) => (
              <div key={key} className="text-center md:text-left animate-slide-up-fade stagger-1" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-accent text-forest-950 font-display text-2xl font-bold flex items-center justify-center mx-auto md:mx-0 shadow-glow-gold">
                  {i + 1}
                </div>
                <h3 className="font-display text-2xl font-bold mt-6">
                  {t(`landing.${key}Title`)}
                </h3>
                <p className="text-forest-100/80 mt-3 text-lg">
                  {t(`landing.${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="py-24">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink">
            {t("landing.aboutTitle")}
          </h2>
          <p className="text-ink/70 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            {t("landing.aboutDesc")}
          </p>
          <Link
            to="/register"
            className="btn-accent text-base py-4 px-10 mt-10"
          >
            {t("landing.aboutCta")}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-forest-100/60 py-10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink/50">
            © {new Date().getFullYear()} {t("app.name")}. {t("landing.footer")}
          </p>
          <div className="flex items-center gap-6 text-sm text-ink/50">
            <span>Built with ❤️ for farmers</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
