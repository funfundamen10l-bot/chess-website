import { useState, useEffect } from "react";
import { useVisitorTracking } from "../hooks/useVisitorTracking";
import Header from "../components/Header";
import Hero from "../components/Hero";
import AboutCoach from "../components/AboutCoach";
import Team from "../components/Team";
import WhyChessZen from "../components/WhyChessZen";
import Programs from "../components/Programs";
import Benefits from "../components/Benefits";
import TrainingApproach from "../components/TrainingApproach";
import Achievements from "../components/Achievements";
import Testimonials from "../components/Testimonials";
import EnquiryForm from "../components/EnquiryForm";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  useVisitorTracking();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header isScrolled={isScrolled} />
      <main>
        <Hero />
        <AboutCoach />
        <Team />
        <WhyChessZen />
        <Programs />
        <Benefits />
        <TrainingApproach />
        <Achievements />
        <Testimonials />
        <EnquiryForm />
        <Contact />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
