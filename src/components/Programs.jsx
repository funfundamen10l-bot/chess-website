import { ArrowRight, Star } from "lucide-react";

const programs = [
  {
    level: "Beginner",
    subtitle: "For new learners",
    description: "Learn the basics of chess including piece movements, rules, basic openings, and fundamental strategies.",
    features: [
      "Chess piece movements & rules",
      "Basic opening principles",
      "Simple tactical patterns",
      "Checkmate techniques",
      "Sportsmanship & etiquette"
    ],
    highlight: false
  },
  {
    level: "Intermediate",
    subtitle: "Building skills",
    description: "Dive deeper into tactics, positional play, and strategic gameplay techniques to elevate your game.",
    features: [
      "Advanced tactical motifs",
      "Positional understanding",
      "Middle game strategies",
      "Basic endgame techniques",
      "Opening repertoire building"
    ],
    highlight: true
  },
  {
    level: "Advanced",
    subtitle: "Tournament prep",
    description: "Master tournament preparation, complex endgames, and advanced strategic concepts for competitive play.",
    features: [
      "Tournament preparation",
      "Complex endgame mastery",
      "Deep opening analysis",
      "Game annotation skills",
      "Psychological preparation"
    ],
    highlight: false
  }
];

export default function Programs() {
  const scrollToEnquiry = () => {
    const element = document.querySelector("#enquiry");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="programs"
      className="py-24 md:py-32 bg-gradient-to-b from-white to-amber-50"
      data-testid="programs-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
            Our Programs
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
            Chess Coaching <span className="text-amber-600">Programs</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Structured programs designed for every skill level, from complete beginners to competitive players.
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.level}
              className={`group bg-white border rounded-xl transition-all duration-500 flex flex-col ${
                program.highlight
                  ? 'border-amber-400 shadow-lg shadow-amber-100 relative'
                  : 'border-gray-200 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              {program.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="p-8 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star className={program.highlight ? 'text-amber-500 fill-amber-500' : 'text-gray-400'} size={16} />
                  <span className="text-gray-500 text-sm">{program.subtitle}</span>
                </div>
                
                <h3 className="font-serif text-2xl text-gray-900 mb-4">{program.level}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{program.description}</p>
                
                <ul className="space-y-3">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0">
                <button
                  onClick={scrollToEnquiry}
                  data-testid={`program-enquiry-${program.level.toLowerCase()}`}
                  className={`w-full py-4 font-semibold flex items-center justify-center gap-2 transition-all rounded-lg ${
                    program.highlight
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-amber-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  Enquire for This Batch
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
