import { useNavigate } from "react-router-dom";
import Hero from "./landingPageComponents/hero.jsx";
import KeyFeatures from "./landingPageComponents/KeyFeatures.jsx";
import ContactCTASection from "./landingPageComponents/contact.jsx";
import FAQ from "./landingPageComponents/FAQ.jsx";
import CitiesChart from "./landingPageComponents/CitiesChart.jsx";
import Services from "./landingPageComponents/Services.jsx";
import { useRef } from "react"; // <-- 1. FIX: Changed to a named import

export default function LandingPage() {
  const navigate = useNavigate();
  const targetRef = useRef(null);

  const scrollToComponent = () => {
    targetRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Hero scrollToComponent={scrollToComponent} />

      {/* 2. FIX: Wrap the component in a <div> and apply the ref here */}
      <div ref={targetRef}>
        <Services />
      </div>

      <KeyFeatures />
      <CitiesChart />
      <ContactCTASection scrollToComponent={scrollToComponent} />
      <FAQ />
    </div>
  );
}