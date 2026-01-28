import React, { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "./Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Join Us", href: "/join-us" },
];

export default function Navbar() {
  const TOP_BAR_HEIGHT = 40;

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const navRef = useRef(null);
  const tlRef = useRef(null);

  const navCards = [
    {
      label: "Navigate",
      bgColor: "#F3F4F6",
      textColor: "#0F172A",
      links: navLinks.map((l) => ({ label: l.label, to: l.href })),
    },
    {
      label: "Services",
      bgColor: "#EEF2FF",
      textColor: "#0F172A",
      links: [
        { label: "FTL (Full Truckload)", to: "/services/ftl" },
        {
          label: "PTL (Part Truckload)",
          to: "/",
          state: { openCallModal: true, serviceId: "ptl" },
        },
        { label: "Packers & Movers", to: "/services/packers-movers" },
        {
          label: "Courier Services",
          to: "/",
          state: { openCallModal: true, serviceId: "courier" },
        },
      ],
    },
    {
      label: "Legal",
      bgColor: "#ECFEFF",
      textColor: "#0F172A",
      links: [
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms of Service", to: "/terms" },
        { label: "Cookie Policy", to: "/cookies" },
      ],
    },
  ];

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl) {
        const wasVisibility = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        // Force reflow so scrollHeight is accurate
        contentEl.offsetHeight;

        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisibility;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return TOP_BAR_HEIGHT + contentHeight + padding;
      }
    }

    return 260;
  };

  const getAnimTargets = () => {
    const navEl = navRef.current;
    if (!navEl) return [];
    return Array.from(navEl.querySelectorAll(".card-nav-animate"));
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    const targets = getAnimTargets();

    gsap.set(navEl, { height: TOP_BAR_HEIGHT, overflow: "hidden" });
    gsap.set(targets, { y: 16, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: () => calculateHeight(),
      duration: 0.4,
      ease: "power3.out",
    });

    tl.to(
      targets,
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
        stagger: 0.06,
      },
      "-=0.12"
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      const navEl = navRef.current;
      if (!navEl) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navEl, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl || !isExpanded) return;
    setIsHamburgerOpen(false);
    tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
    tl.reverse();
  };

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      closeMenu();
    }
  };

  return (
    <>
      <div className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[980px] z-40 top-2 md:top-3">
        <nav
          ref={navRef}
          className={`block p-0 rounded-2xl shadow-md relative overflow-hidden will-change-[height] border border-black/10 bg-background/80 backdrop-blur-lg ${
            isExpanded ? "open" : ""
          }`}
        >
          {/* Top bar */}
          <div
            className="absolute inset-x-0 top-0 flex items-center justify-between px-3 md:px-4 z-[2]"
            style={{ height: TOP_BAR_HEIGHT }}
          >
            <div
              className={`group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] select-none ${
                isHamburgerOpen ? "open" : ""
              }`}
              onClick={toggleMenu}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleMenu();
              }}
              role="button"
              aria-label={isExpanded ? "Close menu" : "Open menu"}
              aria-expanded={isExpanded}
              tabIndex={0}
            >
              <div
                className={`w-[30px] h-[2px] bg-text transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                  isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""
                } group-hover:opacity-75`}
              />
              <div
                className={`w-[30px] h-[2px] bg-text transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                  isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""
                } group-hover:opacity-75`}
              />
            </div>

            <Link
              to="/"
              className="flex items-center justify-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
              onClick={closeMenu}
            >
              <img src="/LOGO.png" alt="LogiXjunction Logo" className="h-9 md:h-10 w-auto" />
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <Button asChild variant="cta">
                <Link to="/sign-in">SignIn / SignUp</Link>
              </Button>
            </div>
          </div>

          {/* Expanded content */}
          <div
            className={`card-nav-content absolute left-0 right-0 flex flex-col items-stretch gap-2 px-3 pb-3 md:px-4 md:pb-4 z-[1] ${
              isExpanded ? "visible pointer-events-auto" : "invisible pointer-events-none"
            }`}
            style={{ top: TOP_BAR_HEIGHT }}
            aria-hidden={!isExpanded}
          >
            <div className="flex flex-col md:flex-row md:items-stretch md:gap-3 gap-2">
              {navCards.map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="card-nav-animate select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(1rem-0.2rem)] min-w-0 flex-[1_1_auto] min-h-[72px] md:min-h-[150px]"
                  style={{ backgroundColor: item.bgColor, color: item.textColor }}
                >
                  <div className="font-normal tracking-[-0.5px] text-[18px] md:text-[22px]">
                    {item.label}
                  </div>
                  <div className="mt-auto flex flex-col gap-[2px]">
                    {item.links?.map((lnk, i) => (
                      <Link
                        key={`${lnk.label}-${i}`}
                        className="inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                        to={lnk.to}
                        state={lnk.state}
                        onClick={closeMenu}
                        aria-label={lnk.ariaLabel || lnk.label}
                      >
                        <GoArrowUpRight className="shrink-0" aria-hidden="true" />
                        {lnk.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="card-nav-animate flex flex-col md:hidden gap-3 pt-1">
              <Button asChild variant="ghost" size="lg" onClick={closeMenu}>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="cta" size="lg" onClick={closeMenu}>
                <Link to="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
