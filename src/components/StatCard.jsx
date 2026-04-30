import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, sub, accent, trend, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="stat-card group"
      style={{ "--accent": accent }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ background: accent }}
      />

      <div className="relative">
        {/* Icon + trend */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
          >
            {typeof Icon === "string" ? Icon : <Icon size={18} style={{ color: accent }} />}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? "text-red-400" : "text-green-400"}`}>
              {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Label */}
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>

        {/* Value */}
        <p className="text-3xl font-display font-bold text-white tracking-tight">{value}</p>

        {/* Sub-label */}
        {sub && <p className="text-xs mt-1.5 font-medium" style={{ color: accent }}>{sub}</p>}
      </div>
    </motion.div>
  );
}
