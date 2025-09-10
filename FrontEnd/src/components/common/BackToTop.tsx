"use client";

import React, { useEffect } from "react";

// Add keyframes for vibration animation
const vibrationStyle = `
@keyframes vibrate {
  0% { transform: translateY(0); }
  20% { transform: translateY(-2px); }
  40% { transform: translateY(2px); }
  60% { transform: translateY(-2px); }
  80% { transform: translateY(2px); }
  100% { transform: translateY(0); }
}
.vibrate {
  animation: vibrate 0.5s infinite;
}
`;

function BackToTop() {
  useEffect(() => {
    // Inject vibration keyframes into the document head
    const styleTag = document.createElement("style");
    styleTag.innerHTML = vibrationStyle;
    document.head.appendChild(styleTag);

    const progressPath = document.querySelector(
      ".progress-arrow path"
    ) as SVGPathElement | null;
    if (!progressPath) return;

    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = "none";
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = `${pathLength}`;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = "stroke-dashoffset 10ms linear";

    const updateProgress = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = `${progress}`;
    };

    const handleScroll = () => {
      updateProgress();

      const offset = 50;
      const backToTopButton = document.querySelector(".backtotop-wrap");
      if (backToTopButton) {
        if (window.scrollY > offset) {
          backToTopButton.classList.add("active-progress");
        } else {
          backToTopButton.classList.remove("active-progress");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.head.removeChild(styleTag);
    };
  }, []);

  const scrollToTop = (event: React.MouseEvent) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+919842972802";
  };

  return (
    <>
      {/* Phone icon - fixed left bottom, vibrate animation */}
      <div
        style={{
          position: "fixed",
          left: 16,
          bottom: 24,
          zIndex: 9999,
          width: 40,
          height: 40,
          background: "#fff",
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        title="Call +91 98429 72802"
        onClick={handlePhoneClick}
      >
        <img
          src="/phone.png"
          alt="Phone"
          className="vibrate"
          style={{
            width: 22,
            height: 22,
            pointerEvents: "none",
          }}
        />
      </div>
      {/* Up arrow - fixed right bottom, vibrate animation */}
      <div
        className="backtotop-wrap"
        style={{
          position: "fixed",
          right: 16,
          bottom: 24,
          zIndex: 9999,
          width: 40,
          height: 40,
          background: "#22c55e",
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        title="Back to Top"
        onClick={scrollToTop}
      >
        <svg
          className="progress-arrow vibrate"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 19V5M12 5L5 12M12 5l7 7"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </>
  );
}

export default BackToTop;
