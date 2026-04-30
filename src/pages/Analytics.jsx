import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import { useApp } from "../context/AppContext";
import { CATEGORY_COLORS, generateSpendHistory, daysUntil } from "../utils/helpers";

const TOOLTIP = ({ active, payload, formatAmount }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm shadow-card">
      <p className="text-slate-400 text-xs mb-1">{payload[0]?.name}</p>
      <p className="text-white font-bold">{formatAmount(payload[0]?.value || 0)}</p>
    </div>
  );
};

export default function Analytics() {
  const { subscriptions, activeSubs, monthlyTotal, yearlyTotal, formatAmount } = useApp();

  // Category totals
  const catData = Object.entries(
    activeSubs.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + Number(s.cost);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || "#6366f1" }))
   .sort((a, b) => b.value - a.value);

  const history = generateSpendHistory(monthlyTotal);

  // Health score
  const healthScore = Math.max(0, Math.min(100,
    100 - (subscriptions.filter(s => s.status === "paused").length * 5)
        - (activeSubs.filter(s => daysUntil(s.renewalDate) <= 3).length * 10)
        - (activeSubs.length > 8 ? 15 : 0)
  ));

  const insights = [
    { label: "Daily spend", value: formatAmount(Math.round(monthlyTotal / 30)), icon: "📅" },
    { label: "Avg per service", value: formatAmount(activeSubs.length ? Math.round(monthlyTotal / activeSubs.length) : 0), icon: "⚡" },
    { label: "Yearly total", value: formatAmount(yearlyTotal), icon: "📊" },
    { label: "Health score", value: `${healthScore}/100`, icon: healthScore >= 75 ? "✅" : healthScore >= 50 ? "⚠️" : "🔴" },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Deep insights into your subscription spending</p>
      </div>

      {/* Insight tiles */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} className="card p-5">
            <p className="text-2xl mb-3">{item.icon}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">{item.label}</p>
            <p className="text-xl font-display font-bold text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* 6-month bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }} className="card p-6 xl:col-span-3">
          <h2 className="font-display font-bold text-white text-lg mb-1">Monthly Spend vs Budget</h2>
          <p className="text-slate-500 text-sm mb-5">6-month comparison</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={history} barGap={4}>
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<TOOLTIP formatAmount={formatAmount} />} />
              <Bar dataKey="amount" name="Actual" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar dataKey="budget" name="Budget" fill="#1e293b" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }} className="card p-6 xl:col-span-2">
          <h2 className="font-display font-bold text-white text-lg mb-1">By Category</h2>
          <p className="text-slate-500 text-sm mb-2">Distribution of spend</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={catData} dataKey="value" cx="50%" cy="50%"
                innerRadius={55} outerRadius={85} paddingAngle={3}>
                {catData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatAmount(v)} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="space-y-1.5 mt-2">
            {catData.slice(0, 4).map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                  <span className="text-slate-400 text-xs">{d.name}</span>
                </div>
                <span className="text-white text-xs font-semibold">{formatAmount(d.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Area trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }} className="card p-6">
        <h2 className="font-display font-bold text-white text-lg mb-1">Spend Growth Trend</h2>
        <p className="text-slate-500 text-sm mb-5">How your subscription costs have grown</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<TOOLTIP formatAmount={formatAmount} />} />
            <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5}
              fill="url(#areaGrad)" dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category breakdown table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }} className="card p-6">
        <h2 className="font-display font-bold text-white text-lg mb-5">Category Breakdown</h2>
        <div className="space-y-4">
          {catData.map(({ name, value, color }) => {
            const pct = Math.round((value / monthlyTotal) * 100);
            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                    <span className="text-slate-300 text-sm font-medium">{name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">{pct}%</span>
                    <span className="text-white text-sm font-bold font-mono w-24 text-right">{formatAmount(value)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
