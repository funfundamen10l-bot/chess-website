import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { portalApi } from "../../lib/portalApi";
import {
  LayoutDashboard, Users, Layers, CalendarCheck, IndianRupee,
  TrendingUp, MessageSquare, LogOut, Menu, X, ChevronRight, Trophy, CalendarDays
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/portal" },
  { id: "students", label: "Students", icon: Users, path: "/portal/students" },
  { id: "batches", label: "Batches", icon: Layers, path: "/portal/batches" },
  { id: "attendance", label: "Mark Attendance", icon: CalendarCheck, path: "/portal/attendance" },
  { id: "batch-calendar", label: "Batch Calendar", icon: CalendarDays, path: "/portal/batch-calendar" },
  { id: "fees", label: "Fees", icon: IndianRupee, path: "/portal/fees" },
  { id: "performance", label: "Performance", icon: TrendingUp, path: "/portal/performance" },
  { id: "tournaments", label: "Tournaments", icon: Trophy, path: "/portal/tournaments" },
  { id: "communications", label: "Communications", icon: MessageSquare, path: "/portal/communications" },
];

function navItemClass(isActive, isDisabled) {
  if (isActive) return "bg-amber-500/15 text-amber-400";
  if (isDisabled) return "text-gray-600 cursor-not-allowed";
  return "text-gray-400 hover:text-white hover:bg-white/5";
}

export default function PortalLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await portalApi.checkAuth();
      setUser(res.data);
    } catch {
      localStorage.removeItem("admin_token");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const handleLogout = async () => {
    try { await portalApi.logout(); } finally {
      localStorage.removeItem("admin_token");
      navigate("/admin/login");
    }
  };

  const activeId = NAV_ITEMS.find(n => {
    if (n.path === "/portal") return location.pathname === "/portal";
    return location.pathname.startsWith(n.path);
  })?.id || "dashboard";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0f] flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111115] border-r border-white/5 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://customer-assets.emergentagent.com/job_chesszen-academy/artifacts/vylv124f_image.png"
              alt="ChessZen" className="h-8 w-auto"
            />
            <div>
              <div className="text-white font-serif text-sm font-bold">ChessZen</div>
              <div className="text-[10px] text-amber-500/80 tracking-wider uppercase">Student Portal</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { if (!item.disabled) { navigate(item.path); setSidebarOpen(false); } }}
                disabled={item.disabled}
                data-testid={`nav-${item.id}`}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${navItemClass(isActive, item.disabled)}`}
              >
                <item.icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.disabled && <span className="text-[9px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">Soon</span>}
                {isActive && <ChevronRight size={14} className="text-amber-500/50" />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-xs font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm truncate">{user?.name || "Admin"}</div>
              <div className="text-gray-500 text-xs truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            data-testid="portal-logout"
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-red-400 text-xs py-2 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#111115]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="text-white font-serif text-sm">ChessZen Portal</span>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
