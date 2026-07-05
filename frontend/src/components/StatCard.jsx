import React from "react";

const StatCard = ({ label, value, sub, icon: Icon, accent = "forest" }) => {
  const accentMap = {
    forest: "bg-forest-100 text-forest-700",
    harvest: "bg-harvest-100 text-harvest-700",
    terracotta: "bg-terracotta-100 text-terracotta-700",
    sky: "bg-sky-100 text-sky-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-forest-100/70 p-5 flex items-start gap-4 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300 card-hover">
      {Icon && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
          <Icon size={24} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-ink/60 font-semibold">{label}</p>
        <p className="text-3xl font-display font-bold text-ink mt-1">{value}</p>
        {sub && <p className="text-sm text-ink/60 mt-1.5">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
