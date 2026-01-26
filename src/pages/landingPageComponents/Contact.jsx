import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useInView } from "motion/react";
import { FaChevronDown } from "react-icons/fa";

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

export default function ContactCTASection({ scrollToComponent }) {
  const { t } = useTranslation("contact");
  const [openIndex, setOpenIndex] = useState(null);

  const contactDetails = [
    {
      id: "mail",
      icon: (
        <Mail
          className="h-8 w-8 sm:h-6 sm:w-6 text-[#0091D5]"
          aria-hidden="true"
        />
      ),
      text: t("details.email", { defaultValue: "contact@logixjunction.com" }),
      // Redirects directly to Gmail's compose screen
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=contact@logixjunction.com",
    },
    {
      id: "phone",
      // 1. Applied brand color and responsive size
      icon: (
        <Phone
          className="h-8 w-8 sm:h-6 sm:w-6 text-[#0091D5]"
          aria-hidden="true"
        />
      ),
      text: t("details.phone", { defaultValue: "+91 87997 82389" }),
      href: "tel:+918799782389",
    },
    {
      id: "address",
      // 1. Applied alternate brand color and responsive size
      icon: (
        <MapPin
          className="h-8 w-8 sm:h-6 sm:w-6 text-[#E32636]"
          aria-hidden="true"
        />
      ),
      text: t("details.address", { defaultValue: "New Delhi, India" }),
    },
  ];

  const contactFaqs = [
    {
      question: "How do I track my shipment?",
      answer: "You can track your shipment in real-time using our tracking portal. Simply enter your shipment ID or order number to get live updates on your delivery status.",
    },
    {
      question: "What are your service areas?",
      answer: "We serve across India's industrial belt with coverage in major cities and industrial zones. Visit our coverage page or contact us to check if we serve your area.",
    },
    {
      question: "How can I get a quote?",
      answer: "Click the 'Get Started Now' button above, fill in your shipment details, and you'll receive an instant quote. You can also call us directly at +91 87997 82389.",
    },
  ];

  const handleFAQClick = useCallback((index) => {
    setOpenIndex(openIndex === index ? null : index);
  }, [openIndex]);

  return (
    // 2. Matched section background and padding
    <section className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl text-left pl-4 sm:pl-6 lg:pl-8">
          {/* 3. Matched header text styles and sizes */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#001F3F]">
            {t("header.title", { defaultValue: "Get in Touch" })}
          </h2>
          <p className="text-sm sm:text-lg text-[#001F3F]/70 max-w-2xl mt-3">
            {t("header.subtitle", {
              defaultValue:
                "We're here to help. Contact us by email, phone, or stop by our office.",
            })}
          </p>
        </div>

        {/* Contact Info */}
        {/* 4. Aligned to left with flex-start and navbar padding */}
        <div className="flex flex-col justify-start items-start gap-4 sm:gap-10 mt-8 sm:mt-12 pl-4 sm:pl-6 lg:pl-8">
          {contactDetails.map((detail) => (
            // 5. Matched mobile gap
            <div
              key={detail.id}
              className="flex items-center gap-3 font-medium"
            >
              {detail.icon}
              {detail.href ? (
                <a
                  href={detail.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  // 6. Matched text colors
                  className="text-base text-[#001F3F] hover:text-[#0091D5] transition"
                >
                  {detail.text}
                </a>
              ) : (
                // 6. Matched text colors
                <span className="text-base text-[#001F3F]/80">
                  {detail.text}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        {/* 7. Aligned button to left with navbar padding */}
        <div className="flex flex-col sm:flex-row justify-start items-start gap-4 mt-8 sm:mt-12 pl-4 sm:pl-6 lg:pl-8">
          {/* 8. Replaced custom <Button> with standard <Link>
                 Styled to match Hero.js CTA button
                 Made w-full on mobile to match Services.js button
           */}
          <Link
            onClick={scrollToComponent}
            className="w-full sm:w-auto px-8 py-3 bg-[#E32636] hover:cursor-pointer text-white rounded-full font-semibold transition hover:opacity-80 text-sm sm:text-base"
          >
            {t("buttons.getStarted", { defaultValue: "Create a Shipment" })}
          </Link>
        </div>

        {/* FAQs Section */}
        <div className="mt-16 sm:mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#001F3F]">
              FAQs
            </h3>
            <Link
              to="/faq"
              className="text-sm sm:text-base text-[#0091D5] hover:text-[#0091D5]/80 font-semibold transition"
            >
              More FAQs →
            </Link>
          </div>
          <div className="space-y-4">
            {contactFaqs.map((faq, index) => (
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
      </div>
    </section>
  );
}