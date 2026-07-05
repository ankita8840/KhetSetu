import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarCheck2, User, Plus } from "lucide-react";
import api from "../services/api.js";

const STATUS_STEPS = ["Pending", "Accepted", "Sample Collected", "Testing", "Completed"];

const statusColor = {
  Pending: "bg-harvest-50 text-harvest-600",
  Accepted: "bg-sky-50 text-sky-600",
  "Sample Collected": "bg-sky-50 text-sky-600",
  Testing: "bg-sky-50 text-sky-600",
  Completed: "bg-forest-50 text-forest-700",
};

const EXPERTS = ["Dr. Anil Sharma (Soil Scientist)", "Dr. Priya Verma (Agronomist)", "KVK District Expert"];

const SoilBooking = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ expertName: EXPERTS[0], preferredDate: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/booking").then((res) => setBookings(res.data.bookings));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await api.post("/booking", form);
    setBookings((prev) => [res.data.booking, ...prev]);
    setForm({ expertName: EXPERTS[0], preferredDate: "", notes: "" });
    setSubmitting(false);
  };

  return (
  <div className="w-full space-y-6 page-enter">
      <form onSubmit={handleSubmit} className="card-p w-full space-y-4">
        <div className="flex items-center gap-2">
          <CalendarCheck2 size={18} className="text-forest-700" />
          <h3 className="font-display text-lg font-semibold text-ink">Book Soil Testing</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70 flex items-center gap-1.5">
              <User size={14} /> Select Expert
            </label>
            <select
              name="expertName"
              value={form.expertName}
              onChange={handleChange}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 focus:border-forest-400 outline-none text-sm bg-white"
            >
              {EXPERTS.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Choose Date</label>
            <input
              type="date"
              required
              name="preferredDate"
              value={form.preferredDate}
              onChange={handleChange}
              className="input mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-ink/70">Notes (optional)</label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any specific area or concern to test"
              className="input mt-1.5"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 bg-forest-700 text-paper px-5 py-2.5 rounded-lg font-medium hover:bg-forest-800 transition-colors text-sm disabled:opacity-60"
        >
          <Plus size={16} /> {submitting ? "Booking..." : "Send Online Request"}
        </button>
      </form>

      <div className="card-p w-full">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">Booking Status</h3>
        {bookings.length === 0 ? (
          <p className="text-sm text-ink/50">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="border border-forest-100 rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-ink text-sm">{b.expertName}</p>
                    <p className="text-xs text-ink/45 mt-0.5">
                      {new Date(b.preferredDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {STATUS_STEPS.map((step, i) => {
                    const reached = STATUS_STEPS.indexOf(b.status) >= i;
                    return (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full ${reached ? "bg-forest-600" : "bg-forest-50"}`}
                        title={step}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilBooking;
