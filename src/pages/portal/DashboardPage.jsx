import { useState, useEffect, useCallback } from "react";
import { portalApi } from "../../lib/portalApi";
import { Users, UserCheck, UserX, Layers, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from "recharts";

const COLORS = ["#f59e0b", "#3b82f6", "#22c55e", "#a855f7", "#ef4444"];
const TICK = { fill: "#9ca3af", fontSize: 11 };
const DASH_LABEL = { fill: "#e5e5e5", fontSize: 11, fontWeight: 600 };
const PIE_TOOLTIP_STYLE = { background: "rgba(0,0,0,0.9)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, fontSize: 12 };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/90 border border-amber-500/30 rounded-lg px-3 py-2 text-sm">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-white font-medium">{payload[0].value}</p>
    </div>
  );
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const res = await portalApi.dashboard();
      setData(res.data);
    } catch { /* */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6" data-testid="portal-dashboard">
      <div>
        <h1 className="text-2xl font-serif text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Student management overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: data?.total_students, icon: <Users className="text-amber-400" size={20} />, color: "border-amber-500/20" },
          { label: "Active", value: data?.active_students, icon: <UserCheck className="text-green-400" size={20} />, color: "border-green-500/20" },
          { label: "Inactive", value: data?.inactive_students, icon: <UserX className="text-red-400" size={20} />, color: "border-red-500/20" },
          { label: "Batches", value: data?.total_batches, icon: <Layers className="text-blue-400" size={20} />, color: "border-blue-500/20" },
        ].map((card) => (
          <div key={card.label} className={`bg-[#16161a] border ${card.color} rounded-xl p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">{card.icon}</div>
              <span className="text-gray-400 text-sm">{card.label}</span>
            </div>
            <span className="text-3xl font-bold text-white">{card.value ?? 0}</span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Capacity */}
        <div className="bg-[#16161a] border border-white/5 rounded-xl p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Layers size={16} className="text-amber-400" /> Batch Capacity</h3>
          {data?.batch_stats?.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.batch_stats} layout="vertical">
                  <XAxis type="number" tick={TICK} />
                  <YAxis dataKey="name" type="category" tick={TICK} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="students" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Students">
                    <LabelList dataKey="students" position="right" style={DASH_LABEL} />
                  </Bar>
                  <Bar dataKey="capacity" fill="rgba(255,255,255,0.08)" radius={[0, 4, 4, 0]} name="Capacity">
                    <LabelList dataKey="capacity" position="right" style={{ fill: "#6b7280", fontSize: 10 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-gray-500 text-sm py-8 text-center">No batches yet</p>}
        </div>

        {/* Chess Level Distribution */}
        <div className="bg-[#16161a] border border-white/5 rounded-xl p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2"><GraduationCap size={16} className="text-amber-400" /> Chess Level Distribution</h3>
          {data?.level_distribution?.length > 0 ? (
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.level_distribution} dataKey="count" nameKey="level" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                    {data.level_distribution.map((_, i) => <Cell key={`lvl-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={PIE_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 ml-4">
                {data.level_distribution.map((d, i) => (
                  <div key={d.level} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-400">{d.level}</span>
                    <span className="text-white font-medium">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-gray-500 text-sm py-8 text-center">No student data yet</p>}
        </div>
      </div>
    </div>
  );
}
