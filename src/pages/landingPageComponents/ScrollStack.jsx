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
    <div
      className={[
        "relative overflow-hidden rounded-3xl",
        "bg-white",
        "border border-[#001F3F]/10 shadow-[0_22px_70px_-45px_rgba(0,31,63,0.65)]",
        "ring-1",
        a.ring,
        "min-h-[420px] sm:min-h-[480px]",
        className,
      ].join(" ")}
    >
      {/* glow */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.glow}`} />

      {/* top accent bar */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${a.bar}`} />

      <div className="relative p-6 sm:p-10 text-[#001F3F]">{children}</div>
    </div>
  );
}

/**
 * ScrollStack (inspired by ReactBits Scroll Stack)
 * Props modeled after: https://reactbits.dev/components/scroll-stack
 */
export default function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const rafRef = useRef(null);
  const lastTsRef = useRef(0);
  const latestScrollRef = useRef(0);
  const didCompleteRef = useRef(false);
  const stateRef = useRef([]);

  const items = useMemo(() => React.Children.toArray(children).filter(Boolean), [children]);
  const [sectionHeight, setSectionHeight] = useState(null);

  useEffect(() => {
    // Initialize per-item state (for smoothing)
    stateRef.current = items.map(() => ({
      y: 0,
      s: 1,
      r: 0,
      b: 0,
      o: 1,
    }));
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight || 800;
      const n = Math.max(1, items.length);
      // Total scroll space through the stack: one "itemDistance" per transition + a viewport tail.
      const h = vh + itemDistance * (n - 1) + vh * 0.35;
      setSectionHeight(h);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [itemDistance, items.length]);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const getScrollY = () =>
      useWindowScroll || typeof window === "undefined"
        ? window.scrollY || window.pageYOffset || 0
        : window.scrollY || window.pageYOffset || 0;

    const tick = (ts) => {
      const container = containerRef.current;
      if (!container) return;

      const tsPrev = lastTsRef.current || ts;
      const dt = Math.min(64, ts - tsPrev);
      lastTsRef.current = ts;

      const scrollY = latestScrollRef.current;
      const rect = container.getBoundingClientRect();
      const containerTop = scrollY + rect.top;
      const vh = window.innerHeight || 800;

      const n = Math.max(1, items.length);
      const totalScroll = itemDistance * (n - 1);
      const scrollInto = scrollY - containerTop;
      const progress = clamp(scrollInto / Math.max(1, totalScroll), 0, 1);
      const t = clamp(scrollInto / Math.max(1, itemDistance), 0, n - 1);

      const stackY = parseVhPercent(stackPosition, vh);
      const endY = parseVhPercent(scaleEndPosition, vh);
      const baseY = lerp(stackY, endY, progress);

      // smoothing factor based on scaleDuration (seconds)
      const tau = Math.max(0.08, scaleDuration) * 1000;
      const alpha = 1 - Math.exp(-dt / tau);

      for (let i = 0; i < n; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;

        const behind = Math.max(0, t - i);
        const ahead = Math.max(0, i - t);

        // Movement: future cards start below and slide up as they become active.
        const yTarget = ahead * itemDistance + behind * itemStackDistance;

        // Scale / rotate / blur for stacked (behind) items.
        const sTarget = clamp(1 - behind * itemScale, baseScale, 1);
        const rTarget = behind * rotationAmount;
        const bTarget = behind * blurAmount;

        // Fade out far-future cards so they don't clutter the stack.
        const oTarget = clamp(1 - Math.max(0, ahead - 0.25) * 1.4, 0, 1);

        const st = stateRef.current[i] ?? (stateRef.current[i] = { y: 0, s: 1, r: 0, b: 0, o: 1 });
        st.y = lerp(st.y, yTarget, alpha);
        st.s = lerp(st.s, sTarget, alpha);
        st.r = lerp(st.r, rTarget, alpha);
        st.b = lerp(st.b, bTarget, alpha);
        st.o = lerp(st.o, oTarget, alpha);

        el.style.top = `${baseY}px`;
        el.style.opacity = `${st.o >= 0.5 ? 1 : 0}`;
        el.style.filter = blurAmount ? `blur(${st.b.toFixed(2)}px)` : "none";
        el.style.transform = `translate3d(-50%, -50%, 0) translate3d(0, ${st.y.toFixed(
          2
        )}px, 0) scale(${st.s.toFixed(4)}) rotate(${st.r.toFixed(3)}deg)`;
        el.style.zIndex = String(100 + i);
        el.style.pointerEvents = st.o < 0.05 ? "none" : "auto";
      }

      if (!didCompleteRef.current && t >= n - 1 - 1e-3) {
        didCompleteRef.current = true;
        onStackComplete?.();
      }

      rafRef.current = null;
    };

    const onScroll = () => {
      latestScrollRef.current = getScrollY();
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    // Prime initial state
    latestScrollRef.current = getScrollY();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [
    items.length,
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
  ]);

  return (
    <section
      ref={containerRef}
      className={[
        "relative w-full",
        "bg-[linear-gradient(180deg,rgba(0,145,213,0.06),rgba(227,38,54,0.04))]",
        className,
      ].join(" ")}
      style={sectionHeight ? { height: sectionHeight } : undefined}
    >
      {/* subtle colorful backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 20%, rgba(0,145,213,0.22), transparent 60%), radial-gradient(900px 520px at 85% 30%, rgba(227,38,54,0.18), transparent 62%), radial-gradient(900px 520px at 60% 90%, rgba(46,204,113,0.14), transparent 60%)",
        }}
      />

      <div className="sticky h-screen pointer-events-none flex items-center justify-center" style={{ top: 'calc(50vh - 36px)' }}>
        <div className="relative w-full h-full pointer-events-auto flex items-center justify-center">
          {items.map((child, idx) => (
            <div
              key={idx}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className="absolute left-1/2 w-[92%] max-w-[980px] will-change-transform"
              style={{
                top: "50%",
                transform: "translate3d(-50%, -50%, 0)",
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

