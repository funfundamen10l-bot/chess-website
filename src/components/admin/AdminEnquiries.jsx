import { Check, X, Phone, Mail } from "lucide-react";

export function AdminEnquiries({ enquiries }) {
  if (enquiries.length === 0) {
    return <div className="text-center py-16 text-gray-500">No enquiries yet</div>;
  }

  return (
    <div className="overflow-x-auto" data-testid="enquiries-list">
      <div className="bg-black/55 backdrop-blur-xl border border-amber-500/15 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-amber-500/15 text-left">
              <th className="py-4 px-4 text-gray-400 font-medium text-sm">Name</th>
              <th className="py-4 px-4 text-gray-400 font-medium text-sm">Contact</th>
              <th className="py-4 px-4 text-gray-400 font-medium text-sm">Student Age</th>
              <th className="py-4 px-4 text-gray-400 font-medium text-sm">Batch</th>
              <th className="py-4 px-4 text-gray-400 font-medium text-sm">Level</th>
              <th className="py-4 px-4 text-gray-400 font-medium text-sm">Demo</th>
              <th className="py-4 px-4 text-gray-400 font-medium text-sm">Date</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="text-white font-medium">{e.parent_name}</div>
                  {e.message && (
                    <div className="text-gray-500 text-xs mt-1">
                      {e.message.substring(0, 50)}
                      {e.message.length > 50 ? "..." : ""}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Phone size={14} />
                    {e.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <Mail size={12} />
                    {e.email}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-300">{e.student_age} years</td>
                <td className="py-4 px-4 text-gray-300">{e.preferred_batch}</td>
                <td className="py-4 px-4">
                  <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded">
                    {e.skill_level}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {e.demo_interest ? (
                    <Check className="text-green-400" size={18} />
                  ) : (
                    <X className="text-gray-600" size={18} />
                  )}
                </td>
                <td className="py-4 px-4 text-gray-500 text-sm">
                  {new Date(e.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
