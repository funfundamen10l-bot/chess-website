import { Phone, Mail, MapPin, MessageCircle, ExternalLink } from "lucide-react";

const contactInfo = {
  phone: "+91-9205190998",
  email: "viveksingh9612@gmail.com",
  address: "G5, Supertech Eco Village 1, Bisrakh Greater Noida, Pin Code: 201318"
};

export default function Contact() {
  const whatsappLink = `https://wa.me/919205190998?text=Hi%20ChessZen%20Classes,%20I'm%20interested%20in%20learning%20more%20about%20your%20chess%20coaching%20programs.`;

  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-amber-50"
      data-testid="contact-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
            Get In Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
            Contact <span className="text-amber-600">ChessZen</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Ready to start your chess journey? Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Phone */}
            <a
              href={`tel:${contactInfo.phone}`}
              data-testid="contact-phone"
              className="group flex items-start gap-6 p-6 bg-white border border-gray-200 rounded-xl hover:border-amber-300 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 bg-amber-100 flex items-center justify-center flex-shrink-0 rounded-xl group-hover:bg-amber-200">
                <Phone className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 font-medium mb-1">Call Us</h3>
                <p className="text-amber-600 text-lg font-mono font-semibold">{contactInfo.phone}</p>
                <p className="text-gray-500 text-sm mt-1">Click to call directly</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-whatsapp"
              className="group flex items-start gap-6 p-6 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 bg-green-100 flex items-center justify-center flex-shrink-0 rounded-xl group-hover:bg-green-200">
                <MessageCircle className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 font-medium mb-1">WhatsApp</h3>
                <p className="text-green-600 text-lg font-semibold">Chat with us</p>
                <p className="text-gray-500 text-sm mt-1">Quick responses guaranteed</p>
              </div>
              <ExternalLink className="text-gray-400 ml-auto" size={18} />
            </a>

            {/* Email */}
            <a
              href={`mailto:${contactInfo.email}`}
              data-testid="contact-email"
              className="group flex items-start gap-6 p-6 bg-white border border-gray-200 rounded-xl hover:border-amber-300 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 bg-amber-100 flex items-center justify-center flex-shrink-0 rounded-xl group-hover:bg-amber-200">
                <Mail className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 font-medium mb-1">Email Us</h3>
                <p className="text-amber-600 font-medium">{contactInfo.email}</p>
                <p className="text-gray-500 text-sm mt-1">We reply within 24 hours</p>
              </div>
            </a>

            {/* Address */}
            <div className="flex items-start gap-6 p-6 bg-white border border-gray-200 rounded-xl">
              <div className="w-14 h-14 bg-amber-100 flex items-center justify-center flex-shrink-0 rounded-xl">
                <MapPin className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 font-medium mb-1">Visit Us</h3>
                <p className="text-gray-600 leading-relaxed">{contactInfo.address}</p>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="h-full min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.1234567890123!2d77.45!3d28.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSupertech%20Eco%20Village%201%2C%20Greater%20Noida!5e0!3m2!1sen!2sin!4v1234567890123"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ChessZen Location"
              className="border border-gray-200 rounded-xl shadow-sm"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
