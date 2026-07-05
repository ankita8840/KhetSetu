import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardList, Plus, Check, Trash2 } from "lucide-react";
import api from "../services/api.js";

const TASK_TYPES = ["Irrigation", "Fertilizer", "Harvest", "Soil Testing", "Other"];

const TaskManager = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", type: "Irrigation", dueDate: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get("/tasks").then((res) => setTasks(res.data.tasks));

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.post("/tasks", form);
    setForm({ title: "", type: "Irrigation", dueDate: "", notes: "" });
    load();
    setSubmitting(false);
  };

  const toggleComplete = async (task) => {
    await api.put(`/tasks/${task._id}`, { status: task.status === "Pending" ? "Completed" : "Pending" });
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    load();
  };

  const today = new Date();
  const aiAlerts = tasks.filter(
    (t) => t.status === "Pending" && new Date(t.dueDate) <= new Date(today.getTime() + 2 * 86400000)
  );

  return (
    <div className="w-full space-y-6 page-enter">
      {aiAlerts.length > 0 && (
        <div className="w-full bg-harvest-50 border border-harvest-200 rounded-xl px-4 py-3">
          <p className="text-sm font-medium text-harvest-600">AI Smart Alert</p>
          <p className="text-sm text-ink/65 mt-0.5">
            {aiAlerts.length} task{aiAlerts.length > 1 ? "s" : ""} due within 2 days:{" "}
            {aiAlerts.map((t) => t.title).join(", ")}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-p w-full space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-forest-700" />
          <h3 className="font-display text-lg font-semibold text-ink">Add Reminder</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
          <div>
            <label className="text-sm font-medium text-ink/70">Title</label>
            <input
              required
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Irrigate wheat field"
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm bg-white"
            >
              {TASK_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Due Date</label>
            <input
              type="date"
              required
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm"
            />
          </div>
          <div className="md:col-span-2 xl:col-span-2">
  <label className="text-sm font-medium text-ink/70">Notes</label>
  <input
    name="notes"
    value={form.notes}
    onChange={handleChange}
    className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm"
  />
</div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 bg-forest-700 text-paper px-5 py-2.5 rounded-lg font-medium hover:bg-forest-800 transition-colors text-sm disabled:opacity-60"
        >
          <Plus size={16} /> {submitting ? "Adding..." : "Add Task"}
        </button>
      </form>

      <div className="card-p w-full">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">Your Tasks</h3>
        {tasks.length === 0 ? (
          <p className="text-sm text-ink/50">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t._id}
                className={`flex items-center justify-between gap-3 border border-forest-50 rounded-xl px-4 py-3 ${
                  t.status === "Completed" ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleComplete(t)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${
                      t.status === "Completed" ? "bg-forest-700 border-forest-700 text-white" : "border-forest-200"
                    }`}
                  >
                    {t.status === "Completed" && <Check size={13} />}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm text-ink ${t.status === "Completed" ? "line-through" : ""}`}>{t.title}</p>
                    <p className="text-xs text-ink/45">
                      {t.type} · Due {new Date(t.dueDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(t._id)} className="text-ink/30 hover:text-terracotta-600 shrink-0">
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
