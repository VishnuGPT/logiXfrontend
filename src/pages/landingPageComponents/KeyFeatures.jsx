import React from "react";
import { FaTruckMoving, FaMapMarkedAlt, FaRoute, FaGavel } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // 1. Import motion

export default function KeyFeatures() {
  const { t } = useTranslation("keyFeatures");
  const features = t("features", { returnObjects: true }) || [];
  const iconColors = ["#0091D5", "#E32636"];
  const icons = [
    <FaTruckMoving key="truck" className="h-8 w-8 sm:h-6 sm:w-6" />,
    <FaMapMarkedAlt key="map" className="h-8 w-8 sm:h-6 sm:w-6" />,
    <FaRoute key="route" className="h-8 w-8 sm:h-6 sm:w-6" />,
    <FaGavel key="gavel" className="h-8 w-8 sm:h-6 sm:w-6" />,
  ];

  // 2. Variants for the container (to stagger children)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation of children by 0.1s
      },
    },
  };

  // 3. Variants for the items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section
      id="features"
      className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Section Header */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#001F3F]">
          {t("header.title", { defaultValue: "Why Choose Us?" })}
        </h2>
        <p className="text-sm sm:text-lg text-[#001F3F]/70 max-w-2xl mx-auto mt-3 mb-8 sm:mb-16">
          {t("header.subtitle", {
            defaultValue:
              "We provide more than just logistics; we deliver promises and build partnerships.",
          })}
        </p>

        {/* 4. Apply container variants and viewport animation */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Animates when it enters the viewport
          viewport={{ once: true, amount: 0.3 }} // Animate once, when 30% is visible
        >
          {features.map((feature, index) => (
            // 5. Apply item variants and springy hover effect
            <motion.div
              key={feature.title || index}
              variants={itemVariants} // This will be animated by the parent
              whileHover={{ y: -8, scale: 1.02 }} // Replaces Tailwind hover
              transition={{ type: "spring", stiffness: 150, damping: 10 }}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-[#001F3F]/10 text-left 
                         shadow-sm" // Removed sm:hover:-translate-y-1 & shadow-lg
            >
              <div className="flex flex-col items-start gap-3 sm:gap-4">
                <div
                  className="flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-xl bg-white shadow-sm border border-[#001F3F]/10"
                  aria-hidden
                >
                  <span style={{ color: iconColors[index % iconColors.length] }}>
                    {icons[index % icons.length]}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-semibold text-[#001F3F]">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-base text-[#001F3F]/90 leading-tight sm:leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}