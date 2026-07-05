import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloudSun, Droplets, Wind, Thermometer, CloudRain, Sprout, Info, MapPin } from "lucide-react";
import api from "../services/api.js";
import { getCurrentCoords } from "../utils/geolocation.js";

const DEFAULT_CITY = "Lucknow";

const WeatherIntelligence = () => {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("location"); // "location" | "search"
  const [locationNotice, setLocationNotice] = useState(null);

  const fetchByCity = (c) => {
    setLoading(true);
    setMode("search");
    setLocationNotice(null);
    api.get(`/weather?city=${encodeURIComponent(c)}`).then((res) => {
      setWeather(res.data);
      setCity(res.data.city);
      setLoading(false);
    });
  };

  const fetchByCoords = (latitude, longitude) => {
    return api.get(`/weather?lat=${latitude}&lon=${longitude}`).then((res) => {
      setWeather(res.data);
      setCity(res.data.city);
      setLoading(false);
    });
  };

  const useMyLocation = () => {
    setLoading(true);
    setMode("location");
    setLocationNotice(null);
    getCurrentCoords()
      .then(({ latitude, longitude }) => fetchByCoords(latitude, longitude))
      .catch(() => {
        setLocationNotice(DEFAULT_CITY);
        api.get(`/weather?city=${encodeURIComponent(DEFAULT_CITY)}`).then((res) => {
          setWeather(res.data);
          setCity(res.data.city);
          setLoading(false);
        });
      });
  };

  useEffect(() => {
    useMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full space-y-6 page-enter">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (city.trim()) fetchByCity(city.trim());
        }}
        className="flex flex-wrap gap-3"
      >
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("weather.searchPlaceholder")}
          className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-lg border border-forest-100 focus:border-forest-400 outline-none text-sm bg-white"
        />
        <button
          type="submit"
          className="bg-forest-700 text-paper px-5 py-2.5 rounded-lg font-medium hover:bg-forest-800 transition-colors text-sm"
        >
          {t("weather.update")}
        </button>
        <button
          type="button"
          onClick={useMyLocation}
          title={t("weather.useMyLocation")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm border transition-colors ${
            mode === "location"
              ? "bg-sky-50 border-sky-100 text-sky-600"
              : "border-forest-100 text-forest-700 hover:bg-forest-50"
          }`}
        >
          <MapPin size={16} />
          <span className="hidden sm:inline">{t("weather.myLocation")}</span>
        </button>
      </form>

      {mode === "search" && (
        <div className="bg-forest-50 border border-forest-100 text-forest-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <Info size={16} className="mt-0.5 shrink-0" />
          {t("weather.viewingSearched")}
        </div>
      )}

      {locationNotice && (
        <div className="bg-sky-50 border border-sky-100 text-sky-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <Info size={16} className="mt-0.5 shrink-0" />
          {t("weather.locationDenied", { city: locationNotice })}
        </div>
      )}

      {weather?.demo && (
        <div className="bg-sky-50 border border-sky-100 text-sky-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <Info size={16} className="mt-0.5 shrink-0" />
          {t("weather.demoNotice")}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">{t("weather.loading")}</p>
      ) : weather && (
        <>
          <div className="w-full bg-forest-800 text-forest-50 rounded-2xl p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-forest-100/60">{weather.city}</p>
                <p className="font-display text-5xl font-semibold mt-1">{weather.temperature}°C</p>
                <p className="text-forest-100/75 mt-1">{weather.condition}</p>
              </div>
              <CloudSun size={56} className="text-harvest-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="bg-white rounded-2xl border border-forest-100 p-5 text-center">
              <Droplets size={20} className="text-sky-500 mx-auto mb-2" />
              <p className="text-xl font-display font-semibold text-ink">{weather.humidity}%</p>
              <p className="text-xs text-ink/50">{t("weather.humidity")}</p>
            </div>
            <div className="bg-white rounded-2xl border border-forest-100 p-5 text-center">
              <Wind size={20} className="text-sky-500 mx-auto mb-2" />
              <p className="text-xl font-display font-semibold text-ink">{weather.windSpeed} km/h</p>
              <p className="text-xs text-ink/50">{t("weather.windSpeed")}</p>
            </div>
            <div className="bg-white rounded-2xl border border-forest-100 p-5 text-center">
              <CloudRain size={20} className="text-sky-500 mx-auto mb-2" />
              <p className="text-xl font-display font-semibold text-ink">{weather.rainChance}%</p>
              <p className="text-xs text-ink/50">{t("weather.rainChance")}</p>
            </div>
          </div>

          <div className="w-full bg-white rounded-2xl border border-forest-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sprout size={18} className="text-forest-700" />
              <h3 className="font-display text-lg font-semibold text-ink">{t("weather.irrigationTitle")}</h3>
            </div>
            <p className="text-sm text-ink/65">{weather.irrigationSuggestion}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherIntelligence;
