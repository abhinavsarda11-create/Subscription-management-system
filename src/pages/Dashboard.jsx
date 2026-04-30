import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CreditCard, TrendingUp, Calendar, Zap, Bell } from "lucide-react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";
import { CATEGORY_COLORS, daysUntil, formatDate, urgency, generateSpendHistory } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

// ── Custom tooltip for chart ───────────────────────────────
function ChartTooltip({ active, payload, label, formatAmount }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-white font-bold">{formatAmount(payload[0]?.value || 0)}</p>
    </div>
  );
}

export default function Dashboard() {
  const {
    subscriptions, activeSubs, monthlyTotal, yearlyTotal,
    pausedCount, upcomingRenewals, formatAmount,
  } = useApp();
  const navigate = useNavigate();

  const spendHistory = generateSpendHistory(monthlyTotal);

  // Category totals for donut-like chart
  const catTotals = {};
  activeSubs.forEach(s => {
    catTotals[s.category] = (catTotals[s.category] || 0) + Number(s.cost);
  });
  const catEntries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-500 text-sm font-medium mb-1"
          >
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"} 👋
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl font-display font-bold text-white"
          >
            Your <span className="gradient-text">Subscription</span> Command Center
          </motion.h1>
        </div>
        {upcomingRenewals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                       bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
          >
            <Bell size={14} className="animate-pulse" />
            {upcomingRenewals.length} renewal{upcomingRenewals.length > 1 ? "s" : ""} soon
          </motion.div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        <StatCard index={0} icon={CreditCard} label="Monthly Spend"
          value={formatAmount(monthlyTotal)}
          sub={`${activeSubs.length} active services`}
          accent="#6366f1" />
        <StatCard index={1} icon={TrendingUp} label="Yearly Projection"
          value={formatAmount(yearlyTotal)}
          sub="at current rate"
          accent="#8b5cf6" trend={7} />
        <StatCard index={2} icon={Zap} label="Total Services"
          value={subscriptions.length}
          sub={`${pausedCount} paused`}
          accent="#06b6d4" />
        <StatCard index={3} icon={Calendar} label="Next Renewal"
          value={upcomingRenewals[0]?.name || "Clear!"}
          sub={upcomingRenewals[0] ? `in ${daysUntil(upcomingRenewals[0].renewalDate)} days` : "No renewals in 10 days"}
          accent="#22c55e" />
      </div>

      {/* Two-col layout: chart + renewals */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Spend trend chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-3 card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-white text-lg">Spend Trend</h2>
              <p className="text-slate-500 text-sm">6-month overview</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display font-bold text-white">{formatAmount(monthlyTotal)}</p>
              <p className="text-red-400 text-xs font-medium flex items-center justify-end gap-1">
                <TrendingUp size={11} /> 7% vs last month
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={spendHistory}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} width={40}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip formatAmount={formatAmount} />} />
              <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5}
                fill="url(#spendGrad)" dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#8b5cf6" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming renewals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="xl:col-span-2 card p-6 flex flex-col"
        >
          <h2 className="font-display font-bold text-white text-lg mb-1">Upcoming Renewals</h2>
          <p className="text-slate-500 text-sm mb-5">Next 10 days</p>

          {upcomingRenewals.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
              <div className="text-4xl">✅</div>
              <p className="text-slate-500 text-sm text-center">All clear! No renewals in the next 10 days.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {upcomingRenewals.map(sub => {
                const days = daysUntil(sub.renewalDate);
                const urg = urgency(days);
                return (
                  <motion.div
                    key={sub.id}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: `${sub.color}20` }}>
                      {sub.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{sub.name}</p>
                      <p className="text-slate-500 text-xs">{formatDate(sub.renewalDate)}</p>
                    </div>
                    <span className={`badge border text-xs ${urg.cls}`}>{urg.label}</span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Category breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-white text-lg">Spend by Category</h2>
          <button onClick={() => navigate("/analytics")}
            className="text-brand-400 text-sm font-medium hover:text-brand-300 transition-colors">
            Full analytics →
          </button>
        </div>

        {/* Stacked bar */}
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-5">
          {catEntries.map(([cat, amt]) => (
            <motion.div
              key={cat}
              initial={{ width: 0 }}
              animate={{ width: `${(amt / monthlyTotal) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              title={`${cat}: ₹${amt.toLocaleString("en-IN")}`}
              className="rounded-full"
              style={{ background: CATEGORY_COLORS[cat] || "#6366f1" }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {catEntries.map(([cat, amt]) => {
            const pct = Math.round((amt / monthlyTotal) * 100);
            const color = CATEGORY_COLORS[cat] || "#6366f1";
            return (
              <div key={cat} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{cat}</p>
                  <p className="text-slate-500 text-xs">{formatAmount(amt)} · {pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent subscriptions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white text-lg">Top Services</h2>
          <button onClick={() => navigate("/subs")}
            className="text-brand-400 text-sm font-medium hover:text-brand-300 transition-colors">
            View all →
          </button>
        </div>
        <div className="space-y-3">
          {[...activeSubs].sort((a, b) => b.cost - a.cost).slice(0, 5).map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-slate-600 text-xs font-mono w-4">{i + 1}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: `${sub.color}18` }}>
                {sub.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{sub.name}</p>
                <div className="h-1 mt-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(sub.cost / activeSubs[0]?.cost || 1) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: sub.color }}
                  />
                </div>
              </div>
              <p className="text-white text-sm font-bold font-mono">{formatAmount(sub.cost)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
