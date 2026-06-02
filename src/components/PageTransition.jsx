// components/PageTransition.jsx
import React, { useEffect, useState } from "react";

function PageTransition({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Petite animation d'entrée
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.4s cubic-bezier(0.25, 0.1, 0.1, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.1, 1)",
        animation: isVisible ? "pageEnter 0.5s ease-out" : "none",
      }}
    >
      {children}
    </div>
  );
}

// Injecter les animations
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes pageEnter {
      0% {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes pageExit {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(-20px) scale(0.98);
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default PageTransition;