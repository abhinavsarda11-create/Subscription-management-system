import { motion } from "framer-motion";
import { Pause, Play, Trash2, Edit3, Calendar, Zap } from "lucide-react";
import { daysUntil, formatDate, urgency } from "../utils/helpers";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Urgency config with premium colors
const URG_STYLE = {
  red:    { bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.3)",   text: "#fb7185",  glow: "rgba(244,63,94,0.4)"   },
  orange: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  text: "#fbbf24",  glow: "rgba(245,158,11,0.4)"  },
  yellow: { bg: "rgba(234,179,8,0.10)",   border: "rgba(234,179,8,0.25)",  text: "#facc15",  glow: "rgba(234,179,8,0.3)"   },
  slate:  { bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)", text: "#64748b",  glow: "none"                  },
};

export default function SubscriptionCard({ sub, index = 0 }) {
  const { deleteSubscription, toggleSubscription, formatAmount } = useApp();
  const navigate = useNavigate();

  const days     = daysUntil(sub.renewalDate);
  const urg      = urgency(days);
  const urgStyle = URG_STYLE[urg.color] || URG_STYLE.slate;
  const isPaused = sub.status === "paused";
  const barFill  = Math.max(4, Math.min(100, ((30 - days) / 30) * 100));

  const handleDelete = () => { deleteSubscription(sub.id); toast.success(`${sub.name} removed`); };
  const handleToggle = () => { toggleSubscription(sub.id); toast.success(`${sub.name} ${isPaused ? "resumed ▶" : "paused ⏸"}`); };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: isPaused ? 0.55 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93, y: -8 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -6,
        scale: 1.015,
        transition: { duration: 0.2 },
      }}
      className="relative overflow-hidden flex flex-col rounded-2xl"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${sub.color}30`,
        boxShadow: `0 20px 60px -16px ${sub.color}25, 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.07) inset`,
        padding: "16px",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 28px 72px -12px ${sub.color}40, 0 0 0 1px ${sub.color}25 inset`;
        e.currentTarget.style.borderColor = `${sub.color}50`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = `0 20px 60px -16px ${sub.color}25, 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.07) inset`;
        e.currentTarget.style.borderColor = `${sub.color}30`;
      }}
    >
      {/* Top gradient stripe in brand color */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${sub.color}, ${sub.color}88, transparent)` }}
      />

      {/* Background 3D orb */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${sub.color}30, ${sub.color}05)`,
          filter: "blur(8px)",
        }}
      />

      {/* Vertical left accent with glow */}
      <div
        className="absolute top-3 left-0 bottom-3 w-[3px] rounded-r-full"
        style={{
          background: `linear-gradient(180deg, ${sub.color}, ${sub.color}66)`,
          boxShadow: `0 0 12px ${sub.color}70`,
        }}
      />

      <div className="pl-3 flex flex-col gap-3 relative z-10">

        {/* ── Top row: icon + name + cost ── */}
        <div className="flex items-start gap-3">
          {/* 3D icon sphere */}
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${sub.color}40, ${sub.color}15)`,
              border: `1px solid ${sub.color}40`,
              boxShadow: `0 6px 16px ${sub.color}30, 0 1px 0 rgba(255,255,255,0.15) inset`,
            }}
          >
            {sub.icon}
          </motion.div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: "var(--text-1)" }}>
              {sub.name}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {/* Category */}
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{
                  background: `${sub.color}12`,
                  border: `1px solid ${sub.color}25`,
                  color: sub.color,
                }}
              >
                {sub.category}
              </span>
              {/* Status */}
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={isPaused
                  ? { background: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.2)", color: "#64748b" }
                  : { background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.25)", color: "#2dd4bf" }
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: isPaused ? "#64748b" : "#14b8a6",
                    boxShadow: isPaused ? "none" : "0 0 6px rgba(20,184,166,0.8)",
                    animation: isPaused ? "none" : "pulseDot 1.8s ease infinite",
                  }}
                />
                {isPaused ? "Paused" : "Active"}
              </span>
            </div>
          </div>

          {/* Cost */}
          <div className="text-right flex-shrink-0">
            <p
              className="text-base font-bold"
              style={{
                color: "var(--text-1)",
                fontFamily: "'JetBrains Mono',monospace",
                letterSpacing: "-0.04em",
                textShadow: `0 0 16px ${sub.color}40`,
              }}
            >
              {formatAmount(sub.cost)}
            </p>
            <p className="text-[10px]" style={{ color: "var(--text-3)" }}>/{sub.billing}</p>
          </div>
        </div>

        {/* ── Renewal section ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-3)" }}>
              <Calendar size={10} />
              {formatDate(sub.renewalDate)}
            </span>
            {/* Urgency badge with glow */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{
                background: urgStyle.bg,
                border: `1px solid ${urgStyle.border}`,
                color: urgStyle.text,
                boxShadow: urgStyle.glow !== "none" ? `0 0 10px ${urgStyle.glow}` : "none",
                textShadow: urgStyle.glow !== "none" ? `0 0 8px ${urgStyle.text}` : "none",
              }}
            >
              {urg.label}
            </span>
          </div>

          {/* Progress bar with gradient */}
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "var(--bg-raised)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${barFill}%` }}
              transition={{ duration: 0.8, delay: 0.15 + index * 0.04, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: days <= 5
                  ? "linear-gradient(90deg, #f43f5e, #fb923c)"
                  : `linear-gradient(90deg, ${sub.color}, ${sub.color}aa)`,
                boxShadow: `0 0 6px ${days <= 5 ? "rgba(244,63,94,0.6)" : sub.color + "80"}`,
              }}
            />
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.93 }}
            onClick={handleToggle}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              color: "var(--text-2)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${sub.color}40`; e.currentTarget.style.color = sub.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
          >
            {isPaused ? <Play size={11} /> : <Pause size={11} />}
            {isPaused ? "Resume" : "Pause"}
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.93 }}
            onClick={() => navigate(`/edit/${sub.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              color: "var(--text-2)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)"; e.currentTarget.style.color = "var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
          >
            <Edit3 size={11} /> Edit
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.93 }}
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all"
            style={{
              background: "rgba(244,63,94,0.06)",
              border: "1px solid rgba(244,63,94,0.18)",
              color: "#fb7185",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,63,94,0.15)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(244,63,94,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(244,63,94,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <Trash2 size={11} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
