import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Wallet, Plus, TrendingUp, Trash2 } from "lucide-react";
import api from "../services/api.js";

const EXPENSE_CATEGORIES = ["Seeds", "Fertilizers", "Labor", "Machinery", "Other"];
const INCOME_CATEGORIES = ["Crop Sale", "Other"];

const FarmFinance = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({ type: "expense", category: "Seeds", amount: "", description: "", date: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get("/finance").then((res) => setTransactions(res.data.transactions));
    api.get("/finance/summary").then((res) => setSummary(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" ? { category: value === "expense" ? "Seeds" : "Crop Sale" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.post("/finance", { ...form, amount: Number(form.amount) });
    setForm({ type: "expense", category: "Seeds", amount: "", description: "", date: "" });
    load();
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    await api.delete(`/finance/${id}`);
    load();
  };

  return (
    <div className="w-full space-y-6 page-enter">
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
          <div className="bg-white rounded-2xl border border-forest-100 p-5">
            <p className="text-xs uppercase tracking-wide text-ink/45">Total Income</p>
            <p className="text-2xl font-display font-semibold text-forest-700 mt-1">
              ₹{summary.totalIncome.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-forest-100 p-5">
            <p className="text-xs uppercase tracking-wide text-ink/45">Total Expense</p>
            <p className="text-2xl font-display font-semibold text-terracotta-600 mt-1">
              ₹{summary.totalExpense.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-forest-100 p-5">
            <p className="text-xs uppercase tracking-wide text-ink/45">Profit</p>
            <p className="text-2xl font-display font-semibold text-ink mt-1">
              ₹{summary.profit.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-forest-100 p-5">
            <p className="text-xs uppercase tracking-wide text-ink/45 flex items-center gap-1">
              <TrendingUp size={13} /> ROI
            </p>
            <p className="text-2xl font-display font-semibold text-ink mt-1">{summary.roi}%</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-p w-full space-y-4">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-forest-700" />
          <h3 className="font-display text-lg font-semibold text-ink">Add Transaction</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
          <div>
            <label className="text-sm font-medium text-ink/70">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm bg-white"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm bg-white"
            >
              {(form.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Amount (₹)</label>
            <input
              type="number"
              required
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="text-sm font-medium text-ink/70">Description</label>
            <input
              name="description"
              value={form.description}
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
          <Plus size={16} /> {submitting ? "Saving..." : "Add Transaction"}
        </button>
      </form>

      <div className="card-p w-full">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">Financial Report</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-ink/50">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink/45 text-xs uppercase tracking-wide border-b border-forest-50">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-forest-50/70 text-ink/75">
                    <td className="py-2.5 pr-4">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                    <td className="py-2.5 pr-4 capitalize">{t.type}</td>
                    <td className="py-2.5 pr-4">{t.category}</td>
                    <td className="py-2.5 pr-4">{t.description || "—"}</td>
                    <td className={`py-2.5 pr-4 font-medium ${t.type === "income" ? "text-forest-700" : "text-terracotta-600"}`}>
                      {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 pr-4">
                      <button onClick={() => handleDelete(t._id)} className="text-ink/30 hover:text-terracotta-600">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmFinance;
