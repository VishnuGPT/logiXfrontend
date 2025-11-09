import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logixjunction from "../../assets/j2.mp4";

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation("hero");

  return (
    <section className="relative text-background overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={logixjunction} type="video/mp4" />
      </video>

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001F3F]/50 via-[#001F3F]/40 to-[#001F3F]/60 z-10"></div>

      {/* Text and Buttons */}
      <div className="relative z-20 max-w-7xl mx-auto flex items-center min-h-screen px-6 py-24">
        <div className="sm:px-20 max-w-2xl space-y-8">
          {/* Title with red-blue aura */}
          <div className="relative inline-block">
            {/* Aura */}
            <span
              className="absolute inset-0 blur-2xl opacity-60 bg-[radial-gradient(ellipse_at_center,_rgba(0,145,213,0.8),_rgba(227,38,54,0.4)_60%,_transparent_100%)]"
              aria-hidden="true"
            ></span>

            {/* Heading */}
            <h1 className="relative text-6xl font-extrabold text-white drop-shadow-[0_0_25px_rgba(0,145,213,0.6)]">
              {t("title")}
            </h1>
          </div>

          {/* Subtitle with soft blue glow */}
          <div className="relative">
            <span
              className="absolute inset-0 blur-xl opacity-50 bg-[radial-gradient(circle_at_40%_70%,_rgba(0,145,213,0.7),_rgba(0,145,213,0.2)_70%,_transparent_100%)]"
              aria-hidden="true"
            ></span>
            <p className="relative text-xl font-medium text-white drop-shadow-[0_0_20px_rgba(0,145,213,0.6)]">
              {t("subtitle")}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => navigate("/create-shipment")}
              className="px-8 py-3 bg-[#E32636] hover:cursor-pointer text-white rounded-full font-semibold transition hover:opacity-80"
            >
              Ship Order Now!!
            </button>
            <button
              onClick={() => navigate("/track-shipment")}
              className="px-8 py-3 bg-[#0091D5] hover:cursor-pointer text-white rounded-full font-semibold transition hover:opacity-80"
            >
              Get a Call From Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
