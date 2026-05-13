"use client";

import { useState, useEffect } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      
      const scrolled = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    }

    // 初回計算
    updateProgress();

    // スクロール時に再計算
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const barStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "2px",
    width: progress + "%",
    background: "var(--ink)",
    zIndex: 100,
    transition: "width 0.1s ease-out",
    pointerEvents: "none",
  };

  return <div style={barStyle} aria-hidden="true" />;
}