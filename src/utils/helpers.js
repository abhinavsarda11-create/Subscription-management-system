import { format, differenceInDays, parseISO } from "date-fns";

export const daysUntil = (dateStr) =>
  differenceInDays(parseISO(dateStr), new Date());

export const formatDate = (dateStr) =>
  format(parseISO(dateStr), "d MMM yyyy");

export const urgency = (days) => {
  if (days < 0)  return { label: "Overdue",  color: "red",    cls: "text-red-400 bg-red-500/10 border-red-500/20" };
  if (days === 0)return { label: "Today!",   color: "red",    cls: "text-red-400 bg-red-500/10 border-red-500/20" };
  if (days <= 3) return { label: `${days}d`, color: "red",    cls: "text-red-400 bg-red-500/10 border-red-500/20" };
  if (days <= 7) return { label: `${days}d`, color: "orange", cls: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
  if (days <= 14)return { label: `${days}d`, color: "yellow", cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" };
  return          { label: `${days}d`, color: "slate",  cls: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
};

export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const CATEGORY_COLORS = {
  Entertainment: "#a78bfa",
  Music:         "#34d399",
  Shopping:      "#fb923c",
  Productivity:  "#60a5fa",
  Development:   "#f472b6",
  Design:        "#fbbf24",
  Education:     "#4ade80",
  Health:        "#f87171",
  Finance:       "#fb923c",
};

// Generate 6 months of simulated spend data
export function generateSpendHistory(monthlyTotal) {
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  return months.map((month, i) => ({
    month,
    amount: Math.round(monthlyTotal * (0.65 + i * 0.07)),
    budget: Math.round(monthlyTotal * 1.15),
  }));
}
