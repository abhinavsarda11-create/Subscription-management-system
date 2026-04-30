import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { Sun, Moon, RefreshCw, Globe, Database, Trash2 } from "lucide-react";
import { SEED_SUBSCRIPTIONS } from "../data/subscriptions";
import toast from "react-hot-toast";

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
];

function SettingSection({ title, children }) {
  return (
    <div className="card p-6 space-y-4">
      <h2 className="font-display font-bold text-white text-lg">{title}</h2>
      {children}
    </div>
  );
}

export default function Settings() {
  const {
    isDark, toggleDark,
    currency, setCurrency,
    rates, ratesLoading, ratesError,
    subscriptions, addSubscription, deleteSubscription,
  } = useApp();

  const resetData = () => {
    if (!confirm("Reset all data to defaults? This cannot be undone.")) return;
    subscriptions.forEach(s => deleteSubscription(s.id));
    setTimeout(() => { SEED_SUBSCRIPTIONS.forEach(s => addSubscription(s)); }, 50);
    toast.success("Data reset to defaults!");
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Customize your SubTrack experience</p>
      </div>

      {/* Appearance */}
      <SettingSection title="🎨 Appearance">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/8">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isDark ? 0 : 180, scale: [1, 1.2, 1] }}
              transition={{ duration: 0.35 }}
            >
              {isDark
                ? <Moon size={18} className="text-brand-400" />
                : <Sun size={18} className="text-yellow-400" />
              }
            </motion.div>
            <div>
              <p className="text-white text-sm font-medium">
                {isDark ? "Dark Mode" : "Light Mode"}
              </p>
              <p className="text-slate-500 text-xs">
                Currently using {isDark ? "dark" : "light"} theme — click to switch
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
              isDark ? "bg-brand-600" : "bg-slate-300"
            }`}
          >
            <motion.div
              animate={{ x: isDark ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
            />
          </button>
        </div>

        {/* Theme preview chips */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            type="button"
            onClick={() => !isDark || toggleDark()}
            className={`p-3 rounded-xl border text-left transition-all ${
              isDark
                ? "border-brand-500/40 bg-brand-500/10 ring-2 ring-brand-500/30"
                : "border-white/8 bg-white/3 hover:bg-white/6"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-surface-950 border border-white/20" />
              <span className="text-xs font-semibold text-white">Dark</span>
              {isDark && <span className="ml-auto text-xs text-brand-400 font-bold">✓ Active</span>}
            </div>
            <div className="flex gap-1">
              <div className="h-1.5 flex-1 rounded-full bg-surface-900" />
              <div className="h-1.5 flex-[2] rounded-full bg-brand-600/60" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => isDark && toggleDark()}
            className={`p-3 rounded-xl border text-left transition-all ${
              !isDark
                ? "border-brand-500/40 bg-brand-500/10 ring-2 ring-brand-500/30"
                : "border-white/8 bg-white/3 hover:bg-white/6"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300" />
              <span className="text-xs font-semibold text-white">Light</span>
              {!isDark && <span className="ml-auto text-xs text-brand-400 font-bold">✓ Active</span>}
            </div>
            <div className="flex gap-1">
              <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
              <div className="h-1.5 flex-[2] rounded-full bg-brand-400/60" />
            </div>
          </button>
        </div>
      </SettingSection>

      {/* Currency (API integration) */}
      <SettingSection title="💱 Currency">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={14} className="text-slate-500" />
          <p className="text-slate-400 text-sm">
            {ratesLoading ? "Loading exchange rates..." : ratesError ? ratesError : "Live rates from ExchangeRate API"}
          </p>
          {ratesLoading && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <RefreshCw size={13} className="text-slate-500" />
            </motion.div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CURRENCIES.map(c => (
            <button key={c.code} onClick={() => setCurrency(c.code)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                currency === c.code
                  ? "bg-brand-500/15 border-brand-500/35 text-brand-300"
                  : "bg-white/3 border-white/8 text-slate-400 hover:bg-white/6"
              }`}>
              <span className="text-xl font-bold">{c.symbol}</span>
              <div>
                <p className="text-sm font-semibold">{c.code}</p>
                <p className="text-xs opacity-70">{c.label}</p>
              </div>
              {rates && currency !== "INR" && c.code !== "INR" && rates[c.code] && (
                <span className="ml-auto text-xs font-mono opacity-60">
                  {(rates[c.code]).toFixed(4)}
                </span>
              )}
            </button>
          ))}
        </div>
      </SettingSection>

      {/* Data management */}
      <SettingSection title="🗄️ Data">
        <div className="p-4 rounded-xl bg-white/3 border border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-slate-400" />
            <div>
              <p className="text-white text-sm font-medium">LocalStorage</p>
              <p className="text-slate-500 text-xs">{subscriptions.length} subscriptions stored locally</p>
            </div>
          </div>
          <span className="badge bg-green-500/10 text-green-400 border border-green-500/20">Active</span>
        </div>

        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 size={18} className="text-red-400" />
            <div>
              <p className="text-red-300 text-sm font-medium">Reset to Defaults</p>
              <p className="text-slate-500 text-xs">Restore original sample data</p>
            </div>
          </div>
          <button onClick={resetData} className="btn-danger text-xs">Reset</button>
        </div>
      </SettingSection>

      {/* About */}
      <SettingSection title="ℹ️ About">
        <div className="space-y-2 text-sm text-slate-400">
          <p>SubTrack Pro v2.0 — Built with React 18 + Vite 5</p>
          <p>Libraries: React Router, Framer Motion, Recharts, react-hot-toast, Tailwind CSS, date-fns, Lucide React</p>
          <p className="text-slate-600">A major student project demonstrating: Context API, Custom Hooks, React Router, API Integration, LocalStorage, Framer Motion animations, and Recharts data visualization.</p>
        </div>
      </SettingSection>
    </div>
  );
}
