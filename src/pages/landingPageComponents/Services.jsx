import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaTruckLoading, FaPeopleCarry } from "react-icons/fa";
import logo from "../../assets/LOGO.png";

export default function Services() {
  const navigate = useNavigate();
  const { t } = useTranslation("services");

  const services = [
    {
      id: "ftl",
      icon: <FaTruckLoading className="h-8 w-8 text-[#E32636]" />,
      title: "FTL (Full Truckload)",
      desc: "Dedicated full-truck shipments ensuring speed, reliability, and optimized routing.",
      btnText: "Request FTL Quote",
      color: "#E32636",
    },
    {
      id: "packers",
      icon: <FaPeopleCarry className="h-8 w-8 text-[#0091D5]" />,
      title: "Packers & Movers",
      desc: "Safe and professional packing, moving, and doorstep delivery for homes and offices.",
      btnText: "Get Packers Quote",
      color: "#0091D5",
    },
  ];

  return (
    <section
      id="services"
      className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-20 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#001F3F] mb-4">
          {t("header.title", { defaultValue: "Our Core Services" })}
        </h2>
        <p className="text-lg text-[#001F3F]/70 max-w-2xl mx-auto mb-16">
          {t("header.subtitle", {
            defaultValue:
              "From nationwide freight movement to personalized shifting — we’ve got it all covered.",
          })}
        </p>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-8 rounded-2xl border border-[#001F3F]/10 shadow-sm 
                         hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-start gap-5 text-left">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white shadow-sm border border-[#001F3F]/10">
                  {service.icon}
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#001F3F]">
                    {service.title}
                  </h3>
                  <p className="text-[#001F3F]/80 mt-2 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => navigate(`/services/form?service=${service.id}`)}
                    className="px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.btnText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Footer */}
        <div className="flex items-center justify-center gap-3 mt-16 opacity-90">
          <img src={logo} alt="LogiXjunction logo" className="w-10 h-10 object-contain" />
          <span className="text-sm font-semibold text-[#0091D5]">
            LogiXjunction — Smarter Logistics, Simplified.
          </span>
        </div>
      </div>
    </section>
  );
}
