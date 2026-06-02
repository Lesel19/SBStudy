// components/CustomToast.jsx — Crée ce composant
import { useEffect } from "react";

function CustomToast({ message, type = "info", duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success": return "✅";
      case "error": return "❌";
      case "warning": return "⚠️";
      default: return "ℹ️";
    }
  };

  const getColor = () => {
    switch (type) {
      case "success": return "#34D399";
      case "error": return "#FB7185";
      case "warning": return "#F59E0B";
      default: return "#3B71CA";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(20px)",
        padding: "12px 20px",
        borderRadius: "40px",
        border: `1px solid ${getColor()}`,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 1000,
        animation: "slideUp 0.3s ease",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      }}
    >
      <span style={{ fontSize: "18px" }}>{getIcon()}</span>
      <span style={{ color: "#F8FAFC", fontSize: "14px", fontWeight: "450" }}>{message}</span>
    </div>
  );
}

export default CustomToast;