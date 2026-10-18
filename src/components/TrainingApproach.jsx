import { MessageCircle, Puzzle, Gamepad2, BarChart3, UserCheck, Swords, Target, BookOpen } from "lucide-react";

const interactiveMethods = [
  { icon: MessageCircle, title: "Group Discussions", description: "Engaging conversations about strategies and openings" },
  { icon: Gamepad2, title: "Hands-on Activities", description: "Practical chess exercises and board work" },
  { icon: BarChart3, title: "Real-time Analysis", description: "Live game analysis and position evaluation" },
  { icon: UserCheck, title: "Personalized Feedback", description: "Individual guidance for improvement areas" }
];

const exercises = [
  { icon: Puzzle, title: "Puzzle Solving", description: "Daily tactical puzzles to sharpen skills" },
  { icon: Swords, title: "Tactical Drills", description: "Pattern recognition and combination training" },
  { icon: Target, title: "Match Scenarios", description: "Simulated game situations for practice" },
  { icon: BookOpen, title: "Strategy Development", description: "Building long-term planning abilities" }
];

export default function TrainingApproach() {
  return (
    <section
      id="approach"
      className="py-24 md:py-32 bg-white"
      data-testid="approach-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
            How We Teach
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
            Our Training <span className="text-amber-600">Approach</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            A balanced mix of interactive learning and practical exercises designed for effective skill development.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Section */}
          <div className="bg-gradient-to-br from-amber-50 to-white border border-gray-200 p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-xl">
                <MessageCircle className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 text-xl font-medium">Interactive Learning</h3>
                <p className="text-gray-500 text-sm">Engaging sessions for deeper understanding</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {interactiveMethods.map((method) => (
                <div key={method.title} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-lg transition-all hover:border-amber-200 hover:shadow-sm">
                  <div className="w-10 h-10 bg-amber-100 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <method.icon className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-medium">{method.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercises Section */}
          <div className="bg-gradient-to-br from-amber-50 to-white border border-gray-200 p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-xl">
                <Puzzle className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 text-xl font-medium">Practical Exercises</h3>
                <p className="text-gray-500 text-sm">Hands-on training for skill mastery</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div key={exercise.title} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-lg transition-all hover:border-amber-200 hover:shadow-sm">
                  <div className="w-10 h-10 bg-amber-100 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <exercise.icon className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-medium">{exercise.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{exercise.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
