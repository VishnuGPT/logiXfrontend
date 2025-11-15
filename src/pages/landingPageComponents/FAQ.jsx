import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; // 1. Import motion and AnimatePresence

export default function FAQ() {
  const { t } = useTranslation("faq");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = t("faqs", { returnObjects: true }) || [];

  return (
    <section
      id="faq"
      className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#001F3F]">
            {t("header.title", {
              defaultValue: "Frequently Asked Questions",
            })}
          </h2>
          <p className="text-sm sm:text-lg text-[#001F3F]/70 max-w-2xl mx-auto mt-3">
            {t("header.subtitle", {
              defaultValue: "Have questions? We’ve got answers.",
            })}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#001F3F]/10 shadow-sm overflow-hidden" // 2. Add overflow-hidden
            >
              {/* Clickable header area */}
              <div
                className="flex justify-between items-center cursor-pointer p-4 sm:p-6"
                onClick={() => setOpenIndex(openIndex === index ? null : index)} // 3. Simplified toggle
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3
                  id={`faq-question-${index}`}
                  className="text-base font-semibold text-[#001F3F]"
                >
                  {faq.question}
                </h3>
                {/* 4. Animate the chevron */}
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <FaChevronDown
                    className="text-base text-[#0091D5]"
                    aria-hidden
                  />
                </motion.div>
              </div>

              {/* 5. Animated Content Area */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    // 6. Define animation variants
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" }, // Animates TO auto height
                      collapsed: { opacity: 0, height: 0 },   // Animates FROM auto height
                    }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    {/* 7. Removed the CSS max-height wrapper */}
                    <div className="text-xs sm:text-sm text-[#001F3F]/80 leading-relaxed px-4 pb-4 sm:px-6 sm:pb-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}