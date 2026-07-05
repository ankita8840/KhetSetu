import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Landmark, CheckCircle2, XCircle } from "lucide-react";
import api from "../services/api.js";

const SchemesDashboard = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/schemes").then((res) => {
      setSchemes(res.data.schemes);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full space-y-6 page-enter">
      <div className="card-p w-full">
        <div className="flex items-center gap-2 mb-1">
          <Landmark size={18} className="text-forest-700" />
          <h3 className="font-display text-lg font-semibold text-ink">AI Scheme Recommendation</h3>
        </div>
        <p className="text-sm text-ink/55 mb-5">
          Matched against your farm profile — keep land area and water source updated for accuracy.
        </p>

        {loading ? (
          <p className="text-sm text-ink/50">Loading...</p>
        ) : (
          <div className="space-y-3">
            {schemes.map((s) => (
              <div
                key={s.name}
                className={`flex items-start gap-3 border rounded-xl p-4 ${
                  s.eligible ? "border-forest-100" : "border-forest-50 opacity-60"
                }`}
              >
                {s.eligible ? (
                  <CheckCircle2 size={20} className="text-forest-700 shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-ink/30 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display font-semibold text-ink">{s.name}</h4>
                    <span className="text-xs text-ink/40">{s.fullName}</span>
                  </div>
                  <p className="text-sm text-ink/60 mt-1">{s.description}</p>
                  <span
                    className={`inline-block text-xs font-medium mt-2 px-2.5 py-0.5 rounded-full ${
                      s.eligible ? "bg-forest-50 text-forest-700" : "bg-forest-50/50 text-ink/40"
                    }`}
                  >
                    {s.eligible ? "Likely Eligible" : "May not be eligible"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemesDashboard;
