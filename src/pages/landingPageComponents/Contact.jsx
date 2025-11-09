import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContactCTASection({ scrollToComponent }) {
  const { t } = useTranslation("contact"); // using contact.json namespace

  const contactDetails = [
    {
      id: "mail",
      // 1. Applied brand color and responsive size
      icon: (
        <Mail
          className="h-8 w-8 sm:h-6 sm:w-6 text-[#0091D5]"
          aria-hidden="true"
        />
      ),
      text: t("details.email", { defaultValue: "contact@logixjunction.com" }),
      href: "mailto:contact@logixjunction.com",
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

  return (
    // 2. Matched section background and padding
    <section className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto">
          {/* 3. Matched header text styles and sizes */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#001F3F]">
            {t("header.title", { defaultValue: "Get in Touch" })}
          </h2>
          <p className="text-sm sm:text-lg text-[#001F3F]/70 max-w-2xl mx-auto mt-3">
            {t("header.subtitle", {
              defaultValue:
                "We're here to help. Contact us by email, phone, or stop by our office.",
            })}
          </p>
        </div>

        {/* Contact Info */}
        {/* 4. Matched mobile gap and top margin */}
        <div className="flex flex-col justify-center items-center gap-4 sm:gap-10 mt-8 sm:mt-12">
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
        {/* 7. Matched mobile margin */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 sm:mt-12">
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
      </div>
    </section>
  );
}