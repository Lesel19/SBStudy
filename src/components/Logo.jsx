// components/Logo.jsx
import React from "react";

function Logo({ size = 40, variant = "default" }) {
  const logoPath = "/sbstudy-logo.svg";
  
  const variants = {
    default: {},
    circle: {
      borderRadius: "50%",
      background: "linear-gradient(135deg, #34D399, #22C55E)",
      padding: "8px",
    },
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...variants[variant],
      }}
    >
      <img
        src={logoPath}
        alt="SBStudy Logo"
        style={{
          width: size,
          height: size,
          display: "block",
        }}
      />
    </div>
  );
}

export default Logo;