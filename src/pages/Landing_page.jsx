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
import CircularGallery from "./landingPageComponents/circularGallery.jsx";
import SellerSection from "./landingPageComponents/SellerSection.jsx"
import { useTranslation } from "react-i18next";
import ScrollStack, { ScrollStackItem } from "./landingPageComponents/ScrollStack.jsx";
export default function LandingPage() {
  const { t } = useTranslation("citiesChart");
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


      {/* Scroll Stack start */}
      <ScrollStack>
        <ScrollStackItem accent="blue">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#001F3F]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#001F3F]/70">
            Platform Positioning
          </div>
          <h3 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Unified Logistics Marketplace
          </h3>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#001F3F]/80">
            LogiXjunction is a single, integrated logistics marketplace that brings together
            transportation services, courier solutions, logistics operations, and packers and movers
            on one platform. Instead of managing multiple vendors and fragmented processes,
            businesses can plan, book, and coordinate all logistics requirements through one
            centralized system.
          </p>
        </ScrollStackItem>
        <ScrollStackItem accent="red">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#001F3F]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#001F3F]/70">
            Solution Depth
          </div>
          <h3 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight">
            End-to-End B2B Logistics Solutions
          </h3>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#001F3F]/80">
            We deliver end-to-end logistics solutions covering first-mile pickup, intercity
            transportation, last-mile delivery, and relocation services. Our platform is designed
            specifically for B2B logistics needs, supporting varied shipment sizes, industries, and
            operational workflows across India.
          </p>
        </ScrollStackItem>
        <ScrollStackItem accent="emerald">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#001F3F]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#001F3F]/70">
            Technology &amp; Operations
          </div>
          <h3 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Technology-Driven Logistics Operations
          </h3>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#001F3F]/80">
            Our technology-driven logistics platform enables centralized coordination, improved
            shipment visibility, and process-driven execution across all service categories. By
            combining technology with verified logistics partners, LogiXjunction helps businesses
            achieve more reliable, scalable, and efficient logistics operations.
          </p>
        </ScrollStackItem>
      </ScrollStack>

      {/* services component start */}


      {/* Services section (target for "Ship Order Now") */}
      <div ref={targetRef}>
        <Services onOpenCallModal={openModal} />
      </div>
      {/* <SellerSection/> */}



      <section className="snap-start flex flex-col items-center justify-center px-6 bg-background pt-16">

        {/* Headline + Subtext */}
        <div className="text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-headings mb-3">
            {t("citiesChart.headline")}
          </h2>
          <p className="text-text/70 text-lg">{t("citiesChart.subtext")}</p>
        </div>
      </section>


      <div style={{ height: '400px', position: 'relative' }}>
        <CircularGallery bend={3} textColor="#000000" borderRadius={0.05} scrollEase={0.02}
          bend={1}
          borderRadius={0.1}
          scrollSpeed={2}
          scrollEase={0.05}
        />
      </div>

      {/* contact us */}
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