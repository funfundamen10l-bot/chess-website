import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Eye, TrendingUp, TrendingDown,
  Calendar, Clock, FileDown, BarChart3, ArrowUpRight, ArrowDownRight, Globe
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LabelList
} from "recharts";
import { API, authConfig } from "../../lib/adminApi";

const AMBER = "#f59e0b";
const AMBER_LIGHT = "#fbbf24";
const GREEN = "#22c55e";
const BLUE = "#3b82f6";
const PURPLE = "#a855f7";
const COLORS = [AMBER, BLUE, GREEN, PURPLE, "#ef4444", "#06b6d4"];

// Extracted chart tick styles to avoid inline object re-renders
const TICK_SM = { fill: "#9ca3af", fontSize: 10 };
const TICK_MD = { fill: "#9ca3af", fontSize: 11 };
const GRID_STROKE = "rgba(255,255,255,0.06)";
const VALUE_LABEL = { fill: "#e5e5e5", fontSize: 10, fontWeight: 600 };
const TOOLTIP_STYLE = {
  background: "rgba(0,0,0,0.9)",
  border: "1px solid rgba(245,158,11,0.3)",
  borderRadius: 8,
  fontSize: 12,
};

function KPICard({ label, value, change, icon, sublabel }) {
  const isUp = change > 0;
  return (
    <div className="bg-black/55 backdrop-blur-xl border border-amber-500/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">{icon}</div>
          <span className="text-gray-400 text-sm">{label}</span>
        </div>
        {change !== undefined && change !== null && (
          <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${isUp ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <span className="text-3xl font-bold text-white">{value?.toLocaleString() ?? "—"}</span>
      {sublabel && <p className="text-gray-500 text-xs mt-1">{sublabel}</p>}
    </div>
  );
}

function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`bg-black/55 backdrop-blur-xl border border-amber-500/15 rounded-xl p-6 ${className}`}>
      <h3 className="text-white font-medium mb-4">{title}</h3>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/90 border border-amber-500/30 rounded-lg px-3 py-2 text-sm">
      <p className="text-gray-400 text-xs">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey || p.name} className="text-white font-medium">{p.value} visitors</p>
      ))}
    </div>
  );
};

const formatDateTick = (v) => v.slice(5);

export function AdminAnalytics() {
  const [overview, setOverview] = useState(null);
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [devices, setDevices] = useState([]);
  const [dateRange, setDateRange] = useState(30);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const cfg = authConfig();
      const [ov, dl, wk, tp, ph, dv] = await Promise.all([
        axios.get(`${API}/admin/analytics/overview`, cfg),
        axios.get(`${API}/admin/analytics/daily?days=${dateRange}`, cfg),
        axios.get(`${API}/admin/analytics/weekly`, cfg),
        axios.get(`${API}/admin/analytics/top-pages?days=${dateRange}`, cfg),
        axios.get(`${API}/admin/analytics/peak-hours?days=${dateRange}`, cfg),
        axios.get(`${API}/admin/analytics/devices?days=${dateRange}`, cfg),
      ]);
      setOverview(ov.data);
      setDaily(dl.data);
      setWeekly(wk.data);
      setTopPages(tp.data);
      setPeakHours(ph.data);
      setDevices(dv.data);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleExport = async () => {
    try {
      const res = await axios.get(`${API}/admin/analytics/export?days=${dateRange}`, {
        ...authConfig(),
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "chesszen_analytics.csv";
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    } catch {
      toast.error("Export failed");
    }
  };

  const peakHour = peakHours.length > 0
    ? peakHours.reduce((max, h) => h.visitors > max.visitors ? h : max, peakHours[0])
    : null;
  const peakEnd = peakHour ? `${(peakHour.h + 1) % 24}:00` : null;
  const totalDevices = devices.reduce((sum, d) => sum + d.count, 0);

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="analytics-dashboard">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-amber-400" size={18} />
          <span className="text-gray-400 text-sm">Date Range:</span>
          {[7, 14, 30, 60].map((d) => (
            <button
              key={`range-${d}`}
              onClick={() => setDateRange(d)}
              data-testid={`range-${d}`}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                dateRange === d
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-gray-500 hover:text-white border border-transparent"
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
        <button
          onClick={handleExport}
          data-testid="export-csv-btn"
          className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 rounded-lg transition-colors border border-amber-500/20"
        >
          <FileDown size={16} />
          Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Today" value={overview?.today} icon={<Eye className="text-amber-400" size={20} />} sublabel="Unique visitors today" />
        <KPICard label="This Week" value={overview?.this_week} change={overview?.week_change} icon={<TrendingUp className="text-green-400" size={20} />} sublabel={`vs prev week: ${overview?.prev_week ?? 0}`} />
        <KPICard label="This Month" value={overview?.this_month} change={overview?.month_change} icon={<BarChart3 className="text-blue-400" size={20} />} sublabel={`vs prev month: ${overview?.prev_month ?? 0}`} />
        <KPICard label="All Time" value={overview?.total} icon={<Globe className="text-purple-400" size={20} />} sublabel="Total unique visits" />
      </div>

      {/* Insights Banner */}
      {overview && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {overview.week_change !== 0 && (
            <span className="text-gray-300">
              {overview.week_change > 0 ? <TrendingUp size={14} className="inline text-green-400 mr-1" /> : <TrendingDown size={14} className="inline text-red-400 mr-1" />}
              Traffic {overview.week_change > 0 ? "increased" : "decreased"} by <strong className="text-white">{Math.abs(overview.week_change)}%</strong> compared to last week
            </span>
          )}
          {peakHour && peakHour.visitors > 0 && (
            <span className="text-gray-300">
              <Clock size={14} className="inline text-amber-400 mr-1" />
              Peak traffic occurs between <strong className="text-white">{peakHour.hour} – {peakEnd}</strong>
            </span>
          )}
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Daily Traffic Trend" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={AMBER} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={AMBER} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="date" tick={TICK_MD} tickFormatter={formatDateTick} />
                <YAxis tick={TICK_MD} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="visitors" stroke={AMBER} strokeWidth={2} fill="url(#amberGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Device Breakdown">
          <div className="h-64 flex flex-col items-center justify-center">
            {totalDevices > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={devices} dataKey="count" nameKey="device" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4}>
                      {devices.map((d, i) => (
                        <Cell key={`cell-${d.device}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2">
                  {devices.map((d, i) => (
                    <div key={d.device} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-400">{d.device}</span>
                      <span className="text-white font-medium">{Math.round((d.count / totalDevices) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No data yet</p>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Weekly Comparison">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="week" tick={TICK_SM} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={TICK_MD} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visitors" fill={AMBER} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="visitors" position="top" style={VALUE_LABEL} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Peak Traffic Hours">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="hour" tick={TICK_SM} interval={2} />
                <YAxis tick={TICK_MD} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visitors" radius={[3, 3, 0, 0]}>
                  {peakHours.map((entry) => (
                    <Cell key={`hour-${entry.h}`} fill={peakHour && entry.h === peakHour.h ? AMBER_LIGHT : "rgba(245,158,11,0.3)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Top Pages */}
      <ChartCard title="Top Pages Visited">
        {topPages.length > 0 ? (
          <div className="space-y-3">
            {topPages.map((p, i) => {
              const maxViews = topPages[0]?.views || 1;
              return (
                <div key={p.page} className="flex items-center gap-4">
                  <span className="text-gray-500 text-xs w-6 text-right">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-sm font-mono">{p.page}</span>
                      <span className="text-amber-400 text-sm font-medium">{p.views}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500/40 rounded-full" style={{ width: `${(p.views / maxViews) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">No page data yet</p>
        )}
      </ChartCard>
    </div>
  );
}
