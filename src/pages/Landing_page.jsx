import { useNavigate } from "react-router-dom";
import Hero from "./landingPageComponents/hero.jsx";
import KeyFeatures from "./landingPageComponents/KeyFeatures.jsx";
import ContactCTASection from "./landingPageComponents/contact.jsx";
import FAQ from "./landingPageComponents/FAQ.jsx";
import CitiesChart from "./landingPageComponents/CitiesChart.jsx";
import Services from "./landingPageComponents/Services.jsx";
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Hero />
      <Services />
      <KeyFeatures />
      <CitiesChart />
      <ContactCTASection />
      <FAQ />
    </div>
  );
}