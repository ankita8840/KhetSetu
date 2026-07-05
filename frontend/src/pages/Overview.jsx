import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sprout,
  CloudSun,
  ListTree,
  TrendingUp,
  ClipboardList,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Overview = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [soil, setSoil] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get("/soil/latest"),
      api.get("/tasks"),
      api.get("/finance/summary"),
    ]).then(([soilRes, tasksRes, financeRes]) => {
      if (soilRes.status === "fulfilled") setSoil(soilRes.value.data.latest);
      if (tasksRes.status === "fulfilled") setTasks(tasksRes.value.data.tasks || []);
      if (financeRes.status === "fulfilled") setFinance(financeRes.value.data);
      setLoading(false);
    });
  }, []);

  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const firstName = user?.name?.split(" ")[0] || "";

  const gradeColor = {
    A: "text-forest-600",
    B: "text-harvest-600",
    C: "text-terracotta-600",
    D: "text-red-600",
  };

  return (
    <div className="space-y-8 max-w-7xl animate-slide-up-fade">
      {/* Hero greeting */}
      <div className="relative rounded-3xl overflow-hidden dash-hero-gradient border border-forest-100/60 bg-white/80 backdrop-blur-sm px-8 py-10 shadow-medium">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-ink">
              Namaste, {firstName} 👋
            </h2>
            <p className="text-ink/65 mt-2 text-lg">{t("overview.subtitle")}</p>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-primary text-white items-center justify-center shrink-0 shadow-glow-green">
            <Sprout size={32} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label={t("overview.soilHealth")}
          value={
            soil ? (
              <span className={gradeColor[soil.analysis.soilGrade] || ""}>
                {soil.analysis.soilHealthScore}/100
              </span>
            ) : "—"
          }
          sub={
            soil
              ? `Grade ${soil.analysis.soilGrade} · ${soil.analysis.fertilityStatus}`
              : t("overview.noSoilData")
          }
          icon={Sprout}
          accent="forest"
        />
        <StatCard
          label={t("overview.expectedProfit")}
          value={finance ? `₹${finance.profit.toLocaleString("en-IN")}` : "—"}
          sub={finance ? `ROI ${finance.roi}%` : t("overview.addTransactions")}
          icon={TrendingUp}
          accent="harvest"
        />
        <StatCard
          label={t("overview.pendingTasks")}
          value={loading ? "…" : pendingTasks.length}
          sub={pendingTasks[0]?.title || t("overview.allCaughtUp")}
          icon={ClipboardList}
          accent="sky"
        />
        <StatCard
          label={t("overview.recommendedCrops")}
          value={soil ? "View →" : "—"}
          sub={t("overview.basedOnSoil")}
          icon={ListTree}
          accent="terracotta"
        />
      </div>

      {/* AI Summary + Weather */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-p shadow-medium">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-forest-100/60">
            <h3 className="font-display text-xl font-bold text-ink">{t("overview.aiSummary")}</h3>
            <Activity size={20} className="text-forest-600" />
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 rounded-xl bg-forest-100/50 animate-pulse" style={{ width: `${85 - i * 10}%` }} />
              ))}
            </div>
          ) : soil ? (
            <div className="space-y-4 text-base text-ink/75 leading-relaxed">
              <p>
                Your soil is graded{" "}
                <span className={`font-bold ${gradeColor[soil.analysis.soilGrade] || "text-ink"}`}>
                  {soil.analysis.soilGrade}
                </span>{" "}
                with a health score of{" "}
                <span className="font-bold text-ink">{soil.analysis.soilHealthScore}/100</span>, indicating{" "}
                <span className="font-bold text-ink">{soil.analysis.fertilityStatus?.toLowerCase()}</span> fertility.
              </p>
              {soil.analysis.deficiencies?.length > 0 ? (
                <p>
                  <span className="text-terracotta-700 font-semibold">{t("overview.deficienciesDetected")}:</span>{" "}
                  {soil.analysis.deficiencies.join(", ")}.
                </p>
              ) : (
                <p className="text-forest-700 font-semibold">{t("overview.noDeficiencies")}</p>
              )}
              <Link
                to="/dashboard/crops"
                className="inline-flex items-center gap-2 text-forest-700 font-bold hover:underline mt-2"
              >
                {t("overview.seeCropRecs")} <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="text-base text-ink/60 space-y-4">
              <p>{t("overview.noSoilData")}</p>
              <Link
                to="/dashboard/soil"
                className="inline-flex items-center gap-2 btn-primary"
              >
                <Sprout size={18} /> {t("overview.addSoilData")}
              </Link>
            </div>
          )}
        </div>

        <div className="card-p shadow-medium">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-forest-100/60">
            <h3 className="font-display text-xl font-bold text-ink">{t("overview.currentWeather")}</h3>
            <CloudSun size={20} className="text-sky-600" />
          </div>
          <p className="text-base text-ink/65 leading-relaxed">{t("overview.weatherConnectNote")}</p>
          <Link
            to="/dashboard/weather"
            className="inline-flex items-center gap-2 text-base text-forest-700 font-bold hover:underline mt-5"
          >
            {t("overview.openWeather")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Recent tasks */}
      <div className="card-p shadow-medium">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-forest-100/60">
          <h3 className="font-display text-xl font-bold text-ink">{t("overview.recentActivity")}</h3>
          {tasks.length > 0 && (
            <Link to="/dashboard/tasks" className="text-sm text-forest-700 font-semibold hover:underline">
              {t("common.viewAll")}
            </Link>
          )}
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-forest-100/50 animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-base text-ink/60">{t("overview.noActivity")}</p>
        ) : (
          <ul className="divide-y divide-forest-100/60">
            {tasks.slice(0, 6).map((task) => (
              <li key={task._id} className="py-4 flex items-center justify-between gap-4 text-base">
                <div className="flex items-center gap-3 min-w-0">
                  {task.status === "Completed" ? (
                    <CheckCircle2 size={20} className="text-forest-600 shrink-0" />
                  ) : (
                    <Clock size={20} className="text-harvest-600 shrink-0" />
                  )}
                  <span className="text-ink/80 truncate font-medium">{task.title}</span>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold px-3 py-1.5 rounded-full ${
                    task.status === "Completed" ? "badge-green" : "badge-amber"
                  }`}
                >
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Overview;
