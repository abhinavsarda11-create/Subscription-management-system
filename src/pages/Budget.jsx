import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { CATEGORY_COLORS } from "../utils/helpers";
import { useState } from "react";
import { Save, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

function GaugeRing({ pct, color, size = 160, stroke = 14 }) {
  const R = (size - stroke) / 2;
  const circ = 2 * Math.PI * R;
  const fill = Math.min(pct / 100, 1) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={R} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${fill} ${circ}` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      />
    </svg>
  );
}

export default function Budget() {
  const { subscriptions, activeSubs, monthlyTotal, budget, setBudget, formatAmount } = useApp();
  const [editBudget, setEditBudget] = useState(budget.monthly);
  const [catBudgets, setCatBudgets] = useState(budget.categories || {});

  const pct    = budget.monthly > 0 ? (monthlyTotal / budget.monthly) * 100 : 0;
  const isOver = monthlyTotal > budget.monthly;
  const color  = isOver ? "#ef4444" : pct > 80 ? "#fb923c" : "#22c55e";

  const catSpend = {};
  activeSubs.forEach(s => { catSpend[s.category] = (catSpend[s.category] || 0) + Number(s.cost); });

  const handleSave = () => {
    setBudget({ monthly: Number(editBudget), categories: catBudgets });
    toast.success("Budget saved!");
  };

  const tips = [];
  if (isOver) tips.push({ icon: "🔴", color: "#ef4444", title: "Over budget", body: `You're ₹${(monthlyTotal - budget.monthly).toLocaleString("en-IN")} over. Consider pausing a subscription.` });
  if (activeSubs.length > 7) tips.push({ icon: "🧹", color: "#fb923c", title: "Too many subs", body: `${activeSubs.length} active subscriptions is a lot. Review which ones you actually use.` });
  const topCat = Object.entries(catSpend).sort((a,b)=>b[1]-a[1])[0];
  if (topCat) tips.push({ icon: "🔍", color: CATEGORY_COLORS[topCat[0]] || "#6366f1", title: `${topCat[0]} is biggest`, body: `You spend ${formatAmount(topCat[1])}/mo here. Could you consolidate or downgrade?` });
  if (!isOver && (budget.monthly - monthlyTotal) > 1000) tips.push({ icon: "💰", color: "#22c55e", title: "Under budget!", body: `You have ${formatAmount(budget.monthly - monthlyTotal)} left. Great job! Consider saving the difference.` });

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Budget Planner</h1>
        <p className="text-slate-500 text-sm mt-1">Set targets and monitor your subscription spend</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Left: gauge + input */}
        <div className="space-y-5">
          <div className="card p-7">
            <h2 className="font-display font-bold text-white text-lg mb-6">Monthly Budget</h2>

            {/* Gauge */}
            <div className="flex items-center gap-8 mb-7">
              <div className="relative flex-shrink-0">
                <GaugeRing pct={pct} color={color} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-display font-bold" style={{ color }}>{Math.round(pct)}%</p>
                  <p className="text-slate-500 text-xs">used</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Spent", value: formatAmount(monthlyTotal), c: isOver ? "#ef4444" : "#f1f5f9" },
                  { label: "Budget", value: formatAmount(budget.monthly), c: "#6366f1" },
                  { label: "Remaining", value: formatAmount(Math.abs(budget.monthly - monthlyTotal)), c: color },
                ].map(r => (
                  <div key={r.label}>
                    <p className="text-slate-500 text-xs uppercase tracking-wider">{r.label}</p>
                    <p className="text-lg font-display font-bold" style={{ color: r.c }}>{r.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget input */}
            <div className="space-y-3">
              <label className="label">Set Monthly Budget (₹)</label>
              <input type="number" className="input text-lg font-bold"
                value={editBudget} onChange={e => setEditBudget(e.target.value)} />
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
                className="btn-primary w-full flex items-center justify-center gap-2">
                <Save size={15} /> Save Budget
              </motion.button>
            </div>
          </div>

          {/* Smart tips */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-white text-lg mb-4">💡 Smart Tips</h2>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 p-3.5 rounded-xl border"
                  style={{ background: `${tip.color}0d`, borderColor: `${tip.color}25` }}>
                  <span className="text-xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: tip.color }}>{tip.title}</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{tip.body}</p>
                  </div>
                </motion.div>
              ))}
              {tips.length === 0 && <p className="text-slate-500 text-sm">Set category budgets to unlock tips.</p>}
            </div>
          </div>
        </div>

        {/* Right: category budgets */}
        <div className="card p-6">
          <h2 className="font-display font-bold text-white text-lg mb-1">Per-Category Limits</h2>
          <p className="text-slate-500 text-sm mb-5">Set a spending limit for each category</p>

          <div className="space-y-4">
            {Object.entries(catSpend).map(([cat, spent]) => {
              const catBgt   = catBudgets[cat] || 0;
              const catPct   = catBgt > 0 ? Math.min((spent / catBgt) * 100, 100) : 0;
              const catOver  = catBgt > 0 && spent > catBgt;
              const color    = CATEGORY_COLORS[cat] || "#6366f1";
              return (
                <div key={cat} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color }} />
                    <span className="text-slate-300 text-sm font-medium flex-1">{cat}</span>
                    <span className={`text-sm font-bold ${catOver ? "text-red-400" : "text-white"}`}>
                      {formatAmount(spent)}
                    </span>
                    <span className="text-slate-600 text-xs">/</span>
                    <input type="number" value={catBudgets[cat] || ""}
                      onChange={e => setCatBudgets(b => ({ ...b, [cat]: Number(e.target.value) }))}
                      placeholder="limit"
                      className="input w-24 py-1 px-2 text-sm text-right" />
                  </div>
                  {catBgt > 0 && (
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${catPct}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: catOver ? "#ef4444" : color }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            <Save size={15} /> Save All Budgets
          </motion.button>
        </div>
      </div>
    </div>
  );
}
