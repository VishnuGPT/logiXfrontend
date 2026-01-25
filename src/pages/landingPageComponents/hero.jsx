import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // 1. Import motion
import logixjunction from "../../assets/j2.mp4";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";

export default function Hero({ scrollToComponent, onOpenCallModal }) {
  const navigate = useNavigate();
  const { t } = useTranslation("hero");

  return (
    <>
      <section className="relative text-background overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={logixjunction} type="video/mp4" />
        </video>

        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001F3F]/50 via-[#001F3F]/40 to-[#001F3F]/60 z-10"></div>

        {/* Text and Buttons */}
        <div className="relative z-20 max-w-7xl mx-auto flex items-center min-h-[80vh] sm:min-h-screen px-6 py-20 sm:py-24">
          <div className="sm:px-20 max-w-2xl space-y-8 text-center sm:text-left">
            {/* 2. Animate the Heading */}
            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span
                className="absolute inset-0 blur-2xl opacity-60 bg-[radial-gradient(ellipse_at_center,_rgba(0,145,213,0.8),_rgba(227,38,54,0.4)_60%,_transparent_100%)]"
                aria-hidden="true"
              ></span>
              <h1 className="relative text-3xl md:text-6xl font-extrabold text-white drop-shadow-[0_0_25px_rgba(0,145,213,0.6)]">
                {t("title")}
              </h1>
            </motion.div>

            {/* 3. Animate the Subtitle */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }} // Increased delay
            >
              <span
                className="absolute inset-0 blur-xl opacity-50 bg-[radial-gradient(circle_at_40%_70%,_rgba(0,145,213,0.7),_rgba(0,145,213,0.2)_70%,_transparent_100%)]"
                aria-hidden="true"
              ></span>
              <p className="relative text-1xl md:text-2xl font-medium text-white drop-shadow-[0_0_20px_rgba(0,145,213,0.6)]">
                {t("subtitle")}
              </p>
            </motion.div>

            {/* 4. Animate the Button Group */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4 justify-center sm:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }} // Even later delay
            >
              <button
                onClick={scrollToComponent}
                className="px-8 py-3 bg-[#E32636] hover:cursor-pointer text-white rounded-full font-semibold transition hover:opacity-80"
              >
                Ship Order Now!!
              </button>
              <button
                onClick={onOpenCallModal}
                className="px-8 py-3 bg-[#0091D5] hover:cursor-pointer text-white rounded-full font-semibold transition hover:opacity-80"
              >
                Get a Call From Us
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative bg-[linear-gradient(180deg,rgba(0,145,213,0.06),rgba(227,38,54,0.04))]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(900px 500px at 15% 20%, rgba(0,145,213,0.22), transparent 60%), radial-gradient(900px 520px at 85% 30%, rgba(227,38,54,0.18), transparent 62%), radial-gradient(900px 520px at 60% 90%, rgba(46,204,113,0.14), transparent 60%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-10 sm:pt-14 pb-4">
          <div className="flex flex-col items-center text-center">
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#001F3F]">
              Why Choose Us
            </h2>
            <p className="mt-3 max-w-3xl text-base sm:text-lg text-[#001F3F]/75">
              A single marketplace for freight, courier, and relocation—built for B2B speed,
              reliability, and visibility.
            </p>
          </div>
        </div>
      </section>

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
    </>
  );
}
