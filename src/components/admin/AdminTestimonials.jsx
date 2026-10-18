import { Check, X, Trash2 } from "lucide-react";

export function AdminTestimonials({ testimonials, onApprove, onDelete }) {
  if (testimonials.length === 0) {
    return <div className="text-center py-16 text-gray-500">No testimonials yet</div>;
  }

  return (
    <div className="space-y-4" data-testid="testimonials-list">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className={`bg-black/55 backdrop-blur-xl border ${t.approved ? "border-green-500/30" : "border-amber-500/15"} p-6 rounded-xl flex gap-6`}
        >
          {t.photo_url && (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${t.photo_url}`}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/30"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-white font-medium">{t.name}</h4>
                <p className="text-gray-500 text-sm">{t.relation}</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={`star-${t.id}-${star}`} className={star <= t.rating ? "text-amber-400" : "text-gray-600"}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">{t.testimonial}</p>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs px-2 py-1 rounded ${t.approved ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
              >
                {t.approved ? "Approved" : "Pending"}
              </span>
              <div className="flex gap-2">
                {!t.approved && (
                  <button
                    onClick={() => onApprove(t.id, true)}
                    data-testid={`approve-${t.id}`}
                    className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors rounded-lg"
                  >
                    <Check size={16} />
                  </button>
                )}
                {t.approved && (
                  <button
                    onClick={() => onApprove(t.id, false)}
                    data-testid={`reject-${t.id}`}
                    className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors rounded-lg"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(t.id)}
                  data-testid={`delete-${t.id}`}
                  className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
