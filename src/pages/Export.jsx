import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/helpers";
import { Download, Copy, Printer, FileJson, FileSpreadsheet, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function ExportBtn({ icon: Icon, label, desc, color, onClick }) {
  return (
    <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-4 p-5 rounded-xl border text-left w-full transition-all"
      style={{ background: `${color}08`, borderColor: `${color}25` }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border"
        style={{ background: `${color}18`, borderColor: `${color}35` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-white font-semibold text-sm">{label}</p>
        <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
      </div>
      <Download size={16} style={{ color }} />
    </motion.button>
  );
}

export default function Export() {
  const { subscriptions, monthlyTotal, formatAmount } = useApp();
  const [copied, setCopied] = useState(false);

  const dl = (content, name, type) => {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = "Name,Category,Cost,Billing,Renewal Date,Status,Description";
    const rows   = subscriptions.map(s =>
      [s.name, s.category, s.cost, s.billing, s.renewalDate, s.status, s.description || ""].join(",")
    );
    dl([header, ...rows].join("\n"), "subtrack-pro.csv", "text/csv");
    toast.success("CSV downloaded!");
  };

  const exportJSON = () => {
    dl(JSON.stringify({ exportedAt: new Date().toISOString(), monthlyTotal, subscriptions }, null, 2),
      "subtrack-pro.json", "application/json");
    toast.success("JSON downloaded!");
  };

  const copySummary = async () => {
    const text = [
      "=== SubTrack Pro Export ===",
      `Date: ${new Date().toLocaleDateString("en-IN")}`,
      `Monthly: ${formatAmount(monthlyTotal)}`,
      "",
      ...subscriptions.map(s => `${s.icon} ${s.name} — ${formatAmount(s.cost)}/mo — ${s.status}`),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const printView = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>SubTrack Pro</title>
    <style>body{font-family:monospace;padding:24px}table{width:100%;border-collapse:collapse}
    th,td{padding:8px;border:1px solid #ddd;font-size:12px}th{background:#f5f5f5}
    h1{margin-bottom:4px}p{color:#666;font-size:12px;margin-bottom:16px}</style></head>
    <body><h1>SubTrack Pro — Export</h1>
    <p>Generated: ${new Date().toLocaleString("en-IN")} | Monthly: ₹${monthlyTotal.toLocaleString("en-IN")}</p>
    <table><thead><tr><th>Service</th><th>Category</th><th>Cost/mo</th><th>Renewal</th><th>Status</th></tr></thead>
    <tbody>${subscriptions.map(s => `<tr><td>${s.icon} ${s.name}</td><td>${s.category}</td>
    <td>₹${Number(s.cost).toLocaleString("en-IN")}</td>
    <td>${formatDate(s.renewalDate)}</td><td>${s.status}</td></tr>`).join("")}</tbody></table>
    </body></html>`);
    w.document.close(); w.print();
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Export Data</h1>
        <p className="text-slate-500 text-sm mt-1">Download or share your subscription data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExportBtn icon={FileSpreadsheet} label="Export as CSV" desc="Open in Excel or Google Sheets" color="#22c55e" onClick={exportCSV} />
        <ExportBtn icon={FileJson} label="Export as JSON" desc="Structured data for developers" color="#60a5fa" onClick={exportJSON} />
        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
          onClick={copySummary}
          className="flex items-center gap-4 p-5 rounded-xl border text-left w-full transition-all"
          style={{ background: "#a78bfa08", borderColor: "#a78bfa25" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
            style={{ background: "#a78bfa18", borderColor: "#a78bfa35" }}>
            {copied ? <Check size={22} color="#22c55e" /> : <Copy size={22} color="#a78bfa" />}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{copied ? "Copied!" : "Copy Summary"}</p>
            <p className="text-slate-500 text-xs mt-0.5">Plain text to clipboard</p>
          </div>
        </motion.button>
        <ExportBtn icon={Printer} label="Print / Save PDF" desc="Opens print dialog" color="#fb923c" onClick={printView} />
      </div>

      {/* Preview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-white text-lg">Preview</h2>
          <span className="text-slate-500 text-sm">{subscriptions.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Service","Category","Cost/mo","Renewal","Status"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscriptions.map(s => (
                <tr key={s.id} className="hover:bg-white/3 transition-colors">
                  <td className="py-3 pr-4 text-white font-medium">{s.icon} {s.name}</td>
                  <td className="py-3 pr-4 text-slate-400">{s.category}</td>
                  <td className="py-3 pr-4 text-white font-mono font-semibold">{formatAmount(s.cost)}</td>
                  <td className="py-3 pr-4 text-slate-400 font-mono text-xs">{formatDate(s.renewalDate)}</td>
                  <td className="py-3">
                    <span className={`badge border text-xs ${s.status === "active" ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-slate-400 bg-slate-500/10 border-slate-500/20"}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
