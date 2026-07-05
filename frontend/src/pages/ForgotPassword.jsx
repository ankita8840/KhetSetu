import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sprout, ArrowRight, MailCheck } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col px-5">
      <div className="flex justify-end pt-5">
        <LanguageSwitcher />
      </div>
      <div className="flex-1 flex items-center justify-center -mt-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center text-harvest-400">
              <Sprout size={18} />
            </div>
            <span className="font-display text-lg font-semibold text-ink">{t("app.name")}</span>
          </Link>

          <div className="bg-white border border-forest-100 rounded-2xl p-7 shadow-sm">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto mb-3">
                  <MailCheck size={22} />
                </div>
                <h1 className="font-display text-xl font-semibold text-ink">{t("auth.checkEmailTitle")}</h1>
                <p className="text-sm text-ink/55 mt-2">{t("auth.checkEmailDesc", { email })}</p>
              </div>
            ) : (
              <>
                <h1 className="font-display text-2xl font-semibold text-ink">{t("auth.forgotTitle")}</h1>
                <p className="text-sm text-ink/55 mt-1">{t("auth.forgotSubtitle")}</p>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-ink/70">{t("auth.email")}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 focus:border-forest-400 outline-none text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-forest-700 text-paper py-2.5 rounded-lg font-medium hover:bg-forest-800 transition-colors"
                  >
                    {t("auth.sendReset")} <ArrowRight size={16} />
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-sm text-ink/60 text-center mt-6">
            <Link to="/login" className="text-forest-700 font-medium hover:underline">
              {t("auth.backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
