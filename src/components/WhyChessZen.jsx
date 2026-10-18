import { Users, Target, BookOpen, Lightbulb, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Small Batch Sizes",
    description: "Maximum 5 students per batch ensuring focused attention for every child.",
  },
  {
    icon: Target,
    title: "Personalized Coaching",
    description: "Tailored training plans based on each student's skill level and goals.",
  },
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description: "Progressive learning modules from basics to advanced tournament strategies.",
  },
  {
    icon: Lightbulb,
    title: "Practical Training",
    description: "Real game analysis, puzzles, and simulated match scenarios.",
  },
  {
    icon: TrendingUp,
    title: "Focus on Improvement",
    description: "Regular assessments and progress tracking to ensure continuous growth.",
  },
  {
    icon: Shield,
    title: "Confidence Building",
    description: "Encouraging environment that builds self-esteem through achievements.",
  }
];

export default function WhyChessZen() {
  return (
    <section
      id="why"
      className="py-24 md:py-32 bg-white"
      data-testid="why-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
            Why <span className="text-amber-600">ChessZen</span> Classes?
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We combine structured learning with personalized attention to help your child excel in chess and life.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-gradient-to-br from-amber-50 to-white border border-gray-200 p-8 rounded-xl transition-all duration-500 hover:border-amber-300 hover:shadow-lg"
            >
              <div className="w-14 h-14 bg-amber-100 flex items-center justify-center mb-6 rounded-xl group-hover:bg-amber-200 transition-colors">
                <feature.icon className="text-amber-600" size={28} />
              </div>
              <h3 className="text-gray-900 text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
