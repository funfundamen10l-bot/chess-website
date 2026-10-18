import { Award, BookOpen, Target, Users } from "lucide-react";

const COACH_PHOTO = "https://customer-assets.emergentagent.com/job_chesszen-academy/artifacts/8j3ai5s9_Untitled%20design%20%281%29.jpg";

const credentials = [
  { label: "FIDE ID", value: "537023560" },
  { label: "AICF ID", value: "266194UP2024" },
  { label: "UPCSA ID", value: "UP25SULT0004464" },
];

const ratings = [
  { platform: "Chess.com", rating: "1874", label: "Rapid" },
  { platform: "Lichess", rating: "2127", label: "Rapid" },
];

const education = [
  { degree: "M.Tech", institution: "NIT Surathkal", score: "82%" },
  { degree: "B.Tech", institution: "NIT Agartala", score: "83.5%" },
];

export default function AboutCoach() {
  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-gradient-to-b from-amber-50 to-white"
      data-testid="about-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
            Know Your Coach
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
            Meet <span className="text-amber-600">Vivek Singh</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Coach Photo */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-200/50 blur-3xl"></div>
              <div className="relative aspect-[4/5] overflow-hidden border-4 border-white shadow-2xl rounded-lg">
                <img
                  src={COACH_PHOTO}
                  alt="Coach Vivek Singh"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="font-serif text-2xl text-white">Vivek Singh</h3>
                  <p className="text-amber-400 text-sm mt-1">Chess Coach & Strategist</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coach Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Bio */}
            <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
              <p className="text-gray-700 leading-relaxed text-lg">
                With over <span className="text-amber-600 font-semibold">10 years of chess experience</span> and 
                a strong foundation in project management, I bring a structured, strategic approach to chess coaching. 
                My goal is to nurture young minds, helping them develop critical thinking, patience, and 
                confidence through the beautiful game of chess.
              </p>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {credentials.map((cred) => (
                <div key={cred.label} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">{cred.label}</span>
                  <p className="text-amber-600 font-mono text-lg mt-2">{cred.value}</p>
                </div>
              ))}
            </div>

            {/* Ratings */}
            <div className="grid grid-cols-2 gap-4">
              {ratings.map((r) => (
                <div key={r.platform} className="bg-white border border-gray-200 p-6 flex items-center gap-4 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg">
                    <Target className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{r.platform} {r.label}</p>
                    <p className="text-gray-900 font-mono text-2xl">{r.rating}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
              <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-amber-600" />
                Academic Excellence
              </h4>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.degree} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{edu.degree} - {edu.institution}</span>
                    <span className="text-amber-600 font-mono font-semibold">{edu.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
