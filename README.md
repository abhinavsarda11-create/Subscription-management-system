# ⚡ SubTrack Pro — Advanced Subscription Management Dashboard

> A production-grade React application demonstrating every major concept required for a top-tier student project.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## ✅ Major Project Requirements — All Covered

| Requirement | How It's Implemented |
|---|---|
| **React Router** | 8 routes: /, /subs, /analytics, /budget, /add, /edit/:id, /export, /settings |
| **useState** | 20+ state variables across all pages and components |
| **useEffect** | Font loading, API fetch, form pre-fill, localStorage sync |
| **useContext** | `AppContext` + `useApp()` hook consumed in every page |
| **Context API** | `AppProvider` wraps entire app — global state management |
| **Custom Hooks** | `useApp()` (context), `useSubscriptionFilters()` (filtering logic) |
| **Component Reusability** | StatCard, SubscriptionCard, LoadingSpinner used across pages |
| **API Integration** | ExchangeRate API — live currency conversion (USD/EUR/GBP) |
| **LocalStorage** | Subscriptions, budget, theme persisted automatically |
| **Responsive Design** | Tailwind responsive grid (1col → 2col → 3col) |
| **Loading States** | PageLoader, CardSkeleton shimmer, API loading indicator |
| **Error Handling** | API error fallback, form validation with error messages |
| **Dark Mode** | CSS class toggle, persisted in localStorage |
| **Animations** | Framer Motion — page transitions, card animations, gauge rings |
| **Performance** | useMemo for filtering, useCallback in context, AbortController for API |

---

## 📁 Project Structure

```
src/
├── App.jsx                    ← Router setup + global Toaster
├── main.jsx                   ← React entry point
├── index.css                  ← Tailwind + custom utilities
│
├── context/
│   └── AppContext.jsx          ← Context API — global state, CRUD, API
│
├── hooks/
│   └── useSubscriptionFilters.js ← Custom hook — search/filter/sort
│
├── data/
│   └── subscriptions.js        ← Seed data + category definitions
│
├── utils/
│   └── helpers.js              ← date-fns helpers, CATEGORY_COLORS
│
├── components/
│   ├── Sidebar.jsx             ← Animated nav (Framer Motion + NavLink)
│   ├── StatCard.jsx            ← Reusable KPI card
│   ├── SubscriptionCard.jsx    ← Individual sub card (full CRUD)
│   └── LoadingSpinner.jsx      ← Skeleton, PageLoader, EmptyState, ErrorState
│
└── pages/
    ├── Dashboard.jsx           ← Overview + Recharts AreaChart
    ├── Subscriptions.jsx       ← Full CRUD grid with filters
    ├── Analytics.jsx           ← BarChart + PieChart + AreaChart
    ├── Budget.jsx              ← SVG gauge + per-category budgets
    ├── AddEdit.jsx             ← Unified add/edit form (useParams)
    ├── Export.jsx              ← CSV/JSON/copy/print
    └── Settings.jsx            ← Currency API + dark mode + data reset
```

---

## 🛠 Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 18.3 | UI library |
| Vite | 5.4 | Build tool |
| react-router-dom | 6.26 | Multi-page routing |
| framer-motion | 11 | Animations |
| recharts | 2.13 | Charts (Bar, Pie, Area) |
| react-hot-toast | 2.4 | Toast notifications |
| tailwindcss | 3.4 | Styling |
| date-fns | 4.1 | Date formatting |
| lucide-react | 0.454 | Icons |

---

## 🎓 Concepts for Viva

### React Router
```jsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/edit/:id" element={<AddEdit />} />  // dynamic route
</Routes>
// In AddEdit: const { id } = useParams();
```

### Context API
```jsx
// Provider wraps app
<AppProvider><App /></AppProvider>
// Custom hook to consume
const { subscriptions, addSubscription } = useApp();
```

### API Integration
```jsx
useEffect(() => {
  fetch("https://api.exchangerate-api.com/v4/latest/INR")
    .then(res => res.json())
    .then(data => setRates(data.rates));
}, []);
```

### LocalStorage
```jsx
useEffect(() => {
  localStorage.setItem("subtrack_pro_v2", JSON.stringify(subscriptions));
}, [subscriptions]);
```

### Custom Hook
```jsx
function useSubscriptionFilters(subscriptions) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => subscriptions.filter(...), [subscriptions, search]);
  return { filtered, search, setSearch };
}
```
