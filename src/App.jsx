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
    <div className="flex min-h-screen bg-surface-950 mesh-bg noise">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto">
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
