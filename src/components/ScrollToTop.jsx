import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // This will scroll the window to the top
    window.scrollTo(0, 0);
  }, [pathname]); // This effect runs every time the 'pathname' (URL) changes

  return null; // This component renders nothing.
}

