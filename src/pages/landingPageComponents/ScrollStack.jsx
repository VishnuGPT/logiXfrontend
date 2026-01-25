import React, { useEffect, useMemo, useRef, useState } from "react";

const ACCENTS = {
  blue: {
    glow: "from-[#0091D5]/35 via-[#0091D5]/10 to-transparent",
    bar: "from-[#0091D5] via-[#00B7FF] to-[#2ECC71]",
    ring: "ring-[#0091D5]/25",
  },
  red: {
    glow: "from-[#E32636]/30 via-[#E32636]/10 to-transparent",
    bar: "from-[#E32636] via-[#FF5B6B] to-[#F39C12]",
    ring: "ring-[#E32636]/25",
  },
  emerald: {
    glow: "from-[#2ECC71]/28 via-[#2ECC71]/10 to-transparent",
    bar: "from-[#2ECC71] via-[#00D39A] to-[#0091D5]",
    ring: "ring-[#2ECC71]/22",
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
    <div className={`relative overflow-hidden rounded-3xl bg-white border border-[#001F3F]/10 shadow-xl ring-1 ${a.ring} min-h-[400px] ${className}`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.glow}`} />
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${a.bar}`} />
      <div className="relative p-6 sm:p-10 text-[#001F3F]">{children}</div>
    </div>
  );
}

export default function ScrollStack({
  children,
  className = "",
  itemDistance = 400, // Increased for a better scroll feel
  itemScale = 0.05,
  itemStackDistance = 20,
  stackPosition = "50%",
  scaleEndPosition = "50%",
  baseScale = 0.9,
  scaleDuration = 0.4,
  rotationAmount = 2,
  blurAmount = 2,
  onStackComplete,
}) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const stateRef = useRef([]);
  const [sectionHeight, setSectionHeight] = useState(0);

  const items = useMemo(() => React.Children.toArray(children).filter(Boolean), [children]);

  useEffect(() => {
    stateRef.current = items.map(() => ({ y: 0, s: 1, r: 0, b: 0, o: 1 }));
    const measure = () => {
      const vh = window.innerHeight;
      // Height = (number of items * distance between them) + extra viewport for the final exit
      setSectionHeight(vh + (items.length - 1) * itemDistance);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length, itemDistance]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const containerOffsetTop = container.offsetTop;
      
      // Calculate how far we've scrolled relative to the component start
      const scrollInto = scrollY - containerOffsetTop;
      const n = items.length;
      
      // progress of the current active card (0 to n-1)
      const t = clamp(scrollInto / itemDistance, 0, n - 1);

      const stackY = parseVhPercent(stackPosition, vh);
      const endY = parseVhPercent(scaleEndPosition, vh);
      const baseY = lerp(stackY, endY, clamp(t / (n - 1), 0, 1));

      items.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        const behind = Math.max(0, t - i); // How many items are "past" this one
        const ahead = Math.max(0, i - t);  // How many items are "coming up"

        // Active card logic
        const yTarget = ahead * (vh * 0.8) + (behind * -itemStackDistance); 
        const sTarget = clamp(1 - behind * itemScale, baseScale, 1);
        const rTarget = (i % 2 === 0 ? 1 : -1) * (behind * rotationAmount);
        const bTarget = behind * blurAmount;
        const oTarget = ahead > 1 ? 0 : 1; // Hide cards that are far ahead

        el.style.transform = `translate3d(-50%, -50%, 0) translateY(${yTarget}px) scale(${sTarget})`;
        el.style.filter = `blur(${bTarget}px)`;
        el.style.opacity = oTarget;
        el.style.zIndex = 100 + i;
        el.style.top = `${baseY}px`;
      });

      if (t >= n - 1) onStackComplete?.();
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items, itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, blurAmount]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {items.map((child, idx) => (
          <div
            key={idx}
            ref={(el) => (itemRefs.current[idx] = el)}
            className="absolute left-1/2 w-[90%] max-w-[800px] transition-all duration-75 ease-out will-change-transform"
            style={{ top: stackPosition }}
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}