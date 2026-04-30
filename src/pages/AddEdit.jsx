import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/subscriptions";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const ICONS = ["📱","🎬","🎵","📦","🎨","▶️","📝","💻","📺","🎮","☁️","🔐","🖌️","🦉","🎙️","🛡️","🌐","📊"];

const EMPTY = {
  name: "", category: "Entertainment", cost: "", billing: "monthly",
  icon: "📱", color: "#6366f1", renewalDate: "", status: "active", description: "",
};

export default function AddEdit() {
  const { id }    = useParams();
  const isEdit    = !!id;
  const navigate  = useNavigate();
  const { subscriptions, addSubscription, updateSubscription } = useApp();

  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);

  // Pre-fill for edit mode
  useEffect(() => {
    if (isEdit) {
      const found = subscriptions.find(s => s.id === Number(id));
      if (found) setForm(found);
      else navigate("/subs");
    } else {
      setForm(EMPTY);
    }
  }, [id, isEdit]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Service name is required";
    if (!form.cost || Number(form.cost) <= 0) e.cost = "Enter a valid cost";
    if (!form.renewalDate) e.renewalDate = "Renewal date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400)); // simulate async
    const data = { ...form, cost: Number(form.cost) };
    if (isEdit) { updateSubscription(data); toast.success(`${form.name} updated!`); }
    else        { addSubscription(data);    toast.success(`${form.name} added!`); }
    setSaving(false);
    navigate("/subs");
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Back button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </motion.button>

      <div className="card p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30
                          flex items-center justify-center">
            <Sparkles size={22} className="text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {isEdit ? "Edit Subscription" : "Add Subscription"}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {isEdit ? "Update the details below" : "Fill in the details to track a new service"}
            </p>
          </div>
        </div>

        {/* Icon picker */}
        <div className="mb-6">
          <label className="label">Choose Icon</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(emoji => (
              <motion.button
                key={emoji} whileTap={{ scale: 0.85 }}
                onClick={() => set("icon", emoji)}
                className={`w-11 h-11 rounded-xl text-xl transition-all duration-150 ${
                  form.icon === emoji
                    ? "bg-brand-500/25 border-2 border-brand-500 scale-110"
                    : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                }`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Live preview */}
        <motion.div
          className="mb-6 p-4 rounded-xl border border-white/8 bg-white/3 flex items-center gap-4"
          layout
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border"
            style={{ background: `${form.color}20`, borderColor: `${form.color}40` }}>
            {form.icon}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{form.name || "Service Name"}</p>
            <p className="text-slate-500 text-sm">{form.category} · {form.cost ? `₹${Number(form.cost).toLocaleString("en-IN")}/mo` : "₹0/mo"}</p>
          </div>
          <div className="ml-auto">
            <div className="w-3 h-3 rounded-full" style={{ background: form.color }} />
          </div>
        </motion.div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="label">Service Name *</label>
            <input className={`input ${errors.name ? "border-red-500/60 focus:border-red-500" : ""}`}
              placeholder="e.g. Netflix, Spotify..."
              value={form.name} onChange={e => set("name", e.target.value)} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Cost */}
          <div>
            <label className="label">Monthly Cost (₹) *</label>
            <input type="number" min="0" className={`input ${errors.cost ? "border-red-500/60" : ""}`}
              placeholder="649" value={form.cost} onChange={e => set("cost", e.target.value)} />
            {errors.cost && <p className="text-red-400 text-xs mt-1">{errors.cost}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.filter(c => c.id !== "all").map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Renewal Date */}
          <div>
            <label className="label">Renewal Date *</label>
            <input type="date" className={`input ${errors.renewalDate ? "border-red-500/60" : ""}`}
              value={form.renewalDate} onChange={e => set("renewalDate", e.target.value)} />
            {errors.renewalDate && <p className="text-red-400 text-xs mt-1">{errors.renewalDate}</p>}
          </div>

          {/* Color */}
          <div>
            <label className="label">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.color} onChange={e => set("color", e.target.value)}
                className="w-12 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
              <span className="text-slate-500 text-sm font-mono">{form.color}</span>
            </div>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="label">Description (optional)</label>
            <input className="input" placeholder="What is this for?"
              value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button onClick={() => navigate(-1)} className="btn-ghost flex-1">Cancel</button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary flex-[2] flex items-center justify-center gap-2"
          >
            {saving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <><Save size={16} /> {isEdit ? "Save Changes" : "Add Subscription"}</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
