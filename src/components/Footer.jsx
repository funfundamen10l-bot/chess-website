import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Shield } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_chesszen-academy/artifacts/vylv124f_image.png";

const quickLinks = [
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#benefits", label: "Benefits" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
  { href: "#faq", label: "FAQ" }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white" data-testid="footer">
      <div className="container mx-auto px-6 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={LOGO_URL} alt="ChessZen Classes" className="h-16 w-auto mb-6" />
            <p className="text-gray-400 leading-relaxed max-w-md mb-6">
              ChessZen Classes offers premium chess coaching for all skill levels. 
              Build focus, strategy, and confidence through the beautiful game of chess.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-500 transition-colors rounded-lg"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-500 transition-colors rounded-lg"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-500 transition-colors rounded-lg"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-medium mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+919205190998"
                  className="flex items-center gap-3 text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Phone size={16} className="text-amber-500" />
                  +91-9205190998
                </a>
              </li>
              <li>
                <a
                  href="mailto:viveksingh9612@gmail.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Mail size={16} className="text-amber-500" />
                  viveksingh9612@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  G5, Supertech Eco Village 1,<br />
                  Bisrakh Greater Noida - 201318
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} ChessZen Classes. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="/admin/login"
                data-testid="footer-admin-link"
                className="flex items-center gap-1.5 text-gray-600 hover:text-amber-500 text-xs transition-colors"
              >
                <Shield size={12} />
                Admin
              </a>
              <p className="text-gray-600 text-sm">
                Presented by Vivek Singh
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
