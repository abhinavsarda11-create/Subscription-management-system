import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, PlusCircle, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useSubscriptionFilters } from "../hooks/useSubscriptionFilters";
import SubscriptionCard from "../components/SubscriptionCard";
import { EmptyState, CardSkeleton } from "../components/LoadingSpinner";
import { CATEGORIES } from "../data/subscriptions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Subscriptions() {
  const { subscriptions } = useApp();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const {
    filtered, search, setSearch,
    category, setCategory,
    status, setStatus,
    sortBy, setSortBy,
    hasFilters, reset,
  } = useSubscriptionFilters(subscriptions);

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Subscriptions</h1>
          <p className="text-slate-500 text-sm mt-1">{subscriptions.length} total · {subscriptions.filter(s => s.status === "active").length} active</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/add")} className="btn-primary flex items-center gap-2">
          <PlusCircle size={16} /> Add New
        </motion.button>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-10"
            placeholder="Search subscriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(v => !v)}
          className={`btn-ghost flex items-center gap-2 ${showFilters ? "bg-brand-500/20 text-brand-300 border-brand-500/30" : ""}`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-brand-400" />}
        </motion.button>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input w-auto px-4">
          <option value="renewal">Sort: Renewal</option>
          <option value="cost-high">Sort: Cost ↓</option>
          <option value="cost-low">Sort: Cost ↑</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="card p-5 space-y-4">
              {/* Categories */}
              <div>
                <p className="label">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`badge border transition-all ${
                        category === cat.id
                          ? "bg-brand-500/20 text-brand-300 border-brand-500/30"
                          : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Status */}
              <div>
                <p className="label">Status</p>
                <div className="flex gap-2">
                  {["all", "active", "paused"].map(s => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`badge border capitalize transition-all ${
                        status === s
                          ? "bg-brand-500/20 text-brand-300 border-brand-500/30"
                          : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {hasFilters && (
                <button onClick={reset} className="text-slate-500 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
                  <X size={13} /> Reset all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm">
          Showing <strong className="text-white">{filtered.length}</strong> of {subscriptions.length}
        </p>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No subscriptions found"
          description="Try adjusting your search or filters"
          action={
            hasFilters
              ? <button onClick={reset} className="btn-ghost text-sm">Clear filters</button>
              : <button onClick={() => navigate("/add")} className="btn-primary text-sm flex items-center gap-2"><PlusCircle size={14} /> Add your first subscription</button>
          }
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((sub, i) => (
              <SubscriptionCard key={sub.id} sub={sub} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
