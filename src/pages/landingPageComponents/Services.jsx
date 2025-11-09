import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { FaTruckLoading, FaPeopleCarry } from "react-icons/fa"; // REMOVED
import ftlImage from "../../assets/ftl.png"; // ADDED - (Assuming you save it here)
import packersImage from "../../assets/packers.png"; // ADDED - (Assuming you save it here)

export default function Services() {
  const navigate = useNavigate();
  const { t } = useTranslation("services");

  const services = [
    {
      id: "ftl",
      // UPDATED icon to be an <img> tag
      icon: (
        <img
          src={ftlImage}
          alt="FTL Service"
          className="w-full h-full object-cover"
        />
      ),
      title: "FTL (Full Truckload)",
      desc: "Dedicated full-truck shipments ensuring speed, reliability, and optimized routing.",
      btnText: "Request FTL Quote",
      color: "#E32636",
    },
    {
      id: "packers",
      // UPDATED icon to be an <img> tag
      icon: (
        <img
          src={packersImage}
          alt="Packers & Movers Service"
          className="w-full h-full object-cover"
        />
      ),
      title: "Packers & Movers",
      desc: "Safe and professional packing, moving, and doorstep delivery for homes and offices.",
      btnText: "Get Packers Quote",
      color: "#0091D5",
    },
  ];

  return (
    <section
      id="services"
      className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Mobile: Stacked vertical cards */}
        <div className="sm:hidden flex flex-col gap-4">
          {services.map((service) => (
            <article
              key={service.id}
              className="bg-white rounded-2xl border border-[#001F3F]/8 shadow-sm p-4"
              aria-labelledby={`svc-${service.id}`}
            >
              <div className="flex items-start gap-3">
                {/* UPDATED container div for mobile - w-24 h-24 */}
                <div
                  className="w-24 h-24 rounded-xl bg-[rgba(0,0,0,0.03)] shrink-0 overflow-hidden" // Increased size
                  style={{ border: "1px solid rgba(0,31,63,0.06)" }}
                >
                  {/* UPDATED - now just renders the img from the array */}
                  {service.icon}
                </div>

                <div className="flex-1">
                  <h3
                    id={`svc-${service.id}`}
                    className="text-base font-semibold text-[#001F3F]"
                  >
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#001F3F]/70 mt-1 leading-tight">
                    {service.desc}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/services/form?service=${service.id}`)
                    }
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

        {/* Desktop / tablet: nice grid */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-8 rounded-2xl border border-[#001F3F]/10 shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-6">
                {/* UPDATED container div for desktop - w-20 h-20 */}
                <div
                  className="w-20 h-20 rounded-xl bg-white shadow-sm border border-[#001F3F]/10 overflow-hidden" // Increased size
                  aria-hidden
                >
                  {/* UPDATED - now just renders the img from the array */}
                  {service.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-[#001F3F]">
                    {service.title}
                  </h3>
                  <p className="text-[#001F3F]/80 mt-3 leading-relaxed">
                    {service.desc}
                  </p>

                  <div className="pt-4">
                    <button
                      onClick={() =>
                        navigate(`/services/form?service=${service.id}`)
                      }
                      className="px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-95"
                      style={{ backgroundColor: service.color }}
                    >
                      {service.btnText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}