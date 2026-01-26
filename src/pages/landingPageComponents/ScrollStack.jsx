import React, { useEffect, useMemo, useRef, useState } from "react";

const ACCENTS = {
  blue: {
    glow: "from-[#0091D5]/35 via-[#0091D5]/10 to-transparent",
    bar: "from-[#0091D5] via-[#00B7FF] to-[#2ECC71]",
  },
  red: {
    glow: "from-[#E32636]/30 via-[#E32636]/10 to-transparent",
    bar: "from-[#E32636] via-[#FF5B6B] to-[#F39C12]",
  },
  emerald: {
    glow: "from-[#2ECC71]/28 via-[#2ECC71]/10 to-transparent",
    bar: "from-[#2ECC71] via-[#00D39A] to-[#0091D5]",
  },
};

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function parseVhPercent(value, vh) {
  if (typeof value === "string" && value.trim().endsWith("%")) {
    const num = Number.parseFloat(value);
    if (Number.isFinite(num)) return (num / 100) * vh;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function ScrollStackItem({ children, className = "", accent = "blue" }) {
  const a = ACCENTS[accent] ?? ACCENTS.blue;
  return (
    /* Added bg-white and backdrop-blur-xl */
    <div className={`relative overflow-hidden rounded-3xl min-h-[400px] shadow-xl bg-white/90 backdrop-blur-xl border border-white/20 ${className}`}>

      {/* Subtle accent glow */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.glow} opacity-40`} />

      {/* Top accent bar */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${a.bar}`} />

      <div className="relative p-6 sm:p-10 text-[#001F3F]">
        {children}
      </div>
    </div>
  );
} export default function ScrollStack({
  children,
  className = "",
  itemDistance = 450,
  itemScale = 0.04,
  itemStackDistance = 25,
  stackPosition = "50%",
  scaleEndPosition = "50%",
  baseScale = 0.85,
  rotationAmount = 3,
  blurAmount = 4,
  onStackComplete,
}) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [sectionHeight, setSectionHeight] = useState(0);

  const items = useMemo(() => React.Children.toArray(children).filter(Boolean), [children]);

  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      setSectionHeight(vh + (items.length - 1) * itemDistance);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length, itemDistance]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const containerOffsetTop = containerRef.current.offsetTop;

      const scrollInto = scrollY - containerOffsetTop;
      const n = items.length;
      const t = clamp(scrollInto / itemDistance, 0, n - 1);

      const stackY = parseVhPercent(stackPosition, vh);
      const endY = parseVhPercent(scaleEndPosition, vh);
      const baseY = lerp(stackY, endY, clamp(t / (n - 1), 0, 1));

      items.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        const behind = Math.max(0, t - i);
        const ahead = Math.max(0, i - t);

        // Visual Calculations
        const yTarget = ahead * (vh * 0.9) + (behind * -itemStackDistance);
        const sTarget = clamp(1 - behind * itemScale, baseScale, 1);
        const rTarget = (i % 2 === 0 ? 1 : -1) * (behind * rotationAmount);
        const bTarget = behind * blurAmount;

        // RECEDING EFFECT: Dim cards as they go back
        const brightness = clamp(1 - (behind * 0.15), 0.5, 1);
        const opacityTarget = ahead > 1 ? 0 : 1;

        el.style.transform = `translate3d(-50%, -50%, 0) translateY(${yTarget}px) scale(${sTarget}) rotate(${rTarget}deg)`;
        el.style.filter = `blur(${bTarget}px) brightness(${brightness})`;
        el.style.opacity = opacityTarget;

        // STACKING LOGIC: Higher index is always on top of previous cards
        el.style.zIndex = 100 + i;

        el.style.top = `${baseY}px`;
        el.style.pointerEvents = ahead > 0.1 ? "none" : "auto";
      });
      
      if (t >= n - 1) onStackComplete?.();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items, itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, blurAmount, onStackComplete]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-transparent ${className}`}
      style={{ height: sectionHeight }}
    >

      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
        <div className="relative max-w-7xl mx-auto px-6 pt-10 sm:pt-14 pb-4">
          <div className="flex flex-col items-center text-center">
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#001F3F]">
              Why Choose Us
            </h2>
            <p className="mt-3 max-w-3xl text-base sm:text-lg text-[#001F3F]/75">
              A single marketplace for freight, courier, and relocation—built for B2B speed,
              reliability, and visibility.
            </p>
          </div>
        </div>

        {items.map((child, idx) => (
          <div
            key={idx}
            ref={(el) => (itemRefs.current[idx] = el)}
            className="absolute left-1/2 w-[90%] max-w-[800px] transition-opacity duration-300 will-change-transform pointer-events-auto"
            style={{ top: stackPosition }}
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}