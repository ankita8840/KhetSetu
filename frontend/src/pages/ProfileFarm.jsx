import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Droplets, Ruler, Wrench, Save, User, Mail } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const WATER_SOURCES = ["Borewell", "Canal", "River", "Rainfed", "Pond", "Other"];

const ProfileFarm = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [form, setForm] = useState({
    farmerName: "",
    village: "",
    district: "",
    state: "",
    landAreaAcres: "",
    waterSource: "Rainfed",
    equipment: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/farm").then((res) => {
      const farm = res.data.farm;
      if (farm) {
        setForm({
          farmerName: farm.farmerName || "",
          village: farm.village || "",
          district: farm.district || "",
          state: farm.state || "",
          landAreaAcres: farm.landAreaAcres || "",
          waterSource: farm.waterSource || "Rainfed",
          equipment: (farm.equipment || []).join(", "),
        });
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    await api.put("/farm", {
      ...form,
      landAreaAcres: Number(form.landAreaAcres) || 0,
      equipment: form.equipment.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <p className="text-sm text-ink/50">{t("common.loading")}</p>;

  return (
  <div className="max-w-none w-full space-y-5 page-enter">

      {/* Account card */}
      <div className="card-p">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">Farmer Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
              <User size={16} />
            </div>
            <div>
              <p className="text-xs text-ink/40 uppercase tracking-wide">Name</p>
              <p className="text-sm text-ink mt-0.5">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
              <Mail size={16} />
            </div>
            <div>
              <p className="text-xs text-ink/40 uppercase tracking-wide">Email</p>
              <p className="text-sm text-ink mt-0.5 break-all">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Farm form */}
      <form onSubmit={handleSubmit} className="card-p space-y-5">
        <div className="flex items-center gap-2 border-b border-forest-50 pb-4">
          <MapPin size={18} className="text-forest-700" />
          <h3 className="font-display text-lg font-semibold text-ink">Farm Details</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Village / Town</label>
            <input name="village" value={form.village} onChange={handleChange}
              className="input mt-1.5" placeholder="Raebareli" />
          </div>
          <div>
            <label className="label">District</label>
            <input name="district" value={form.district} onChange={handleChange}
              className="input mt-1.5" placeholder="Lucknow" />
          </div>
          <div>
            <label className="label">State</label>
            <input name="state" value={form.state} onChange={handleChange}
              className="input mt-1.5" placeholder="Uttar Pradesh" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5">
              <Ruler size={13} /> Land Area (acres)
            </label>
            <input type="number" name="landAreaAcres" value={form.landAreaAcres}
              onChange={handleChange} className="input mt-1.5" placeholder="5" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5">
              <Droplets size={13} /> Water Source
            </label>
            <select name="waterSource" value={form.waterSource} onChange={handleChange}
              className="input mt-1.5">
              {WATER_SOURCES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label flex items-center gap-1.5">
              <Wrench size={13} /> Equipment (comma separated)
            </label>
            <input name="equipment" value={form.equipment} onChange={handleChange}
              className="input mt-1.5" placeholder="Tractor, Sprayer, Tiller" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button type="submit" className="btn-primary">
            <Save size={15} /> {t("common.save")}
          </button>
          {saved && (
            <span className="text-sm text-forest-700 font-medium animate-pulse">Saved ✓</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileFarm;
