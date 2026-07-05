import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ListTree, ShieldCheck, ShieldAlert, ShieldX, Droplets, IndianRupee, Search } from "lucide-react";
import api from "../services/api.js";

const riskStyle = {
  Low: { icon: ShieldCheck, color: "text-forest-700 bg-forest-50" },
  Medium: { icon: ShieldAlert, color: "text-harvest-600 bg-harvest-50" },
  High: { icon: ShieldX, color: "text-terracotta-600 bg-orange-50" },
};

const CropPlanner = () => {
  const { t } = useTranslation();
  const [season, setSeason] = useState("Any");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkCrop, setCheckCrop] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [checkError, setCheckError] = useState("");

  const fetchRecommendations = (selectedSeason) => {
    setLoading(true);
    setError("");
    api
      .get(`/crop/recommend?season=${selectedSeason}`)
      .then((res) => setRecommendations(res.data.recommendations))
      .catch((err) => setError(err.response?.data?.message || "Could not load recommendations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecommendations(season);
  }, [season]);

  const handleCheck = async (e) => {
    e.preventDefault();
    setCheckError("");
    setCheckResult(null);
    try {
      const res = await api.post("/crop/compatibility", { cropName: checkCrop });
      setCheckResult(res.data.result);
    } catch (err) {
      setCheckError(err.response?.data?.message || "Crop not found");
    }
  };

  return (
    <div className="w-full space-y-6 page-enter">
      <div className="card-p w-full">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <ListTree size={18} className="text-forest-700" />
            <h3 className="font-display text-lg font-semibold text-ink">AI Crop Recommendation</h3>
          </div>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="px-3 py-2 rounded-lg border border-forest-100 text-sm bg-white"
          >
            {["Any", "Kharif", "Rabi", "Zaid"].map((s) => (
              <option key={s} value={s}>
                {s === "Any" ? "All seasons" : s}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-ink/50">Loading recommendations...</p>
        ) : error ? (
          <p className="text-sm text-terracotta-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            {recommendations.map((r) => {
              const Risk = riskStyle[r.riskLevel];
              return (
                <div key={r.crop} className="border border-forest-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-semibold text-ink">{r.crop}</h4>
                    <span className="text-xs text-ink/40">{r.season}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-ink/50 mb-1">
                      <span>Suitability</span>
                      <span className="font-medium text-ink">{r.suitablePercent}%</span>
                    </div>
                    <div className="h-1.5 bg-forest-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forest-600 rounded-full"
                        style={{ width: `${r.suitablePercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${Risk.color}`}>
                      <Risk.icon size={12} /> {r.riskLevel} risk
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink/55 mt-3">
                    <span className="flex items-center gap-1">
                      <Droplets size={12} /> {r.waterNeed} water
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee size={12} /> {r.profitPotential} profit
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card-p">
        <h3 className="font-display text-lg font-semibold text-ink mb-1">Crop Compatibility Checker</h3>
        <p className="text-sm text-ink/55 mb-4">Check how well a specific crop fits your current soil and water source.</p>

        <form onSubmit={handleCheck} className="flex gap-3 flex-wrap">
          <input
            value={checkCrop}
            onChange={(e) => setCheckCrop(e.target.value)}
            placeholder="e.g. Sugarcane, Wheat, Tomato"
            className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-lg border border-forest-100 focus:border-forest-400 outline-none text-sm"
          />
          <button
            type="submit"
            className="btn-primary"
          >
            <Search size={16} /> Check
          </button>
        </form>

        {checkError && <p className="text-sm text-terracotta-600 mt-3">{checkError}</p>}

        {checkResult && (
          <div className="mt-5 border border-forest-100 rounded-xl p-4 max-w-sm">
            <h4 className="font-display font-semibold text-ink">{checkResult.crop}</h4>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div>
                <p className="text-ink/45 text-xs">Suitability</p>
                <p className="font-medium text-ink">{checkResult.suitablePercent}%</p>
              </div>
              <div>
                <p className="text-ink/45 text-xs">Risk Level</p>
                <p className="font-medium text-ink">{checkResult.riskLevel}</p>
              </div>
              <div>
                <p className="text-ink/45 text-xs">Water Need</p>
                <p className="font-medium text-ink">{checkResult.waterNeed}</p>
              </div>
              <div>
                <p className="text-ink/45 text-xs">Profit Potential</p>
                <p className="font-medium text-ink">{checkResult.profitPotential}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPlanner;
