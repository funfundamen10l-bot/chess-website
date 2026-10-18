import { Brain, Target, Clock, Lightbulb, Puzzle, TrendingUp, Eye, Zap } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Concentration",
    description: "Improves focus and attention span through strategic thinking."
  },
  {
    icon: Puzzle,
    title: "Problem-Solving",
    description: "Enhances critical thinking ability and analytical skills."
  },
  {
    icon: Target,
    title: "Strategic Thinking",
    description: "Develops planning skills and foresight."
  },
  {
    icon: Clock,
    title: "Patience",
    description: "Teaches discipline and thoughtful decision-making."
  },
  {
    icon: Lightbulb,
    title: "Memory Improvement",
    description: "Strengthens memory through pattern recognition."
  },
  {
    icon: Eye,
    title: "Analytical Thinking",
    description: "Sharpens ability to evaluate positions and situations."
  },
  {
    icon: Zap,
    title: "Decision Making",
    description: "Builds confidence in making choices under pressure."
  },
  {
    icon: TrendingUp,
    title: "Confidence Building",
    description: "Achievements boost self-esteem and motivation."
  }
];

const CHESS_KIDS = "https://images.unsplash.com/photo-1741513421047-cf5adda710bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwyfHxraWQlMjBwbGF5aW5nJTIwY2hlc3N8ZW58MHx8fHwxNzc1NTg2NDYwfDA&ixlib=rb-4.1.0&q=85";

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="py-24 md:py-32 bg-amber-50"
      data-testid="benefits-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
            Beyond The Board
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
            Benefits of <span className="text-amber-600">Learning Chess</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Chess is more than a game. It's a powerful tool for developing essential life skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-amber-200/50 blur-3xl"></div>
            <div className="relative overflow-hidden border-4 border-white shadow-2xl rounded-xl">
              <img
                src={CHESS_KIDS}
                alt="Child playing chess"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group bg-white border border-gray-200 p-6 rounded-xl transition-all duration-500 hover:border-amber-300 hover:shadow-md"
              >
                <div className="w-10 h-10 bg-amber-100 flex items-center justify-center mb-4 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <benefit.icon className="text-amber-600" size={20} />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
