import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CreditCard, PlusCircle, BarChart3,
  Download, Settings, Zap, TrendingUp, Moon, Sun,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { cn } from "../utils/helpers";

const NAV = [
  { to: "/",          icon: LayoutDashboard, label: "Dashboard"     },
  { to: "/subs",      icon: CreditCard,      label: "Subscriptions" },
  { to: "/analytics", icon: BarChart3,       label: "Analytics"     },
  { to: "/budget",    icon: TrendingUp,      label: "Budget"        },
  { to: "/add",       icon: PlusCircle,      label: "Add New"       },
  { to: "/export",    icon: Download,        label: "Export"        },
  { to: "/settings",  icon: Settings,        label: "Settings"      },
];

export default function Sidebar() {
  const { isDark, toggleDark, monthlyTotal, upcomingRenewals, formatAmount } = useApp();
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40
                 border-r border-white/5 bg-surface-950/90 backdrop-blur-2xl"
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600
                          flex items-center justify-center shadow-brand">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg leading-none">SubTrack</p>
            <p className="text-slate-500 text-xs mt-0.5 font-mono">Pro v2.0</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mx-4 mt-4 p-4 rounded-xl bg-brand-600/10 border border-brand-500/15">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Monthly Spend</p>
        <p className="text-2xl font-display font-bold text-white">{formatAmount(monthlyTotal)}</p>
        {upcomingRenewals.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs text-red-400 font-medium">
              {upcomingRenewals.length} renewal{upcomingRenewals.length > 1 ? "s" : ""} soon
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className={cn("nav-link", isActive && "nav-link-active")}
              >
                <Icon size={17} />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          type="button"
          onClick={toggleDark}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                     bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white
                     transition-all duration-200 text-sm font-medium"
        >
          <motion.div
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.div>
          {isDark ? "Switch to Light" : "Switch to Dark"}
        </button>
      </div>
    </motion.aside>
  );
}
