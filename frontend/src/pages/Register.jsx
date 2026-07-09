import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sprout, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

const Register = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.registerFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col px-5 py-6">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-forest-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-harvest-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="w-full max-w-md animate-slide-up-fade">
          <Link to="/" className="flex items-center gap-3 justify-center mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-soft">
              <Sprout size={24} />
            </div>
            <span className="font-display text-2xl font-bold text-ink">{t("app.name")}</span>
          </Link>

          <div className="card-p shadow-medium">
            <h1 className="font-display text-3xl font-bold text-ink">{t("auth.registerTitle")}</h1>
            <p className="text-base text-ink/60 mt-2">{t("auth.registerSubtitle")}</p>

            {error && (
              <div className="mt-6 text-sm text-terracotta-700 bg-terracotta-50 border border-terracotta-200 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="label">{t("auth.fullName")}</label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="input mt-2"
                  placeholder="Ramesh Kumar"
                />
              </div>
              <div>
                <label className="label">{t("auth.email")}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="input mt-2"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="label">{t("auth.phone")}</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="input mt-2"
                  placeholder="98765 43210"
                />
              </div>
              <div>
  <label className="label">{t("auth.password")}</label>

  <div className="relative mt-2">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      required
      minLength={6}
      value={form.password}
      onChange={handleChange}
      className="input pr-12"
      placeholder="At least 6 characters"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary text-base py-4 mt-2"
              >
                {submitting ? t("auth.creatingAccount") : t("auth.registerBtn")} <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <p className="text-base text-ink/65 text-center mt-8">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-forest-700 font-bold hover:underline hover:text-forest-600 transition-colors">
              {t("auth.loginLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
