import { Megaphone, BookOpen, Users } from "lucide-react";

const teamMembers = [
  {
    name: "Vaibhav Singh",
    role: "Media & Marketing Manager",
    qualification: "B.Tech in Civil Engineering",
    photo: "https://customer-assets.emergentagent.com/job_chesszen-academy/artifacts/ezlyoq3u_Vaibhav%20Singh.jpeg",
    responsibilities: [
      "Managing digital presence and brand visibility",
      "Handling social media marketing & promotions",
      "Creating and executing content strategies",
      "Driving student engagement through online platforms"
    ],
    icon: Megaphone
  },
  {
    name: "Ramya Singh",
    role: "Academic Operations Manager",
    qualification: "M.Sc. (Botany), CTET Qualified",
    photo: "https://customer-assets.emergentagent.com/job_chesszen-academy/artifacts/4a0x4u5r_image.png",
    responsibilities: [
      "Administering fee collection and maintaining student databases",
      "Tracking attendance and academic performance",
      "Monitoring student learning progress and growth insights",
      "Supporting academic planning and ensuring discipline"
    ],
    icon: BookOpen
  }
];

export default function Team() {
  return (
    <section
      id="team"
      className="py-24 md:py-32 bg-gradient-to-b from-white to-amber-50"
      data-testid="team-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
            Our Team
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
            Meet Our <span className="text-amber-600">Internal Team</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            At ChessZen Classes, our internal team plays a vital role in ensuring smooth operations, 
            impactful outreach, and continuous student success through structured monitoring and support.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="group bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-500 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100/50 hover:-translate-y-1"
            >
              {/* Photo */}
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-amber-100 shadow-lg group-hover:border-amber-300 transition-colors bg-white">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl text-gray-900 font-bold mb-1">{member.name}</h3>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 rounded-full mb-3">
                  <member.icon size={16} className="text-amber-600" />
                  <span className="text-amber-700 font-semibold text-sm">{member.role}</span>
                </div>
                <p className="text-amber-600 font-medium text-sm">{member.qualification}</p>
              </div>

              {/* Responsibilities */}
              <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-5">
                <h4 className="text-gray-700 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Users size={16} className="text-amber-600" />
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {member.responsibilities.map((resp) => (
                    <li key={resp} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
