import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlaskConical, Gauge, Leaf, Droplet, AlertTriangle, History } from "lucide-react";
import api from "../services/api.js";

const fields = [
  { name: "nitrogen", label: "Nitrogen (N)", unit: "kg/ha", placeholder: "e.g. 320" },
  { name: "phosphorus", label: "Phosphorus (P)", unit: "kg/ha", placeholder: "e.g. 18" },
  { name: "potassium", label: "Potassium (K)", unit: "kg/ha", placeholder: "e.g. 200" },
  { name: "ph", label: "pH Value", unit: "", placeholder: "e.g. 6.8" },
  { name: "moisture", label: "Moisture", unit: "%", placeholder: "e.g. 28" },
  { name: "organicCarbon", label: "Organic Carbon", unit: "%", placeholder: "e.g. 0.6" },
];

const gradeColor = {
  A: "bg-forest-700",
  B: "bg-forest-400",
  C: "bg-harvest-500",
  D: "bg-terracotta-500",
};

const SoilIntelligence = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/soil").then((res) => setHistory(res.data.entries));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, parseFloat(v)])
      );
      const res = await api.post("/soil", payload);
      setResult(res.data.soilEntry);
      setHistory((prev) => [res.data.soilEntry, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || "Could not analyze soil data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="w-full space-y-6 page-enter">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {/* Add Soil Data form */}
        <form onSubmit={handleSubmit} className="card-p space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical size={18} className="text-forest-700" />
            <h3 className="font-display text-lg font-semibold text-ink">Add Soil Data</h3>
          </div>
          <p className="text-sm text-ink/55">Enter your latest soil test values for instant AI analysis.</p>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="text-sm font-medium text-ink/70">
                  {f.label} {f.unit && <span className="text-ink/40">({f.unit})</span>}
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  name={f.name}
                  placeholder={f.placeholder}
                  value={form[f.name] || ""}
                  onChange={handleChange}
                  className="input mt-1.5"
                />
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-terracotta-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-forest-700 text-paper py-2.5 rounded-lg font-medium hover:bg-forest-800 transition-colors text-sm disabled:opacity-60"
          >
            {submitting ? "Analyzing..." : "Run AI Soil Analysis"}
          </button>

          <p className="text-xs text-ink/40 pt-1">
            Tip: PDF/Image upload with OCR reading is on the Phase 2 roadmap — manual entry covers the same analysis today.
          </p>
        </form>

        {/* AI Analysis result */}
        <div className="card-p">
          <div className="flex items-center gap-2 mb-4">
            <Gauge size={18} className="text-forest-700" />
            <h3 className="font-display text-lg font-semibold text-ink">AI Soil Analysis</h3>
          </div>

          {!result ? (
            <p className="text-sm text-ink/50">Submit soil data to see your analysis here.</p>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl ${gradeColor[result.analysis.soilGrade]} text-white flex items-center justify-center font-display text-2xl font-semibold shrink-0`}
                >
                  {result.analysis.soilGrade}
                </div>
                <div>
                  <p className="text-2xl font-display font-semibold text-ink">
                    {result.analysis.soilHealthScore}/100
                  </p>
                  <p className="text-sm text-ink/55">{result.analysis.fertilityStatus} fertility</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-ink/70">
                <Droplet size={15} className="text-sky-500" />
                Water retention: <span className="font-medium text-ink">{result.analysis.waterRetention}</span>
              </div>

              {result.analysis.deficiencies?.length > 0 && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-terracotta-600 mb-1.5">
                    <AlertTriangle size={15} /> Deficiencies Detected
                  </div>
                  <ul className="text-sm text-ink/70 space-y-0.5">
                    {result.analysis.deficiencies.map((d) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <Leaf size={15} className="text-forest-700" /> Fertilizer Recommendation
                </div>
                <div className="space-y-2">
                  {result.analysis.fertilizerRecommendation.map((f) => (
                    <div key={f.name} className="bg-forest-50 rounded-xl px-3.5 py-2.5">
                      <p className="text-sm font-medium text-forest-800">{f.name}</p>
                      <p className="text-xs text-ink/55 mt-0.5">{f.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="card-p">
        <div className="flex items-center gap-2 mb-4">
          <History size={18} className="text-forest-700" />
          <h3 className="font-display text-lg font-semibold text-ink">Soil Test History</h3>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-ink/50">No soil entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink/45 text-xs uppercase tracking-wide border-b border-forest-50">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">N</th>
                  <th className="py-2 pr-4">P</th>
                  <th className="py-2 pr-4">K</th>
                  <th className="py-2 pr-4">pH</th>
                  <th className="py-2 pr-4">Score</th>
                  <th className="py-2 pr-4">Grade</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h._id} className="border-b border-forest-50/70 text-ink/75">
                    <td className="py-2.5 pr-4">{new Date(h.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="py-2.5 pr-4">{h.nitrogen}</td>
                    <td className="py-2.5 pr-4">{h.phosphorus}</td>
                    <td className="py-2.5 pr-4">{h.potassium}</td>
                    <td className="py-2.5 pr-4">{h.ph}</td>
                    <td className="py-2.5 pr-4">{h.analysis?.soilHealthScore}</td>
                    <td className="py-2.5 pr-4 font-medium">{h.analysis?.soilGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilIntelligence;
