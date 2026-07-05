import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bug, UploadCloud, Stethoscope, ShieldPlus, History, Info } from "lucide-react";
import api from "../services/api.js";

const DiseaseDetection = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/disease/history").then((res) => setHistory(res.data.entries));
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/disease/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.entry);
      setHistory((prev) => [res.data.entry, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || "Detection failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 page-enter">
      <div className="bg-sky-50 border border-sky-100 text-sky-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
        <Info size={16} className="mt-0.5 shrink-0" />
        Demo mode: results are simulated for now. A trained image-recognition model will replace this in a future update.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <form onSubmit={handleSubmit} className="card-p w-full">
          <div className="flex items-center gap-2 mb-4">
            <Bug size={18} className="text-forest-700" />
            <h3 className="font-display text-lg font-semibold text-ink">Upload Leaf Image</h3>
          </div>

          <label
            htmlFor="leaf-upload"
            className="block border-2 border-dashed border-forest-100 rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:border-forest-300 transition-colors overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="Leaf preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-ink/45">
                <UploadCloud size={28} className="mx-auto mb-2" />
                <p className="text-sm">Click to upload a leaf photo</p>
                <p className="text-xs mt-1">JPG or PNG, up to 5MB</p>
              </div>
            )}
          </label>
          <input id="leaf-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          {error && <p className="text-sm text-terracotta-600 mt-3">{error}</p>}

          <button
            type="submit"
            disabled={!file || submitting}
            className="w-full mt-4 bg-forest-700 text-paper py-2.5 rounded-lg font-medium hover:bg-forest-800 transition-colors text-sm disabled:opacity-50"
          >
            {submitting ? "Analyzing..." : "Run AI Disease Detection"}
          </button>
        </form>

        <div className="card-p w-full">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope size={18} className="text-forest-700" />
            <h3 className="font-display text-lg font-semibold text-ink">Detection Result</h3>
          </div>

          {!result ? (
            <p className="text-sm text-ink/50">Upload an image to see disease detection results here.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xl font-semibold text-ink">{result.diseaseName}</h4>
                <span className="text-sm font-medium bg-forest-50 text-forest-700 px-3 py-1 rounded-full">
                  {result.confidence}% confidence
                </span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-ink/45 mb-1.5">Symptoms</p>
                <ul className="text-sm text-ink/70 space-y-1">
                  {result.symptoms.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-ink/45 mb-1.5 flex items-center gap-1.5">
                  <ShieldPlus size={13} /> Treatment
                </p>
                <ul className="text-sm text-ink/70 space-y-1">
                  {result.treatment.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-ink/45 mb-1.5">Prevention</p>
                <ul className="text-sm text-ink/70 space-y-1">
                  {result.prevention.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card-p w-full">
        <div className="flex items-center gap-2 mb-4">
          <History size={18} className="text-forest-700" />
          <h3 className="font-display text-lg font-semibold text-ink">Disease History</h3>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-ink/50">No detections yet.</p>
        ) : (
          <ul className="divide-y divide-forest-50">
            {history.map((h) => (
              <li key={h._id} className="py-3 flex items-center justify-between text-sm">
                <span className="text-ink/80">{h.diseaseName}</span>
                <span className="text-ink/45 text-xs">{new Date(h.createdAt).toLocaleDateString("en-IN")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetection;
