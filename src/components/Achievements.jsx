import { Trophy, Award, Medal, GraduationCap } from "lucide-react";

const achievements = [
  {
    year: "2025",
    icon: Trophy,
    title: "1st Position - Indoor Sports Fiesta",
    organization: "JAKSON Group",
    highlight: true
  },
  {
    year: "2024",
    icon: Award,
    title: "Best Unrated Player",
    organization: "Niyantrana Open Chess Tournament (22nd Place)",
    highlight: false
  },
  {
    year: "2024",
    icon: Medal,
    title: "SkillCraft International Open",
    organization: "Classical FIDE Rated Tournament - 445th Place",
    highlight: false
  },
  {
    year: "2025",
    icon: Medal,
    title: "SkillCraft International Below 1800",
    organization: "Classical FIDE Rated Tournament - 377th Place",
    highlight: false
  }
];

const TROPHY_IMG = "https://images.pexels.com/photos/6532369/pexels-photo-6532369.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="py-24 md:py-32 bg-gradient-to-b from-amber-50 to-white"
      data-testid="achievements-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
            Track Record
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
            Achievements & <span className="text-amber-600">Credentials</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            A proven track record of competitive success and continuous improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Achievement Cards */}
          <div className="lg:col-span-7 space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className={`group flex items-start gap-6 p-6 rounded-xl transition-all duration-500 ${
                  achievement.highlight
                    ? 'bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-300 shadow-md'
                    : 'bg-white border border-gray-200 hover:border-amber-200 hover:shadow-sm'
                }`}
              >
                <div className={`w-14 h-14 flex items-center justify-center flex-shrink-0 rounded-xl ${
                  achievement.highlight ? 'bg-amber-200' : 'bg-amber-100'
                }`}>
                  <achievement.icon className="text-amber-600" size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-amber-600 font-mono text-sm font-semibold">{achievement.year}</span>
                    {achievement.highlight && (
                      <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold uppercase rounded">Winner</span>
                    )}
                  </div>
                  <h3 className="text-gray-900 text-lg font-medium mb-1">{achievement.title}</h3>
                  <p className="text-gray-500 text-sm">{achievement.organization}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trophy Image */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-200/50 blur-3xl"></div>
              <div className="relative overflow-hidden border-4 border-white shadow-2xl rounded-xl">
                <img
                  src={TROPHY_IMG}
                  alt="Achievement Trophy"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-amber-400" size={20} />
                    <span className="text-white font-medium">Academic Excellence</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    M.Tech from NIT Surathkal (82%) | B.Tech from NIT Agartala (83.5%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
