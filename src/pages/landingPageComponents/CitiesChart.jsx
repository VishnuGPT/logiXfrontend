import React from "react";
import { useTranslation } from "react-i18next";

const cities = [
  { key: "ahmedabad", img: "/cities/ahmedabad.jpg" },
  { key: "bangalore", img: "/cities/bangalore.jpg" },
  { key: "chandigarh", img: "/cities/chandigarh.jpg" },
  { key: "chennai", img: "/cities/chennai.jpg" },
  { key: "coimbatore", img: "/cities/coimbatore.jpg" },
  { key: "hyderabad", img: "/cities/hyderabad.jpg" },
  { key: "delhi", img: "/cities/delhi.jpg" },
  { key: "indore", img: "/cities/indore.jpg" },
  { key: "kanpur", img: "/cities/kanpur.jpg" },
  { key: "jaipur", img: "/cities/jaipur.jpg" },
  { key: "kochi", img: "/cities/kochi.jpg" },
  { key: "lucknow", img: "/cities/lucknow.jpg" },
  { key: "kolkata", img: "/cities/kolkata.jpg" },
  { key: "ludhiana", img: "/cities/ludhiana.jpg" },
  { key: "mumbai", img: "/cities/mumbai.jpg" },
  { key: "nagpur", img: "/cities/nagpur.jpg" },
  { key: "nashik", img: "/cities/nashik.jpg" },
  { key: "pune", img: "/cities/pune.jpg" },
  { key: "surat", img: "/cities/surat.jpg" },
  { key: "trivandrum", img: "/cities/trivandrum.jpg" },
  { key: "vadodara", img: "/cities/vadodara.jpg" },
  { key: "visakhapatnam", img: "/cities/visakhapatnam.jpg" },
];

// --- UPDATED ANIMATION ---
const scrollAnimation = `
  @keyframes infinite-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .scroller-inner {
    /* This is the default (desktop) speed */
    animation: infinite-scroll 25s linear infinite;
  }

  /* This media query targets screens 640px or smaller */
  @media (max-width: 640px) {
    .scroller-inner {
      /* This overrides the duration on mobile */
      animation-duration: 5s; 
    }
  }
`;
// --- END OF UPDATE ---

export default function CitiesChart() {
  const { t } = useTranslation("citiesChart");

  return (
    <section className="snap-start flex flex-col items-center justify-center px-6 py-16 bg-background">
      {/* 2. Add the <style> tag to inject the animation */}
      <style>{scrollAnimation}</style>

      {/* Headline + Subtext */}
      <div className="text-center max-w-2xl mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-headings mb-3">
          {t("citiesChart.headline")}
        </h2>
        <p className="text-text/70 text-lg">{t("citiesChart.subtext")}</p>
      </div>

      {/* Looping Scroller Wrapper */}
      <div
        className="w-full max-w-6xl mx-auto overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {/* 3. Use the "scroller-inner" class */}
        <div className="flex scroller-inner">
          {/* Render the list of cities TWICE for the seamless loop */}
          {[...cities, ...cities].map((city, index) => (
            <div
              key={`${city.key}-${index}`}
              className="flex flex-col items-center text-center group shrink-0 mx-4"
            >
              <div className="w-36 h-36 rounded-xl overflow-hidden shadow-md border border-black/10 mb-3">
                <img
                  src={city.img}
                  alt={t(`citiesChart.cities.${city.key}`)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-medium text-text">
                {t(`citiesChart.cities.${city.key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}