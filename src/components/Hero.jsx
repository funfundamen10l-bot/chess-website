import { useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import BookingModal from "./BookingModal";

// Premium polished wooden chess board with elegant Staunton pieces
const HERO_BG = "https://images.unsplash.com/flagged/photo-1556540359-22713779a639?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwzfHxjaGVzcyUyMGdhbWUlMjBiZWF1dGlmdWwlMjBhZXN0aGV0aWMlMjB3b29kZW4lMjBwb2xpc2hlZHxlbnwwfHx8fDE3NzYxODkwMDN8MA&ixlib=rb-4.1.0&q=85";
const LOGO_URL = "https://customer-assets.emergentagent.com/job_chesszen-academy/artifacts/vylv124f_image.png";

export default function Hero() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Chess Background with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed hero-bg-animate"
        style={{ 
          backgroundImage: `url(${HERO_BG})`,
          filter: 'brightness(1.15) contrast(1.05)'
        }}
      />
      
      {/* Light Overlay with Gradient - Reduced opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/65 to-white/70" />
      
      {/* Subtle Gold Accent Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-amber-100/20" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo with shadow for visibility */}
          <div className="mb-8 animate-fade-in">
            <img
              src={LOGO_URL}
              alt="ChessZen Classes"
              className="h-24 md:h-32 w-auto mx-auto drop-shadow-lg"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 shadow-lg shadow-amber-500/25 mb-8 rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="text-white text-sm font-semibold tracking-wide uppercase">
              Admissions Open 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Build <span className="text-amber-600 font-bold">Focus, Strategy</span>
            <br />& Confidence Through Chess
          </h1>

          {/* Subheadline */}
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Join ChessZen Classes and unlock your child's cognitive potential with
            expert coaching from a FIDE-rated player with 10+ years of experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsBookingOpen(true)}
              data-testid="hero-cta-demo"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold px-8 py-4 flex items-center justify-center gap-2 transition-all hover:translate-y-[-2px] shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 rounded-lg"
            >
              <Calendar size={18} />
              Book a Demo Class
            </button>
            <button
              onClick={() => scrollToSection("#enquiry")}
              data-testid="hero-cta-enquiry"
              className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-amber-600 text-amber-700 hover:bg-amber-50 font-semibold px-8 py-4 flex items-center justify-center gap-2 transition-all shadow-lg rounded-lg"
            >
              Send Enquiry
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-gray-300/50">
            <div className="text-center bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm">
              <div className="text-amber-600 text-2xl font-bold font-mono">10+</div>
              <div className="text-gray-600 text-sm font-medium">Years Experience</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm">
              <div className="text-amber-600 text-2xl font-bold font-mono">2127</div>
              <div className="text-gray-600 text-sm font-medium">Lichess Rating</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm">
              <div className="text-amber-600 text-2xl font-bold font-mono">FIDE</div>
              <div className="text-gray-600 text-sm font-medium">Rated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-amber-600/50 rounded-full flex justify-center pt-2 bg-white/50 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-amber-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
}
