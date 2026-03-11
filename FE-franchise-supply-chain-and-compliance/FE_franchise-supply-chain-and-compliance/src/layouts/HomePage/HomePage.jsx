import "./Homepage.css";

import HeroSection from "./sections/HeroSection";
import StatsSection from "./sections/StatsSection";
import WhySection from "./sections/WhySection";
import ProductSection from "./sections/ProductSection";
import InvestmentSection from "./sections/InvestmentSection";
import TestimonialSection from "./sections/TestimonialSection";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";
import Header from "./Header";

export default function Homepage() {
  return (
    <div className="homepage">
      <Header />
      <HeroSection />
      <StatsSection />
      <WhySection />
      <ProductSection />
      <TestimonialSection />
      <InvestmentSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}