import React, { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import ftlImage from "../../assets/ftl.png";
import packersImage from "../../assets/packers.png";
import ptlImage from "../../assets/ptl.png";

// Note: Your memoized ServiceCard component was removed in the last file,
// but the desktop version had it. I am using the desktop version as it
// was more advanced.

export default function Services({onOpenCallModal}) {
  const navigate = useNavigate();
  const { t } = useTranslation("services");

  const services = [
    {
      id: "ftl",
      image: ftlImage,
      alt: t("ftl.alt", { defaultValue: "FTL truck on highway" }),
      title: t("ftl.title", { defaultValue: "FTL (Full Truckload)" }),
      desc: t("ftl.desc", {
        defaultValue:
          "Dedicated full-truck shipments ensuring speed, reliability, and optimized routing.",
      }),
      btnText: t("ftl.btn", { defaultValue: "Request FTL Quote" }),
      color: "#E32636",
    },
    {
      id: "ptl",
      image: ptlImage,
      alt: t("ptl.alt", { defaultValue: "PTL cargo being loaded" }),
      title: t("ptl.title", { defaultValue: "PTL (Part Truckload)" }),
      desc: t("ptl.desc", {
        defaultValue:
          "Cost-effective shipping for partial loads, consolidating your goods with others.",
      }),
      btnText: t("ptl.btn", { defaultValue: "Request PTL Quote" }),
      color: "#F39C12",
    },
    {
      id: "packers-movers",
      image: packersImage,
      alt: t("packers.alt", { defaultValue: "Packers and movers" }),
      title: t("packers.title", { defaultValue: "Packers & Movers" }),
      desc: t("packers.desc", {
        defaultValue:
          "Safe and professional packing, moving, and doorstep delivery for homes and offices.",
      }),
      btnText: t("packers.btn", { defaultValue: "Get Packers Quote" }),
      color: "#0091D5",
    },
  ];

  const handleSelect = useCallback(
    (serviceId) => {
      if(serviceId=="ptl"){
        console.log("PTL selected - opening call modal");
        onOpenCallModal();
        return;
      }
      else{
        navigate(`/services/${encodeURIComponent(serviceId)}`);
      }
    },
    [navigate, onOpenCallModal]
  );

  return (
    <section
      id="services"
      className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#001F3F]">
            {t("header.title", { defaultValue: "Our Core Services" })}
          </h2>
          <p className="text-sm sm:text-lg text-[#001F3F]/70 max-w-2xl mx-auto mt-3">
            {t("header.subtitle", {
              defaultValue:
                "From nationwide freight movement to personalized shifting — we’ve got it all covered.",
            })}
          </p>
        </div>

        {/* Mobile version */}
        <div className="sm:hidden flex flex-col gap-4">
          {services.map((service) => (
            <article
              key={service.id}
              className="bg-white rounded-2xl border border-[#001F3F]/8 shadow-sm p-4"
              aria-labelledby={`svc-${service.id}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-24 h-24 rounded-xl bg-[rgba(0,0,0,0.03)] shrink-0 overflow-hidden"
                  style={{ border: "1px solid rgba(0,31,63,0.06)" }}
                >
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    id={`svc-${service.id}`}
                    className="text-base font-semibold text-[#001F3F] whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#001F3F]/70 mt-1 leading-tight">
                    {service.desc}
                  </p>

                  <button
                  
                    onClick={() =>{
                      if(service.id==="ptl"){
                        console.log("PTL selected - opening call modal");
                        onOpenCallModal();
                        return;
                      }
                       navigate(`/services/${service.id}`)}}
                    className="mt-3 w-full text-sm font-semibold py-2 rounded-full text-white"
                    style={{ backgroundColor: service.color }}
                    aria-label={service.btnText}
                  >
                    {service.btnText}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop / tablet: enhanced service cards */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((s) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              // Animate when it scrolls into view
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{
                y: -8,
                boxShadow: `0 10px 25px -8px ${s.color}40`,
                borderColor: `${s.color}60`,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 15 }}
              className="group bg-white p-8 rounded-3xl border border-[#001F3F]/10 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#001F3F]/40"
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(s.id)}
            >
              <div className="flex flex-col items-center text-center h-full">
                {/* ... card content ... */}
                <div
                  className="relative w-24 h-24 rounded-2xl overflow-hidden mb-6 border border-transparent bg-gradient-to-br from-[#001F3F]/10 to-transparent group-hover:from-[#001F3F]/20"
                  aria-hidden
                >
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="w-full h-full object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3
                  id={`svc-${s.id}`}
                  className="text-xl font-bold text-[#001F3F] mb-3 truncate"
                  title={s.title}
                >
                  {s.title}
                </h3>
                <p className="text-[#001F3F]/75 text-sm leading-relaxed mb-6 line-clamp-3">
                  {s.desc}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(s.id);
                  }}
                  className="mt-auto px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 group-hover:scale-105"
                  style={{ backgroundColor: s.color }}
                  aria-label={s.btnText}
                >
                  {s.btnText}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}