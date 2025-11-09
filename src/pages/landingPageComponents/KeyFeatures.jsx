import React from "react";
import { FaTruckMoving, FaMapMarkedAlt, FaRoute, FaGavel } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function KeyFeatures() {
  const { t } = useTranslation("keyFeatures");

  // Ensure translation returns objects
  const features = t("features", { returnObjects: true }) || [];

  // 1. Define the brand colors from Services component
  const iconColors = ["#0091D5", "#E32636"]; // Blue and Red

  // 2. Applied responsive icon sizes from Services component
  const icons = [
    <FaTruckMoving key="truck" className="h-8 w-8 sm:h-6 sm:w-6" />,
    <FaMapMarkedAlt key="map" className="h-8 w-8 sm:h-6 sm:w-6" />,
    <FaRoute key="route" className="h-8 w-8 sm:h-6 sm:w-6" />,
    <FaGavel key="gavel" className="h-8 w-8 sm:h-6 sm:w-6" />,
  ];

  return (
    <section
      id="features"
      // 3. Matched background AND padding from Services component
      className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Section Header - Matched Services component header sizes */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#001F3F]">
          {t("header.title", { defaultValue: "Why Choose Us?" })}
        </h2>
        <p className="text-sm sm:text-lg text-[#001F3F]/70 max-w-2xl mx-auto mt-3 mb-8 sm:mb-16">
          {t("header.subtitle", {
            defaultValue:
              "We provide more than just logistics; we deliver promises and build partnerships.",
          })}
        </p>

        {/* Features Grid - Matched mobile gap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title || index}
              // 5. Matched card padding (p-4 for mobile)
              className="bg-white p-4 sm:p-6 rounded-2xl border border-[#001F3F]/10 text-left 
                       transition-all duration-300 sm:hover:-translate-y-1 sm:hover:shadow-lg"
            >
              {/* 6. Matched mobile gap */}
              <div className="flex flex-col items-start gap-3 sm:gap-4">
                {/* 7. Matched icon container size (w-16 h-16 for mobile) */}
                <div
                  className="flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-xl bg-white shadow-sm border border-[#001F3F]/10"
                  aria-hidden
                >
                  <span style={{ color: iconColors[index % iconColors.length] }}>
                    {icons[index % icons.length]}
                  </span>
                </div>

                {/* 8. Matched font size (text-base for mobile) */}
                <h3 className="text-base sm:text-xl font-semibold text-[#001F3F]">
                  {feature.title}
                </h3>
                {/* 9. Matched font size (text-xs for mobile) and leading */}
                <p className="text-xs sm:text-base text-[#001F3F]/90 leading-tight sm:leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}