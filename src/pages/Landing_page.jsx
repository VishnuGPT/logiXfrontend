import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Hero from "./landingPageComponents/hero.jsx";
import KeyFeatures from "./landingPageComponents/KeyFeatures.jsx";
import ContactCTASection from "./landingPageComponents/contact.jsx";
import FAQ from "./landingPageComponents/FAQ.jsx";
import CitiesChart from "./landingPageComponents/CitiesChart.jsx";
import Services from "./landingPageComponents/Services.jsx";
import CallModal from "./landingPageComponents/CallModal.jsx"; // Import the modal

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const targetRef = useRef(null);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleModalSubmit = (formData) => {
    console.log("Call Request Submitted:", formData);
    // You would typically send this data to a backend or API here
    // closeModal(); // Modal already closes itself on submit
  };
  // ---------------------

  const scrollToComponent = () => {
    targetRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Allow Navbar "PTL" / "Courier" to reuse this existing page + modal flow
  useEffect(() => {
    const requestedService = location.state?.serviceId;
    const shouldOpen = location.state?.openCallModal && (requestedService === "ptl" || requestedService === "courier");
    if (!shouldOpen) return;

    // Scroll to Services section then open the call modal
    requestAnimationFrame(() => {
      targetRef.current?.scrollIntoView({ behavior: "smooth" });
      openModal();
    });
  }, [location.key]);

  return (
    <div className="-mt-[84px]">
      {/* Pass the openModal function down to the Hero component */}
      <Hero
        scrollToComponent={scrollToComponent}
        onOpenCallModal={openModal}
      />

      {/* Services section (target for "Ship Order Now") */}
      <div ref={targetRef}>
        <Services onOpenCallModal={openModal} />
      </div>

      {/* <KeyFeatures/> */}
      <CitiesChart />
      <ContactCTASection scrollToComponent={scrollToComponent} />
      {/* Render the Modal with AnimatePresence for animations */}
      <AnimatePresence>
        {isModalOpen && (
          <CallModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleModalSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}