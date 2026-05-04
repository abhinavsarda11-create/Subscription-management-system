import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3.5 w-28 rounded" />
          <div className="skeleton h-2.5 w-16 rounded" />
        </div>
        <div className="skeleton h-5 w-14 rounded" />
      </div>
      <div className="skeleton h-1 w-full rounded-full" />
      <div className="flex gap-2">
        <div className="skeleton flex-1 h-8 rounded-lg" />
        <div className="skeleton flex-1 h-8 rounded-lg" />
        <div className="skeleton w-9 h-8 rounded-lg" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 rounded-full border-2 border-t-indigo-500"
        style={{ borderColor: "var(--border)", borderTopColor: "#6366f1" }}
      />
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-48 gap-4"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <AlertTriangle size={20} className="text-red-400" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>
          {message || "Something went wrong"}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Please try again</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost text-xs gap-1.5">
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </motion.div>
  );
}

export function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl"
      >
        {icon}
      </motion.div>
      <div className="text-center">
        <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{title}</p>
        {description && (
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
