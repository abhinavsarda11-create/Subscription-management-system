import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, Trash2, Edit3, Calendar, Tag } from "lucide-react";
import { daysUntil, formatDate, urgency, cn } from "../utils/helpers";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SubscriptionCard({ sub, index = 0 }) {
  const { deleteSubscription, toggleSubscription, formatAmount } = useApp();
  const navigate = useNavigate();
  const days = daysUntil(sub.renewalDate);
  const urg  = urgency(days);
  const isPaused = sub.status === "paused";
  const barFill  = Math.max(4, Math.min(100, ((30 - days) / 30) * 100));

  const handleDelete = () => {
    deleteSubscription(sub.id);
    toast.success(`${sub.name} removed`);
  };

  const handleToggle = () => {
    toggleSubscription(sub.id);
    toast.success(`${sub.name} ${isPaused ? "resumed" : "paused"}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: isPaused ? 0.65 : 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card card-hover relative overflow-hidden p-5 flex flex-col gap-4"
    >
      {/* Left accent strip */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: sub.color }}
      />

      {/* Header row */}
      <div className="flex items-start gap-3 pl-2">
        <motion.div
          whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border"
          style={{ background: `${sub.color}18`, borderColor: `${sub.color}35` }}
        >
          {sub.icon}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-white text-base truncate">{sub.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="badge text-slate-400 bg-white/5 border border-white/8">
              <Tag size={10} /> {sub.category}
            </span>
            <span className={cn("badge border", isPaused
              ? "text-slate-400 bg-slate-500/10 border-slate-500/20"
              : "text-green-400 bg-green-500/10 border-green-500/20"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", isPaused ? "bg-slate-400" : "bg-green-400 animate-pulse")} />
              {isPaused ? "Paused" : "Active"}
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="font-display font-bold text-white text-lg">{formatAmount(sub.cost)}</p>
          <p className="text-slate-500 text-xs">/{sub.billing}</p>
        </div>
      </div>

      {/* Renewal bar */}
      <div className="pl-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Calendar size={11} /> Next renewal
          </span>
          <span className={cn("badge border text-xs", urg.cls)}>{urg.label}</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${barFill}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.04, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: days <= 5
                ? "linear-gradient(90deg, #ef4444, #fb923c)"
                : `linear-gradient(90deg, ${sub.color}, ${sub.color}80)`,
            }}
          />
        </div>
        <p className="text-slate-600 text-xs mt-1 font-mono">{formatDate(sub.renewalDate)}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pl-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                     bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white
                     text-xs font-medium transition-all border border-white/8"
        >
          {isPaused ? <Play size={13} /> : <Pause size={13} />}
          {isPaused ? "Resume" : "Pause"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/edit/${sub.id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                     bg-white/5 hover:bg-brand-500/20 text-slate-400 hover:text-brand-300
                     text-xs font-medium transition-all border border-white/8"
        >
          <Edit3 size={13} /> Edit
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          className="px-3 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/15
                     text-red-500 hover:text-red-400 transition-all border border-red-500/15"
        >
          <Trash2 size={13} />
        </motion.button>
      </div>
    </motion.div>
  );
}
