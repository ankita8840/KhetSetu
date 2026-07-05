import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LineChart, TrendingUp, TrendingDown, Search, Info } from "lucide-react";
import api from "../services/api.js";

const MarketInsights = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState([]);
  const [demo, setDemo] = useState(false);
  const [cropQuery, setCropQuery] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [predError, setPredError] = useState("");

  useEffect(() => {
    api.get("/market/prices").then((res) => {
      setPrices(res.data.prices);
      setDemo(res.data.demo);
    });
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    setPredError("");
    setPrediction(null);
    try {
      const res = await api.get(`/market/predict?crop=${encodeURIComponent(cropQuery)}`);
      setPrediction(res.data.prediction);
    } catch (err) {
      setPredError(err.response?.data?.message || "Crop not found");
    }
  };

  return (
    <div className="w-full space-y-6 page-enter">
      {demo && (
        <div className="bg-sky-50 border border-sky-100 text-sky-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <Info size={16} className="mt-0.5 shrink-0" />
          Showing sample mandi data — connect data.gov.in's Agmarknet API in backend/.env for live prices.
        </div>
      )}

      <div className="card-p w-full">
        <div className="flex items-center gap-2 mb-4">
          <LineChart size={18} className="text-forest-700" />
          <h3 className="font-display text-lg font-semibold text-ink">Live Mandi Prices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/45 text-xs uppercase tracking-wide border-b border-forest-50">
                <th className="py-2 pr-4">Crop</th>
                <th className="py-2 pr-4">Best Market</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <tr key={p.crop} className="border-b border-forest-50/70 text-ink/75">
                  <td className="py-2.5 pr-4 font-medium text-ink">{p.crop}</td>
                  <td className="py-2.5 pr-4">{p.market}</td>
                  <td className="py-2.5 pr-4">₹{p.price.toLocaleString("en-IN")} {p.unit}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`flex items-center gap-1 text-xs font-medium ${p.trend >= 0 ? "text-forest-700" : "text-terracotta-600"}`}>
                      {p.trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {Math.abs(p.trend)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-p w-full">
        <h3 className="font-display text-lg font-semibold text-ink mb-1">AI Price Prediction & Sell/Hold Advice</h3>
        <p className="text-sm text-ink/55 mb-4">Get a recommendation on whether to sell now or hold your harvest.</p>

        <form onSubmit={handlePredict} className="flex gap-3 flex-wrap">
          <input
            value={cropQuery}
            onChange={(e) => setCropQuery(e.target.value)}
            placeholder="e.g. Wheat, Onion, Cotton"
            className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-lg border border-forest-100 focus:border-forest-400 outline-none text-sm"
          />
          <button
            type="submit"
            className="btn-primary"
          >
            <Search size={16} /> Predict
          </button>
        </form>

        {predError && <p className="text-sm text-terracotta-600 mt-3">{predError}</p>}

        {prediction && (
          <div className="mt-5 border border-forest-100 rounded-xl p-5 w-full">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg font-semibold text-ink">{prediction.crop}</h4>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  prediction.recommendation === "Sell" ? "bg-orange-50 text-terracotta-600" : "bg-forest-50 text-forest-700"
                }`}
              >
                {prediction.recommendation}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div>
                <p className="text-ink/45 text-xs">Current Price</p>
                <p className="font-medium text-ink">₹{prediction.currentPrice.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-ink/45 text-xs">Predicted Price</p>
                <p className="font-medium text-ink">₹{prediction.predictedPrice.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-ink/45 text-xs">Best Market</p>
                <p className="font-medium text-ink">{prediction.bestMarket}</p>
              </div>
              <div>
                <p className="text-ink/45 text-xs">Trend</p>
                <p className="font-medium text-ink">{prediction.trendPercent}%</p>
              </div>
            </div>
            <p className="text-sm text-ink/60 mt-3">{prediction.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketInsights;
