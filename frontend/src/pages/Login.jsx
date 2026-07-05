import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sprout, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.loginFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col px-5">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-forest-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-harvest-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

      <div className="flex justify-end pt-6">
        <LanguageSwitcher />
      </div>
      <div className="flex-1 flex items-center justify-center -mt-12">
        <div className="w-full max-w-md animate-slide-up-fade">
          <Link to="/" className="flex items-center gap-3 justify-center mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-soft">
              <Sprout size={24} />
            </div>
            <span className="font-display text-2xl font-bold text-ink">{t("app.name")}</span>
          </Link>

          <div className="card-p shadow-medium">
            <h1 className="font-display text-3xl font-bold text-ink">{t("auth.loginTitle")}</h1>
            <p className="text-base text-ink/60 mt-2">{t("auth.loginSubtitle")}</p>

            {error && (
              <div className="mt-6 text-sm text-terracotta-700 bg-terracotta-50 border border-terracotta-200 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="label">{t("auth.email")}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input mt-2"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="label">{t("auth.password")}</label>
                  <Link to="/forgot-password" className="text-sm font-semibold text-forest-700 hover:underline hover:text-forest-600 transition-colors">
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input mt-2"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary text-base py-4 mt-2"
              >
                {submitting ? t("auth.loggingIn") : t("auth.loginBtn")} <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <p className="text-base text-ink/65 text-center mt-8">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="text-forest-700 font-bold hover:underline hover:text-forest-600 transition-colors">
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
