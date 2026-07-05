import React from "react";
import { Sparkles } from "lucide-react";

const ComingSoon = ({ title, description, items = [] }) => (
  <div className="bg-white rounded-2xl border border-forest-100 p-10 text-center max-w-2xl mx-auto shadow-sm">
    <div className="w-14 h-14 rounded-2xl bg-harvest-50 text-harvest-600 flex items-center justify-center mx-auto mb-4">
      <Sparkles size={26} />
    </div>
    <h2 className="text-2xl font-display font-semibold text-ink">{title}</h2>
    <p className="text-ink/60 mt-2">{description}</p>
    {items.length > 0 && (
      <div className="flex flex-wrap gap-2 justify-center mt-5">
        {items.map((item) => (
          <span
            key={item}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-forest-50 text-forest-700 border border-forest-100"
          >
            {item}
          </span>
        ))}
      </div>
    )}
    <p className="text-xs text-ink/40 mt-6">Phase 2 roadmap — coming after MVP launch</p>
  </div>
);

export default ComingSoon;
