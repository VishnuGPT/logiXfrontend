import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import truckVideo from '../../assets/truck2.mp4'; // Renamed for clarity
import deliverVideo from '../../assets/deliver.mp4'; // New video import
export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation("hero");

  return (
    // 1. Set the section to relative to contain the absolute children
    <section className="relative text-background overflow-hidden">
      
      {/* 2. The Video Background */}
      {/* It's positioned absolutely to fill the section and has the lowest z-index */}
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover z-0" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={truckVideo} type="video/mp4" />
      </video>

      {/* 3. The "Blue Screen" Overlay */}
      {/* This div sits on top of the video (z-10) but below the text (z-20). */}
      {/* You can change bg-blue-700/60 to any blue and opacity you like. */}
      {/* e.g., bg-blue-900/50 (darker blue, 50% opacity) */}
      <div className="absolute top-0 left-0 w-full h-full z-10" />

      {/* 4. Your Text Content */}
      {/* This div is set to relative and a higher z-index (z-20) to ensure it's on top. */}
      <div className="relative z-20 max-w-7xl mx-auto flex items-center min-h-screen px-6 py-24">
        <div className="sm:px-20 max-w-2xl">
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-xl text-background/80 mb-10">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/create-shipment")}
              className="px-8 py-3 bg-accent-cta hover:cursor-pointer text-white rounded-full font-semibold transition hover:opacity-80"
            >
              Ship Order Now!!
            </button>
          </div>

        </div>
        <div>
          <div></div>
        </div>
        {/* We no longer need the other div, as the video is the background */}
      </div>
    </section>
  );
}