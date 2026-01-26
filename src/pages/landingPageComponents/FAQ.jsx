import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence, useInView } from "motion/react";

const AnimatedFAQItem = ({ faq, index, isOpen, onClick, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-[#001F3F]/10 shadow-sm overflow-hidden"
    >
      {/* Clickable header area */}
      <div
        className="flex justify-between items-center cursor-pointer p-4 sm:p-6"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <h3
          id={`faq-question-${index}`}
          className="text-base font-semibold text-[#001F3F]"
        >
          {faq.question}
        </h3>
        {/* Animate the chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <FaChevronDown
            className="text-base text-[#0091D5]"
            aria-hidden
          />
        </motion.div>
      </div>

      {/* Animated Content Area */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="text-xs sm:text-sm text-[#001F3F]/80 leading-relaxed px-4 pb-4 sm:px-6 sm:pb-6">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQ() {
  const { t } = useTranslation("faq");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = t("faqs", { returnObjects: true }) || [];

  const handleFAQClick = useCallback((index) => {
    setOpenIndex(openIndex === index ? null : index);
  }, [openIndex]);

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
              defaultValue: "Have questions? We've got answers.",
            })}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AnimatedFAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => handleFAQClick(index)}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
}