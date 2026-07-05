import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import api from "../services/api.js";

const COLORS = ["#2A4F32", "#C9961A", "#A75D3A", "#3D7A8C", "#3D6B45"];

const Analytics = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics").then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-sm text-ink/50">Loading analytics...</p>;

  const expenseData = Object.entries(data.expenseByCategory).map(([category, amount]) => ({
    category,
    amount,
  }));

  const diseaseData = Object.entries(data.diseaseCounts).map(([name, count]) => ({ name, count }));

  return (
    <div className="w-full min-h-screen space-y-6 page-enter px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Soil Entries" value={data.soilEntryCount} icon={BarChart3} accent="forest" />
        <StatCard label="Disease Scans" value={data.diseaseDetectionCount} icon={BarChart3} accent="terracotta" />
        <StatCard
          label="Net Profit"
          value={`₹${data.profit.toLocaleString("en-IN")}`}
          icon={BarChart3}
          accent="harvest"
        />
        <StatCard
          label="Total Expense"
          value={`₹${data.totalExpense.toLocaleString("en-IN")}`}
          icon={BarChart3}
          accent="sky"
        />
      </div>

      <div className="card-p">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">Soil Health Score Trend</h3>
        {data.soilTrend.length === 0 ? (
          <p className="text-sm text-ink/50">Add soil data to see your trend over time.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.soilTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAF0EA" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA89F" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9CA89F" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2A4F32" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-p">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">Expense Analytics</h3>
          {expenseData.length === 0 ? (
            <p className="text-sm text-ink/50">No expense data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAF0EA" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="#9CA89F" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA89F" />
                <Tooltip />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {expenseData.map((entry, i) => (
                    <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card-p">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">Disease Analytics</h3>
          {diseaseData.length === 0 ? (
            <p className="text-sm text-ink/50">No disease detections yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={diseaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAF0EA" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9CA89F" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA89F" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#A75D3A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
