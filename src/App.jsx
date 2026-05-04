import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext";
import Sidebar    from "./components/Sidebar";
import Dashboard  from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import Analytics  from "./pages/Analytics";
import Budget     from "./pages/Budget";
import AddEdit    from "./pages/AddEdit";
import Export     from "./pages/Export";
import Settings   from "./pages/Settings";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen mesh-bg" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-y-auto" style={{ marginLeft: 224 }}>
        <div style={{
          position: "fixed", top: 0, left: 224, right: 0, height: 1, zIndex: 30,
          background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.15), rgba(99,102,241,0.2), transparent)",
          pointerEvents: "none",
        }} />
        <div className="max-w-5xl mx-auto px-7 py-7">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/subs"       element={<Subscriptions />} />
            <Route path="/analytics"  element={<Analytics />} />
            <Route path="/budget"     element={<Budget />} />
            <Route path="/add"        element={<AddEdit />} />
            <Route path="/edit/:id"   element={<AddEdit />} />
            <Route path="/export"     element={<Export />} />
            <Route path="/settings"   element={<Settings />} />
          </Routes>
        </Layout>

        {/* Global toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "13px",
              fontFamily: "Satoshi, sans-serif",
            },
            success: { iconTheme: { primary: "#22c55e", secondary: "#1e293b" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#1e293b" } },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}
