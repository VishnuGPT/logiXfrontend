import React from "react";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup"; // 1. Import CountUp
import { motion } from "framer-motion"; // 2. Import motion

export default function Testimonials() {
  const { t } = useTranslation("testimonials");

  // 3. Define animation variants for the cards
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // 4. Get stat values (provide defaults)
  const stats = t("stats", { returnObjects: true }) || {};
  const fleetOwners = stats.trustedFleetOwners?.label || "5,000+";
  const shipperCoverage = stats.shipperCoverage?.label || "28,000+";
  const platformRating = stats.platformRating?.label || "4.8/5";

  // 5. Helper to extract number from string like "5,000+"
  const getEndValue = (label) => {
    const num = parseFloat(label.replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  };
  
  const getSuffix = (label) => {
     if (label.includes('+')) return "+";
     if (label.includes('/')) return "/5";
     return "";
  }

  return (
    <section className="py-12 px-6 lg:px-16 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title & Subtitle */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("testimonials.title")}
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          {t("testimonials.subtitle")}
        </p>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Ravi */}
          <motion.div
            className="bg-white rounded-2xl shadow p-6 text-left"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <p className="text-gray-700 italic mb-4">
              “{t("testimonials.users.ravi.quote")}”
            </p>
            <h4 className="font-semibold text-gray-900">
              – {t("testimonials.users.ravi.role")}
            </h4>
          </motion.div>

          {/* Ankita */}
          <motion.div
            className="bg-white rounded-2xl shadow p-6 text-left"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5, delay: 0.1 }} // Slight delay
          >
            <p className="text-gray-700 italic mb-4">
              “{t("testimonials.users.ankita.quote")}”
            </p>
            <h4 className="font-semibold text-gray-900">
              – {t("testimonials.users.ankita.role")}
            </h4>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white rounded-2xl shadow p-6"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              <CountUp end={getEndValue(fleetOwners)} duration={2.5} enableScrollSpy />
              {getSuffix(fleetOwners)}
            </h3>
            <p className="text-gray-600">
              {t("stats.trustedFleetOwners.desc")}
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow p-6"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              <CountUp end={getEndValue(shipperCoverage)} duration={2.5} enableScrollSpy />
              {getSuffix(shipperCoverage)}
            </h3>
            <p className="text-gray-600">
              {t("stats.shipperCoverage.desc")}
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow p-6"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              <CountUp end={getEndValue(platformRating)} duration={2.5} decimals={1} enableScrollSpy />
              {getSuffix(platformRating)}
            </h3>
            <p className="text-gray-600">
              {t("stats.platformRating.desc")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}