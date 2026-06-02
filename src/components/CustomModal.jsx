// components/CustomModal.jsx
import React from "react";

function CustomModal({ visible, title, message, onConfirm, onCancel, confirmText = "OK", cancelText = "Annuler" }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "rgba(15, 23, 42, 0.98)",
          backdropFilter: "blur(24px)",
          borderRadius: "28px",
          padding: "24px",
          width: "85%",
          maxWidth: "320px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          animation: "scaleIn 0.2s ease",
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "590", marginBottom: "12px", color: "#F8FAFC" }}>{title}</h3>
        <p style={{ fontSize: "15px", fontWeight: "450", color: "#94A3B8", marginBottom: "24px", lineHeight: 1.4 }}>{message}</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          {cancelText && (
            <button
              onClick={onCancel}
              style={{
                padding: "10px 20px",
                borderRadius: "40px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "#94A3B8",
                fontSize: "14px",
                fontWeight: "480",
                cursor: "pointer",
              }}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 24px",
              borderRadius: "40px",
              border: "none",
              background: "linear-gradient(135deg, #34D399, #22C55E)",
              color: "white",
              fontSize: "14px",
              fontWeight: "480",
              cursor: "pointer",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomModal;