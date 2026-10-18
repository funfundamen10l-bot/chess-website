import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Calendar, LogOut, Users, MessageSquare, BarChart3 } from "lucide-react";
import { AdminStats } from "../components/admin/AdminStats";
import { AdminBookings } from "../components/admin/AdminBookings";
import { AdminTestimonials } from "../components/admin/AdminTestimonials";
import { AdminEnquiries } from "../components/admin/AdminEnquiries";
import { AdminAnalytics } from "../components/admin/AdminAnalytics";
import { API, authConfig } from "../lib/adminApi";

const CHESS_BG = "https://images.unsplash.com/flagged/photo-1556540359-22713779a639?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwzfHxjaGVzcyUyMGdhbWUlMjBiZWF1dGlmdWwlMjBhZXN0aGV0aWMlMjB3b29kZW4lMjBwb2xpc2hlZHxlbnwwfHx8fDE3NzYxODkwMDN8MA&ixlib=rb-4.1.0&q=85";

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");
  const [testimonials, setTestimonials] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, authConfig());
      setUser(res.data);
    } catch {
      localStorage.removeItem("admin_token");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/stats`, authConfig());
      setStats(res.data);
    } catch {
      // stats are non-critical, silently fail
    }
  }, []);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/testimonials`, authConfig());
      setTestimonials(res.data);
    } catch {
      toast.error("Failed to fetch testimonials");
    }
  }, []);

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/enquiries`, authConfig());
      setEnquiries(res.data);
    } catch {
      toast.error("Failed to fetch enquiries");
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/bookings`, authConfig());
      setBookings(res.data);
    } catch {
      toast.error("Failed to fetch bookings");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) fetchStats();
  }, [user, fetchStats]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "testimonials") fetchTestimonials();
    else if (activeTab === "enquiries") fetchEnquiries();
    else if (activeTab === "bookings") fetchBookings();
  }, [user, activeTab, fetchTestimonials, fetchEnquiries, fetchBookings]);

  const handleApprove = useCallback(async (id, approved) => {
    try {
      await axios.patch(`${API}/admin/testimonials/${id}`, { approved }, authConfig());
      toast.success(approved ? "Testimonial approved" : "Testimonial rejected");
      fetchTestimonials();
      fetchStats();
    } catch {
      toast.error("Failed to update testimonial");
    }
  }, [fetchTestimonials, fetchStats]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await axios.delete(`${API}/admin/testimonials/${id}`, authConfig());
      toast.success("Testimonial deleted");
      fetchTestimonials();
      fetchStats();
    } catch {
      toast.error("Failed to delete testimonial");
    }
  }, [fetchTestimonials, fetchStats]);

  const handleBookingStatus = useCallback(async (id, status) => {
    try {
      await axios.patch(`${API}/bookings/${id}/status?status=${status}`, {}, authConfig());
      toast.success(`Booking ${status}`);
      fetchBookings();
      fetchStats();
    } catch {
      toast.error("Failed to update booking");
    }
  }, [fetchBookings, fetchStats]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } finally {
      localStorage.removeItem("admin_token");
      navigate("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { id: "bookings", label: "Demo Bookings", count: bookings.length, icon: <Calendar size={18} /> },
    { id: "testimonials", label: "Testimonials", count: testimonials.length, icon: <MessageSquare size={18} /> },
    { id: "enquiries", label: "Enquiries", count: enquiries.length, icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${CHESS_BG})`, filter: "brightness(0.4) saturate(1.1)" }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-black/35 via-black/20 to-amber-900/10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />

      <div className="relative z-10">
        <header className="bg-black/50 backdrop-blur-2xl border-b border-amber-500/15 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://customer-assets.emergentagent.com/job_chesszen-academy/artifacts/vylv124f_image.png"
                alt="ChessZen"
                className="h-10 w-auto"
              />
              <span className="text-white font-serif text-xl">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/portal"
                data-testid="portal-link"
                className="px-3 py-1.5 bg-amber-500/15 text-amber-400 text-sm rounded-lg hover:bg-amber-500/25 transition-colors border border-amber-500/20"
              >
                Student Portal
              </a>
              <span className="text-gray-400 text-sm">{user?.email}</span>
              <button
                onClick={handleLogout}
                data-testid="logout-btn"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <AdminStats stats={stats} />

          <div className="flex gap-4 mb-8 border-b border-amber-500/15 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`tab-${tab.id}`}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-amber-400 border-amber-400"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ""}
              </button>
            ))}
          </div>

          {activeTab === "analytics" && <AdminAnalytics />}
          {activeTab === "bookings" && (
            <AdminBookings bookings={bookings} onStatusChange={handleBookingStatus} />
          )}
          {activeTab === "testimonials" && (
            <AdminTestimonials testimonials={testimonials} onApprove={handleApprove} onDelete={handleDelete} />
          )}
          {activeTab === "enquiries" && (
            <AdminEnquiries enquiries={enquiries} />
          )}
        </main>
      </div>
    </div>
  );
}
