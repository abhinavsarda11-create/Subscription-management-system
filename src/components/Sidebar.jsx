import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CreditCard, BarChart3, TrendingUp,
  PlusCircle, Download, Settings, Zap, Sun, Moon, Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV = [
  { group: "Overview", items: [
    { to: "/",          icon: LayoutDashboard, label: "Dashboard",      color: "#818cf8" },
    { to: "/subs",      icon: CreditCard,      label: "Subscriptions",  color: "#a78bfa" },
    { to: "/analytics", icon: BarChart3,       label: "Analytics",      color: "#2dd4bf" },
    { to: "/budget",    icon: TrendingUp,      label: "Budget",         color: "#f59e0b" },
  ]},
  { group: "Tools", items: [
    { to: "/add",      icon: PlusCircle, label: "Add New",   color: "#fb7185" },
    { to: "/export",   icon: Download,   label: "Export",    color: "#34d399" },
    { to: "/settings", icon: Settings,   label: "Settings",  color: "#94a3b8" },
  ]},
];

export default function Sidebar() {
  const { isDark, toggleDark, monthlyTotal, upcomingRenewals, formatAmount, activeSubs } = useApp();
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-screen w-[224px] flex flex-col z-40 overflow-hidden"
      style={{
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        boxShadow: "4px 0 32px rgba(0,0,0,0.15)",
      }}
    >
      {/* Decorative background orb */}
      <div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(245,158,11,0.06), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 60%, rgba(99,102,241,0.08), transparent 70%)",
        }}
      />

      {/* ── Logo ── */}
      <div className="relative px-5 pt-6 pb-5"
        style={{ borderBottom: "1px solid var(--border-sub)" }}>
        <div className="flex items-center gap-3">
          {/* 3D logo orb */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4338ca 100%)",
                boxShadow: "0 4px 16px rgba(99,102,241,0.5), 0 1px 0 rgba(255,255,255,0.25) inset",
              }}
            >
              <Zap size={15} className="text-white" />
            </div>
            {/* Gold accent dot */}
            <div
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
              style={{
                background: "radial-gradient(circle at 35% 35%, #fde68a, #f59e0b)",
                boxShadow: "0 0 6px rgba(245,158,11,0.8)",
              }}
            />
          </div>

          <div>
            <p className="font-bold text-base leading-none" style={{ color: "var(--text-1)", fontFamily: "'Clash Display','Syne',sans-serif" }}>
              SubTrack
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles size={9} style={{ color: "var(--gold)" }} />
              <span className="text-[10px] font-bold gold-text">PRO</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Monthly spend card ── */}
      <div className="mx-3 mt-4 mb-1 p-4 rounded-2xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(99,102,241,0.08) 100%)",
          border: "1px solid var(--border-gold)",
          boxShadow: "0 4px 24px rgba(245,158,11,0.08), 0 1px 0 rgba(255,255,255,0.06) inset",
        }}
      >
        {/* Background shine */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(253,211,77,0.4), transparent)" }} />

        {/* Small 3D sphere decoration */}
        <div className="absolute right-3 top-3 w-10 h-10 orb orb-gold opacity-40 animate-float"
          style={{ filter: "blur(2px)" }} />

        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
          style={{ color: "rgba(245,158,11,0.7)" }}>
          Monthly Spend
        </p>
        <p className="text-xl font-bold leading-none gold-text"
          style={{ fontFamily: "'Clash Display','Syne',sans-serif" }}>
          {formatAmount(monthlyTotal)}
        </p>
        <p className="text-[11px] mt-1.5" style={{ color: "var(--text-3)" }}>
          {activeSubs.length} active services
        </p>

        {upcomingRenewals.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 pt-2.5"
            style={{ borderTop: "1px solid var(--border-gold)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 pulse-dot flex-shrink-0" />
            <span className="text-[11px] font-semibold text-rose-400">
              {upcomingRenewals.length} renewal{upcomingRenewals.length > 1 ? "s" : ""} soon
            </span>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-4">
        {NAV.map(group => (
          <div key={group.group}>
            <p className="px-2 mb-2 text-[9px] font-black uppercase tracking-[0.15em]"
              style={{ color: "var(--text-3)" }}>
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, icon: Icon, label, color }) => {
                const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
                return (
                  <NavLink key={to} to={to} className="block">
                    <motion.div
                      whileTap={{ scale: 0.96 }}
                      className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                    >
                      {/* Colored icon wrapper */}
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isActive ? `${color}25` : "var(--bg-raised)",
                          border: `1px solid ${isActive ? color + "40" : "var(--border-sub)"}`,
                          boxShadow: isActive ? `0 0 8px ${color}30` : "none",
                          transition: "all 0.15s",
                        }}
                      >
                        <Icon size={12} style={{ color: isActive ? color : "var(--text-3)" }} />
                      </div>

                      <span className="flex-1 text-[13px]">{label}</span>

                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-dot"
                          className="w-1 h-4 rounded-full flex-shrink-0"
                          style={{ background: `linear-gradient(180deg, ${color}, ${color}66)`, boxShadow: `0 0 8px ${color}` }}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                    </motion.div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Gold divider ── */}
      <div className="mx-4 gold-line" />

      {/* ── Theme toggle ── */}
      <div className="p-3 pb-4">
        <motion.button
          type="button"
          onClick={toggleDark}
          whileTap={{ scale: 0.96 }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            color: "var(--text-2)",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
        >
          <motion.div animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.35, type: "spring" }}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </motion.div>
          <span className="text-[12.5px]">{isDark ? "Light mode" : "Dark mode"}</span>
          {/* Tiny toggle pill */}
          <div className="ml-auto relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0"
            style={{ background: isDark ? "rgba(99,102,241,0.4)" : "rgba(245,158,11,0.3)", border: "1px solid var(--border)" }}>
            <motion.div
              animate={{ x: isDark ? 16 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
            />
          </div>
        </motion.button>
      </div>
    </motion.aside>
  );
}
