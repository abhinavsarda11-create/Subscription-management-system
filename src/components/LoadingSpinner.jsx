import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

// ── Loading skeleton ───────────────────────────────────────
export function CardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl shimmer bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded-lg shimmer bg-white/5" />
          <div className="h-3 w-20 rounded-lg shimmer bg-white/5" />
        </div>
        <div className="h-6 w-16 rounded-lg shimmer bg-white/5" />
      </div>
      <div className="h-1 w-full rounded-full shimmer bg-white/5" />
      <div className="flex gap-2">
        <div className="flex-1 h-8 rounded-xl shimmer bg-white/5" />
        <div className="flex-1 h-8 rounded-xl shimmer bg-white/5" />
        <div className="w-10 h-8 rounded-xl shimmer bg-white/5" />
      </div>
    </div>
  );
}

// ── Page loading spinner ───────────────────────────────────
export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 rounded-full border-2 border-white/10 border-t-brand-500"
      />
    </div>
  );
}

// ── Error state ────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-48 gap-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20
                      flex items-center justify-center">
        <AlertTriangle size={24} className="text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold">{message || "Something went wrong"}</p>
        <p className="text-slate-500 text-sm mt-1">Please try again</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost flex items-center gap-2 text-sm">
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </motion.div>
  );
}

// ── Empty state ────────────────────────────────────────────
export function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-5xl"
      >
        {icon}
      </motion.div>
      <div className="text-center">
        <p className="text-white font-display font-bold text-lg">{title}</p>
        {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
