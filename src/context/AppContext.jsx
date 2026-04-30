/**
 * AppContext.jsx — Global State Management via Context API
 *
 * Provides to the entire app:
 *   - subscriptions (CRUD)
 *   - dark mode toggle
 *   - currency (exchange rates from API)
 *   - localStorage persistence
 *   - budget settings
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SEED_SUBSCRIPTIONS } from "../data/subscriptions";

// ── Create the context ─────────────────────────────────────
const AppContext = createContext(null);

// ── Helper: LocalStorage ───────────────────────────────────
const LS_KEY  = "subtrack_pro_v2";
const BUD_KEY = "subtrack_budget_v2";
const THEME_KEY = "subtrack_theme";

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

// ── Provider Component ─────────────────────────────────────
export function AppProvider({ children }) {

  // ── Subscriptions state (persisted) ──────────────
  const [subscriptions, setSubscriptions] = useState(() =>
    loadFromStorage(LS_KEY, SEED_SUBSCRIPTIONS)
  );

  // ── Dark mode (persisted) ─────────────────────────
  const [isDark, setIsDark] = useState(() =>
    loadFromStorage(THEME_KEY, true)
  );

  // ── Budget (persisted) ────────────────────────────
  const [budget, setBudget] = useState(() =>
    loadFromStorage(BUD_KEY, { monthly: 10000, categories: {} })
  );

  // ── Exchange rates (from API) ─────────────────────
  const [rates, setRates]           = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError]   = useState(null);
  const [currency, setCurrency]       = useState("INR");

  // ── Persist subscriptions whenever they change ────
  useEffect(() => {
    saveToStorage(LS_KEY, subscriptions);
  }, [subscriptions]);

  // ── Persist budget ────────────────────────────────
  useEffect(() => {
    saveToStorage(BUD_KEY, budget);
  }, [budget]);

  // ── Dark mode class on <html> ─────────────────────
  useEffect(() => {
    saveToStorage(THEME_KEY, isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // ── Fetch exchange rates from API (useEffect + API) ─
  useEffect(() => {
    const controller = new AbortController();
    async function fetchRates() {
      try {
        setRatesLoading(true);
        setRatesError(null);
        const res  = await fetch(
          "https://api.exchangerate-api.com/v4/latest/INR",
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        setRates(data.rates);
      } catch (err) {
        if (err.name !== "AbortError") {
          setRatesError("Could not load exchange rates.");
          // Fallback rates
          setRates({ INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 });
        }
      } finally {
        setRatesLoading(false);
      }
    }
    fetchRates();
    return () => controller.abort();
  }, []);

  // ── CRUD: Add ─────────────────────────────────────
  const addSubscription = useCallback((sub) => {
    setSubscriptions(prev => [{ ...sub, id: Date.now() }, ...prev]);
  }, []);

  // ── CRUD: Update ──────────────────────────────────
  const updateSubscription = useCallback((updated) => {
    setSubscriptions(prev =>
      prev.map(s => s.id === updated.id ? updated : s)
    );
  }, []);

  // ── CRUD: Delete ──────────────────────────────────
  const deleteSubscription = useCallback((id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  }, []);

  // ── CRUD: Toggle pause/resume ─────────────────────
  const toggleSubscription = useCallback((id) => {
    setSubscriptions(prev =>
      prev.map(s => s.id === id
        ? { ...s, status: s.status === "active" ? "paused" : "active" }
        : s
      )
    );
  }, []);

  // ── Currency conversion ───────────────────────────
  const convertAmount = useCallback((inrAmount) => {
    if (!rates || currency === "INR") return inrAmount;
    return inrAmount * (rates[currency] || 1);
  }, [rates, currency]);

  const formatAmount = useCallback((inrAmount) => {
    const converted = convertAmount(inrAmount);
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    const symbol  = symbols[currency] || currency + " ";
    return symbol + converted.toLocaleString("en-IN", {
      maximumFractionDigits: currency === "INR" ? 0 : 2,
    });
  }, [convertAmount, currency]);

  // ── Derived stats ─────────────────────────────────
  const activeSubs    = subscriptions.filter(s => s.status === "active");
  const monthlyTotal  = activeSubs.reduce((t, s) => t + Number(s.cost), 0);
  const yearlyTotal   = monthlyTotal * 12;
  const pausedCount   = subscriptions.filter(s => s.status === "paused").length;

  // Upcoming renewals (next 10 days)
  const upcomingRenewals = subscriptions
    .filter(s => {
      const days = Math.ceil((new Date(s.renewalDate) - new Date()) / 86400000);
      return s.status === "active" && days >= 0 && days <= 10;
    })
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));

  // ── Context value ─────────────────────────────────
  const value = {
    // Data
    subscriptions, activeSubs, monthlyTotal, yearlyTotal,
    pausedCount, upcomingRenewals,
    // CRUD
    addSubscription, updateSubscription, deleteSubscription, toggleSubscription,
    // Theme
    isDark, toggleDark: () => setIsDark(d => !d),
    // Budget
    budget, setBudget,
    // Currency / API
    currency, setCurrency, rates, ratesLoading, ratesError,
    convertAmount, formatAmount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Custom hook to consume context ────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
