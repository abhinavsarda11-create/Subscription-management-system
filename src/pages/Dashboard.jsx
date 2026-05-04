import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CreditCard, TrendingUp, Layers, Calendar, Bell, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";
import { CATEGORY_COLORS, daysUntil, formatDate, urgency, generateSpendHistory } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

function ChartTooltip({ active, payload, label, formatAmount }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-gold)",
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "0 8px 32px rgba(245,158,11,0.15)",
    }}>
      <p style={{ color: "var(--text-3)", fontSize: 11, marginBottom: 3 }}>{label}</p>
      <p style={{ color: "var(--gold-light)", fontWeight: 700, fontSize: 14, fontFamily: "'JetBrains Mono',monospace" }}>
        {formatAmount(payload[0]?.value || 0)}
      </p>
    </div>
  );
}

// Floating 3D orb scene for the hero area
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-gold absolute w-32 h-32 animate-float opacity-20"
        style={{ top: "8%", right: "5%", animationDelay: "0s" }} />
      <div className="orb orb-indigo absolute w-20 h-20 animate-float-slow opacity-15"
        style={{ top: "60%", right: "12%", animationDelay: "2s" }} />
      <div className="orb orb-rose absolute w-14 h-14 animate-float opacity-10"
        style={{ top: "30%", right: "20%", animationDelay: "1.2s" }} />
      <div className="orb orb-teal absolute w-10 h-10 animate-float-slow opacity-12"
        style={{ bottom: "15%", right: "8%", animationDelay: "3s" }} />
    </div>
  );
}

export default function Dashboard() {
  const {
    subscriptions, activeSubs, monthlyTotal, yearlyTotal,
    pausedCount, upcomingRenewals, formatAmount,
  } = useApp();
  const navigate = useNavigate();
  const history  = generateSpendHistory(monthlyTotal);

  const catTotals = {};
  activeSubs.forEach(s => { catTotals[s.category] = (catTotals[s.category] || 0) + Number(s.cost); });
  const catEntries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="page-enter space-y-5 relative">

      {/* ── Hero header with floating orbs ── */}
      <div className="relative rounded-2xl overflow-hidden p-6"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(245,158,11,0.06) 50%, rgba(20,184,166,0.08) 100%)",
          border: "1px solid var(--border-gold)",
          boxShadow: "0 24px 64px -16px rgba(245,158,11,0.1), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        <FloatingOrbs />

        {/* Gold top stripe */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, #6366f1, #f59e0b, #14b8a6, transparent)" }} />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} style={{ color: "var(--gold)" }} />
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
                {greeting}
              </p>
            </div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'Clash Display','Syne',sans-serif" }}
            >
              <span style={{ color: "var(--text-1)" }}>Subscription </span>
              <span className="gradient-text">Command Center</span>
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "var(--text-2)" }}>
              Tracking <strong style={{ color: "var(--gold)" }}>{subscriptions.length}</strong> services ·{" "}
              <span style={{ color: "var(--text-3)" }}>
                {formatAmount(monthlyTotal)}/mo · {formatAmount(yearlyTotal)}/yr
              </span>
            </p>
          </div>

          {upcomingRenewals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold flex-shrink-0"
              style={{
                background: "rgba(244,63,94,0.12)",
                border: "1px solid rgba(244,63,94,0.3)",
                color: "#fb7185",
                boxShadow: "0 0 20px rgba(244,63,94,0.2)",
              }}
            >
              <Bell size={13} className="pulse-dot" />
              {upcomingRenewals.length} due soon
            </motion.div>
          )}
        </div>
      </div>

      {/* ── KPI stat cards — each a different color theme ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard index={0} theme="indigo" icon={CreditCard}
          accent="#6366f1" label="Monthly"
          value={formatAmount(monthlyTotal)}
          sub={`${activeSubs.length} active services`}
        />
        <StatCard index={1} theme="gold" icon={TrendingUp}
          accent="#f59e0b" label="Yearly"
          value={formatAmount(yearlyTotal)}
          sub="projected annual"
        />
        <StatCard index={2} theme="rose" icon={Layers}
          accent="#f43f5e" label="Services"
          value={subscriptions.length}
          sub={`${pausedCount} paused`}
        />
        <StatCard index={3} theme="teal" icon={Calendar}
          accent="#14b8a6" label="Next Due"
          value={upcomingRenewals[0]?.name || "All clear!"}
          sub={upcomingRenewals[0]
            ? `in ${daysUntil(upcomingRenewals[0].renewalDate)} days`
            : "No renewals in 10 days"}
        />
      </div>

      {/* ── Chart + Renewals ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Spend trend with gold area chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-3 card p-5"
        >
          <div className="section-header">
            <div>
              <p className="section-title">Spend Trend</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>6-month overview</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold gold-text"
                style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                {formatAmount(monthlyTotal)}
              </p>
              <button type="button" onClick={() => navigate("/analytics")} className="section-link text-[11px]">
                Full analytics →
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={history} margin={{ top: 4, right: 2, bottom: 0, left: -12 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="60%"  stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#6366f1" />
                  <stop offset="50%"  stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
              <XAxis dataKey="month"
                tick={{ fill: "var(--text-3)", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}
                axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "var(--text-3)", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}
                axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} width={38} />
              <Tooltip content={<ChartTooltip formatAmount={formatAmount} />}
                cursor={{ stroke: "rgba(245,158,11,0.2)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="amount"
                stroke="url(#goldLine)" strokeWidth={2.5}
                fill="url(#goldGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 0, filter: "drop-shadow(0 0 6px rgba(245,158,11,0.8))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming renewals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="xl:col-span-2 card p-5 flex flex-col"
        >
          <p className="section-title mb-1">Upcoming Renewals</p>
          <p className="text-[11px] mb-4" style={{ color: "var(--text-3)" }}>Next 10 days</p>

          {upcomingRenewals.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
              {/* 3D checkmark orb */}
              <div className="orb orb-teal w-14 h-14 animate-float flex items-center justify-center"
                style={{ fontSize: 22 }}>
                ✅
              </div>
              <p className="text-xs text-center" style={{ color: "var(--text-3)" }}>
                No renewals in the next 10 days
              </p>
            </div>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto">
              {upcomingRenewals.map((sub, i) => {
                const d    = daysUntil(sub.renewalDate);
                const u    = urgency(d);
                const uSty = URG_CONFIG[u.color] || URG_CONFIG.slate;
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{
                      background: "var(--bg-raised)",
                      border: `1px solid ${sub.color}20`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${sub.color}30, ${sub.color}10)`,
                        boxShadow: `0 2px 8px ${sub.color}25`,
                      }}>
                      {sub.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-1)" }}>
                        {sub.name}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--text-3)" }}>
                        {formatDate(sub.renewalDate)}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                      style={{
                        background: uSty.bg,
                        border: `1px solid ${uSty.border}`,
                        color: uSty.text,
                        boxShadow: uSty.glow,
                      }}
                    >
                      {u.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Bottom row: categories + top services ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Category breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <div className="section-header">
            <p className="section-title">By Category</p>
            <button type="button" onClick={() => navigate("/analytics")} className="section-link">
              Analytics →
            </button>
          </div>

          {/* Multi-color stacked bar */}
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-4">
            {catEntries.map(([cat, amt]) => (
              <motion.div
                key={cat}
                initial={{ width: 0 }}
                animate={{ width: `${(amt / monthlyTotal) * 100}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                title={cat}
                className="rounded-full"
                style={{
                  background: CATEGORY_COLORS[cat] || "#6366f1",
                  boxShadow: `0 0 6px ${CATEGORY_COLORS[cat] || "#6366f1"}80`,
                }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {catEntries.map(([cat, amt]) => {
              const pct   = Math.round((amt / monthlyTotal) * 100);
              const color = CATEGORY_COLORS[cat] || "#6366f1";
              return (
                <div key={cat} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-sm mt-0.5 flex-shrink-0"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs truncate" style={{ color: "var(--text-2)" }}>{cat}</p>
                      <p className="text-[10px] font-bold ml-1 flex-shrink-0" style={{ color }}>
                        {pct}%
                      </p>
                    </div>
                    <p className="text-[10px]" style={{ color: "var(--text-3)" }}>{formatAmount(amt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top services */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5"
        >
          <div className="section-header">
            <p className="section-title">Top Services</p>
            <button type="button" onClick={() => navigate("/subs")} className="section-link">
              View all →
            </button>
          </div>

          <div className="space-y-3">
            {[...activeSubs].sort((a, b) => b.cost - a.cost).slice(0, 5).map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-center gap-3 group"
              >
                <span className="text-[10px] font-mono w-3 flex-shrink-0" style={{ color: "var(--text-3)" }}>
                  {i + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 transition-all group-hover:scale-110"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${sub.color}30, ${sub.color}10)`,
                    border: `1px solid ${sub.color}30`,
                    boxShadow: `0 2px 8px ${sub.color}20`,
                  }}
                >
                  {sub.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: "var(--text-1)" }}>{sub.name}</p>
                  <div className="h-[3px] mt-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-raised)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(sub.cost / (activeSubs[0]?.cost || 1)) * 100}%` }}
                      transition={{ duration: 0.7, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${sub.color}, ${sub.color}aa)`,
                        boxShadow: `0 0 6px ${sub.color}60`,
                      }}
                    />
                  </div>
                </div>
                <p
                  className="text-xs font-bold flex-shrink-0"
                  style={{
                    color: i === 0 ? "var(--gold)" : "var(--text-1)",
                    fontFamily: "'JetBrains Mono',monospace",
                    letterSpacing: "-0.03em",
                    textShadow: i === 0 ? "0 0 12px rgba(245,158,11,0.5)" : "none",
                  }}
                >
                  {formatAmount(sub.cost)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Urgency badge config (shared in this file)
const URG_CONFIG = {
  red:    { bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.3)",   text: "#fb7185", glow: "0 0 8px rgba(244,63,94,0.4)"  },
  orange: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  text: "#fbbf24", glow: "0 0 8px rgba(245,158,11,0.4)" },
  yellow: { bg: "rgba(234,179,8,0.10)",   border: "rgba(234,179,8,0.25)",  text: "#facc15", glow: "none" },
  slate:  { bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)", text: "#64748b", glow: "none" },
};
