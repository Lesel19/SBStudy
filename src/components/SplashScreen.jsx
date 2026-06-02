// components/SplashScreen.jsx — Version Deep Focus
import { useEffect } from "react";
import Logo from "./Logo";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={styles.splash}>
      {/* Glow effects */}
      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>
      
      {/* Contenu principal */}
      <div style={styles.content}>
        <Logo size={100} variant="circle" />
        <h1 style={styles.title}>SelebrainStudy</h1>
        <p style={styles.subtitle}>Révise plus intelligemment</p>
        <div style={styles.loaderContainer}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Chargement...</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  splash: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(180deg, #0F172A 0%, #111827 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    overflow: "hidden",
  },

  backgroundGlow1: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "999px",
    background: "rgba(52, 211, 153, 0.15)",
    top: "-150px",
    left: "-100px",
    filter: "blur(100px)",
    animation: "pulse 4s ease-in-out infinite",
  },

  backgroundGlow2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "999px",
    background: "rgba(251, 113, 133, 0.12)",
    bottom: "-120px",
    right: "-80px",
    filter: "blur(90px)",
    animation: "pulse 4s ease-in-out infinite reverse",
  },

  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    animation: "fadeInUp 0.6s ease-out",
  },

  title: {
    fontSize: "36px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #34D399, #22C55E)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginTop: "20px",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    fontSize: "15px",
    color: "#94A3B8",
    marginBottom: "40px",
    fontWeight: "500",
  },

  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },

  loader: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(52, 211, 153, 0.2)",
    borderTopColor: "#34D399",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    fontSize: "12px",
    color: "#64748B",
    fontWeight: "500",
    letterSpacing: "0.5px",
  },
};

// Injecter les animations
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
      100% { opacity: 0.4; transform: scale(1); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default SplashScreen;