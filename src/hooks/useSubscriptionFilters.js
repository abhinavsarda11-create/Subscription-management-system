/**
 * useSubscriptionFilters — Custom hook
 * Encapsulates all filtering, searching, and sorting logic.
 * Demonstrates: Custom Hooks, useMemo, useState
 */
import { useState, useMemo } from "react";

export function useSubscriptionFilters(subscriptions) {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("all");
  const [status,   setStatus]   = useState("all");
  const [sortBy,   setSortBy]   = useState("renewal");

  const filtered = useMemo(() => {
    let list = [...subscriptions];

    // Filter by search text
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category !== "all") {
      list = list.filter(s => s.category === category);
    }

    // Filter by status
    if (status !== "all") {
      list = list.filter(s => s.status === status);
    }

    // Sort
    switch (sortBy) {
      case "renewal":
        list.sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
        break;
      case "cost-high":
        list.sort((a, b) => b.cost - a.cost);
        break;
      case "cost-low":
        list.sort((a, b) => a.cost - b.cost);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return list;
  }, [subscriptions, search, category, status, sortBy]);

  const reset = () => {
    setSearch(""); setCategory("all");
    setStatus("all"); setSortBy("renewal");
  };

  return {
    filtered, search, setSearch,
    category, setCategory,
    status,   setStatus,
    sortBy,   setSortBy,
    reset,
    hasFilters: search !== "" || category !== "all" || status !== "all",
  };
}
