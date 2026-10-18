import { Calendar, CheckCircle, MessageSquare, Users, AlertCircle } from "lucide-react";

export function AdminStats({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: "Total Bookings",
      value: stats.total_bookings,
      icon: <Calendar className="text-amber-400" size={20} />,
      iconBg: "bg-amber-500/15",
      borderClass: "border-amber-500/15",
      badge: stats.pending_bookings > 0 ? { text: `${stats.pending_bookings} pending`, color: "bg-yellow-500/20 text-yellow-400" } : null,
    },
    {
      label: "Confirmed",
      value: stats.confirmed_bookings,
      icon: <CheckCircle className="text-green-400" size={20} />,
      iconBg: "bg-green-500/15",
      borderClass: "border-green-500/20",
      badge: null,
    },
    {
      label: "Testimonials",
      value: stats.total_testimonials,
      icon: <MessageSquare className="text-purple-400" size={20} />,
      iconBg: "bg-purple-500/15",
      borderClass: "border-amber-500/15",
      badge: stats.pending_testimonials > 0 ? { text: `${stats.pending_testimonials} pending`, color: "bg-yellow-500/20 text-yellow-400", showIcon: true } : null,
    },
    {
      label: "Enquiries",
      value: stats.total_enquiries,
      icon: <Users className="text-blue-400" size={20} />,
      iconBg: "bg-blue-500/15",
      borderClass: "border-amber-500/15",
      badge: stats.recent_enquiries > 0 ? { text: `${stats.recent_enquiries} this week`, color: "bg-blue-500/20 text-blue-400" } : null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" data-testid="stats-overview">
      {cards.map((card) => (
        <div key={card.label} className={`bg-black/55 backdrop-blur-xl border ${card.borderClass} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              {card.icon}
            </div>
            <span className="text-gray-400 text-sm">{card.label}</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-white" data-testid={`stat-${card.label.toLowerCase().replace(/\s/g, '-')}`}>
              {card.value}
            </span>
            {card.badge && (
              <span className={`text-xs px-2 py-1 rounded ${card.badge.color} flex items-center gap-1`}>
                {card.badge.showIcon && <AlertCircle size={12} />}
                {card.badge.text}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
