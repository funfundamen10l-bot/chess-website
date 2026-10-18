import { useState } from "react";
import { Menu, X, Phone, Calendar } from "lucide-react";
import BookingModal from "./BookingModal";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_chesszen-academy/artifacts/vylv124f_image.png";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#benefits", label: "Benefits" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
  { href: "#faq", label: "FAQ" },
];

export default function Header({ isScrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const scrollToSection = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openBooking = () => {
    setMobileMenuOpen(false);
    setIsBookingOpen(true);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm"
            : "bg-white/30 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3" data-testid="logo">
              <img src={LOGO_URL} alt="ChessZen Classes" className="h-12 w-auto" />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                  className="text-gray-600 hover:text-amber-600 text-sm font-medium transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+919205190998"
                className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
                data-testid="header-phone"
              >
                <Phone size={18} />
                <span className="text-sm">+91-9205190998</span>
              </a>
              <button
                onClick={openBooking}
                data-testid="header-cta"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold px-6 py-3 text-sm transition-all flex items-center gap-2 rounded-lg shadow-md"
              >
                <Calendar size={16} />
                Book Demo Class
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-btn"
              className="lg:hidden text-gray-700 p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200">
            <div className="container mx-auto px-6 py-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-700 hover:text-amber-600 text-left py-2 text-lg transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <hr className="border-gray-200 my-4" />
                <a
                  href="tel:+919205190998"
                  className="flex items-center gap-3 text-gray-700 py-2"
                >
                  <Phone size={20} />
                  +91-9205190998
                </a>
                <button
                  onClick={openBooking}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-4 mt-4 flex items-center justify-center gap-2 rounded-lg"
                >
                  <Calendar size={18} />
                  Book Demo Class
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
