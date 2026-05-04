import { motion } from "framer-motion";

// Each card gets a unique visual treatment
const CARD_THEMES = {
  indigo: {
    orb:    "orb-indigo",
    glow:   "rgba(99,102,241,0.3)",
    stripe: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
    border: "rgba(99,102,241,0.2)",
    top:    "linear-gradient(90deg, #6366f1, #8b5cf6, transparent)",
  },
  gold: {
    orb:    "orb-gold",
    glow:   "rgba(245,158,11,0.35)",
    stripe: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(253,211,77,0.08))",
    border: "rgba(245,158,11,0.25)",
    top:    "linear-gradient(90deg, #f59e0b, #fcd34d, transparent)",
  },
  rose: {
    orb:    "orb-rose",
    glow:   "rgba(244,63,94,0.3)",
    stripe: "linear-gradient(135deg, rgba(244,63,94,0.18), rgba(251,113,133,0.08))",
    border: "rgba(244,63,94,0.2)",
    top:    "linear-gradient(90deg, #f43f5e, #fb7185, transparent)",
  },
  teal: {
    orb:    "orb-teal",
    glow:   "rgba(20,184,166,0.3)",
    stripe: "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(45,212,191,0.08))",
    border: "rgba(20,184,166,0.2)",
    top:    "linear-gradient(90deg, #14b8a6, #2dd4bf, transparent)",
  },
};

export default function StatCard({ icon: Icon, label, value, sub, accent = "#6366f1", theme = "indigo", index = 0 }) {
  const t = CARD_THEMES[theme] || CARD_THEMES.indigo;

  return (
    <motion.div
      className="stat-card group"
      initial={{ opacity: 0, y: 20, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: t.stripe,
        border: `1px solid ${t.border}`,
        boxShadow: `0 24px 64px -16px ${t.glow}, 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.08) inset`,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        y: -7,
        rotateX: 3,
        scale: 1.02,
        boxShadow: `0 32px 80px -12px ${t.glow}, 0 0 0 1px rgba(255,255,255,0.06) inset`,
        transition: { duration: 0.2 },
      }}
    >
      {/* Top color stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: t.top }}
      />

      {/* Floating 3D orb (background decoration) */}
      <div
        className={`orb ${t.orb} absolute -right-4 -top-4 w-20 h-20 opacity-30 group-hover:opacity-50 animate-float`}
        style={{ transition: "opacity 0.3s", animationDelay: `${index * 0.5}s` }}
      />

      {/* Secondary small orb */}
      <div
        className={`orb ${t.orb} absolute right-8 bottom-3 w-8 h-8 opacity-15 animate-float-slow`}
        style={{ animationDelay: `${index * 0.3 + 2}s` }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}35`,
            boxShadow: `0 4px 12px ${accent}25, 0 1px 0 rgba(255,255,255,0.1) inset`,
          }}
        >
          {typeof Icon === "string"
            ? <span className="text-lg leading-none">{Icon}</span>
            : <Icon size={16} style={{ color: accent }} />
          }
        </div>

        {/* Label */}
        <p className="label mb-1">{label}</p>

        {/* Value */}
        <p
          className="text-2xl font-bold tracking-tight mb-1.5"
          style={{
            color: "var(--text-1)",
            fontFamily: "'Clash Display','Syne',sans-serif",
            textShadow: `0 0 20px ${accent}30`,
          }}
        >
          {value}
        </p>

        {/* Sub label */}
        {sub && (
          <p
            className="text-[11.5px] font-semibold"
            style={{ color: accent, filter: `drop-shadow(0 0 6px ${accent}60)` }}
          >
            {sub}
          </p>
        )}
      </div>

      {/* Bottom reflection line */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px opacity-20"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
    </motion.div>
  );
}
