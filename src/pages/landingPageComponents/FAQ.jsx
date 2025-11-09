import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa"; // 1. Imported a better icon

export default function FAQ() {
  const { t } = useTranslation("faq");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Default value in case t() fails
  const faqs = t("faqs", { returnObjects: true }) || [];

  return (
    // 2. Applied matching section styles (background, padding)
    <section
      id="faq"
      className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20"
    >
      {/* 3. Applied matching container styles (width, padding) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4. Applied matching Header styles */}
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

        {/* 5. Applied matching gap for mobile */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            // 6. Styled each item as a "card" to match your design
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#001F3F]/10 shadow-sm"
            >
              {/* 7. Clickable header area with matching padding */}
              <div
                className="flex justify-between items-center cursor-pointer p-4 sm:p-6"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {/* 8. Question text matches mobile "title" style */}
                <h3
                  id={`faq-question-${index}`}
                  className="text-base font-semibold text-[#001F3F]"
                >
                  {faq.question}
                </h3>
                {/* 9. Replaced +/- with animated chevron icon */}
                <FaChevronDown
                  className={`
                    text-base text-[#0091D5] shrink-0
                    transition-transform duration-300
                    ${openIndex === index ? "rotate-180" : "rotate-0"}
                  `}
                  aria-hidden
                />
              </div>

              {/* 10. Animation Wrapper:
                  - Uses max-height for smooth slide-down/up.
                  - No more conditional rendering (&&), just CSS.
              */}
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`
                  overflow-hidden transition-[max-height] duration-500 ease-in-out
                  ${openIndex === index ? "max-h-[500px]" : "max-h-0"}
                `}
              >
                {/* 11. Answer text:
                    - Matches mobile "description" style (text-xs).
                    - Has horizontal/bottom padding.
                */}
                <div className="text-xs sm:text-sm text-[#001F3F]/80 leading-relaxed px-4 pb-4 sm:px-6 sm:pb-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}