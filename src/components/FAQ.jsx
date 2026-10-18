import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const faqs = [
  {
    question: "What age group can join ChessZen Classes?",
    answer: "We welcome students of all ages, typically starting from 5 years old. Chess is beneficial for both children and adults. Our programs are designed to accommodate different age groups with appropriate teaching methods."
  },
  {
    question: "Do you provide demo classes?",
    answer: "Yes! We offer a complimentary demo class so you can experience our teaching style and methodology before committing to a program. Simply fill out the enquiry form and request a demo class."
  },
  {
    question: "Are online classes available?",
    answer: "Yes, we offer both online and offline classes. Online classes are conducted via video conferencing with interactive chess boards, making learning convenient from anywhere."
  },
  {
    question: "What is the batch size?",
    answer: "We maintain small batch sizes of maximum 5 students to ensure personalized attention and quality coaching for every student."
  },
  {
    question: "What level of students do you teach?",
    answer: "We teach students of all levels - from complete beginners who have never touched a chess piece, to intermediate players looking to improve their game, to advanced players preparing for tournaments."
  },
  {
    question: "How can I contact ChessZen Classes?",
    answer: "You can reach us via phone at +91-9205190998, WhatsApp, email at viveksingh9612@gmail.com, or by filling out the enquiry form on this website. We typically respond within 24 hours."
  },
  {
    question: "What is the duration of each session?",
    answer: "Each session typically lasts 1 hour, which includes theory, practical exercises, and game practice. We also provide homework assignments and puzzles to practice between sessions."
  },
  {
    question: "Do you prepare students for tournaments?",
    answer: "Yes! Our Advanced program specifically focuses on tournament preparation, including opening repertoire, time management, psychological preparation, and competitive play experience."
  }
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 md:py-32 bg-white"
      data-testid="faq-section"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
            Questions & Answers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
            Frequently Asked <span className="text-amber-600">Questions</span>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="bg-gradient-to-br from-amber-50 to-white border border-gray-200 px-6 rounded-xl data-[state=open]:border-amber-300 data-[state=open]:shadow-md"
            >
              <AccordionTrigger
                className="text-gray-900 text-left hover:text-amber-600 py-6 hover:no-underline [&[data-state=open]]:text-amber-600"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <a
            href="#contact"
            data-testid="faq-contact-link"
            className="text-amber-600 hover:underline font-medium"
          >
            Contact us directly
          </a>
        </div>
      </div>
    </section>
  );
}
