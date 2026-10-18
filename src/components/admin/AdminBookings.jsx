import { Check, X, Calendar, Phone, Mail, Clock, CheckCircle } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-green-500/20 text-green-400",
  completed: "bg-blue-500/20 text-blue-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const BORDER_COLORS = {
  confirmed: "border-green-500/30",
  cancelled: "border-red-500/30",
};

export function AdminBookings({ bookings, onStatusChange }) {
  if (bookings.length === 0) {
    return <div className="text-center py-16 text-gray-500">No demo class bookings yet</div>;
  }

  return (
    <div className="space-y-4" data-testid="bookings-list">
      {bookings.map((b) => (
        <div
          key={b.id}
          className={`bg-black/55 backdrop-blur-xl border p-6 rounded-xl ${BORDER_COLORS[b.status] || "border-amber-500/15"}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-amber-400" size={20} />
                <span className="text-white font-medium text-lg">{b.preferred_date}</span>
                <Clock className="text-gray-500" size={16} />
                <span className="text-amber-400 font-mono">{b.preferred_time}</span>
                <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[b.status] || "bg-zinc-500/20 text-zinc-400"}`}>
                  {b.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Student:</span>{" "}
                  <span className="text-white">{b.student_name} ({b.student_age} years)</span>
                </div>
                <div>
                  <span className="text-gray-500">Parent:</span>{" "}
                  <span className="text-white">{b.parent_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" />
                  <span className="text-gray-300">{b.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  <span className="text-gray-300">{b.email}</span>
                </div>
                <div>
                  <span className="text-gray-500">Level:</span>{" "}
                  <span className="text-amber-400">{b.skill_level}</span>
                </div>
              </div>
              {b.message && (
                <p className="text-gray-500 text-sm mt-2 italic">"{b.message}"</p>
              )}
            </div>

            {b.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => onStatusChange(b.id, "confirmed")}
                  data-testid={`confirm-booking-${b.id}`}
                  className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors rounded-lg flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Confirm
                </button>
                <button
                  onClick={() => onStatusChange(b.id, "cancelled")}
                  data-testid={`cancel-booking-${b.id}`}
                  className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors rounded-lg flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
            {b.status === "confirmed" && (
              <button
                onClick={() => onStatusChange(b.id, "completed")}
                data-testid={`complete-booking-${b.id}`}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors rounded-lg flex items-center gap-2"
              >
                <Check size={16} />
                Mark Completed
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
