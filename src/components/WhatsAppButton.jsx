import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappLink = `https://wa.me/919205190998?text=Hi%20ChessZen%20Classes,%20I'm%20interested%20in%20learning%20more%20about%20your%20chess%20coaching%20programs.`;

  return (
    <>
      {/* Mobile Call Button */}
      <a
        href="tel:+919205190998"
        data-testid="floating-call-btn"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 md:hidden"
        aria-label="Call ChessZen"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="floating-whatsapp-btn"
        className="fixed bottom-20 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        
        {/* Tooltip */}
        <span className="absolute right-16 bg-white border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
          Chat with us
        </span>
      </a>
    </>
  );
}
