import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Premium chess board background
const CHESS_BG = "https://images.unsplash.com/flagged/photo-1556540359-22713779a639?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwzfHxjaGVzcyUyMGdhbWUlMjBiZWF1dGlmdWwlMjBhZXN0aGV0aWMlMjB3b29kZW4lMjBwb2xpc2hlZHxlbnwwfHx8fDE3NzYxODkwMDN8MA&ixlib=rb-4.1.0&q=85";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password }, { withCredentials: true });
      if (res.data.access_token) {
        localStorage.setItem("admin_token", res.data.access_token);
      }
      toast.success("Login successful");
      navigate("/admin");
    } catch (e) {
      const detail = e.response?.data?.detail;
      let errorMsg = "Login failed";
      if (typeof detail === "string") {
        errorMsg = detail;
      } else if (Array.isArray(detail)) {
        errorMsg = detail.map(d => d.msg || JSON.stringify(d)).join(" ");
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6">
      {/* Chess Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${CHESS_BG})`,
          filter: 'brightness(0.55) saturate(1.1)'
        }}
      />
      
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-amber-900/15" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://customer-assets.emergentagent.com/job_chesszen-academy/artifacts/vylv124f_image.png"
            alt="ChessZen Classes"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-serif text-white">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-2">Access the ChessZen admin panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-black/50 backdrop-blur-2xl border border-amber-500/15 p-8 rounded-2xl shadow-2xl shadow-black/40">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="text-sm text-gray-300 font-medium mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="login-email"
                className="w-full bg-white/10 border border-white/20 text-white pl-12 pr-4 py-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-gray-500"
                placeholder="admin@chesszen.com"
                required
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="text-sm text-gray-300 font-medium mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="login-password"
                className="w-full bg-white/10 border border-white/20 text-white pl-12 pr-4 py-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-gray-500"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="login-submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 rounded-lg shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          <a href="/" className="text-amber-400 hover:underline">Back to Website</a>
        </p>
      </div>
    </div>
  );
}
