// components/BottomNav.jsx — Version sophistiquée (style iOS premium)
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "../assets/home-icon.svg";
import StatsIcon from "../assets/stats-icon.svg";
import PlannerIcon from "../assets/planner-icon.svg";


function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", icon: <img src={HomeIcon} alt="Accueil" style={{ width: "20px", height: "20px" }} />,  },
    { path: "/sessions", icon: <img src={PlannerIcon} alt="Sessions" style={{ width: "20px", height: "20px" }} /> },
    { path: "/stats", icon: <img src={StatsIcon} alt="Stats" style={{ width: "20px", height: "20px" }} /> },
  ];

  return (
    <>
      <div style={styles.safeArea} />
      <nav style={styles.container}>
        <div style={styles.blurBackground} />

        {navItems.map((item) => {
          const isActiveItem = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                ...(item.primary && styles.primaryItem),
              }}
            >
              <div
                style={{
                  ...styles.iconWrapper,
                  ...(isActiveItem && styles.iconWrapperActive),
                  ...(item.primary && styles.primaryWrapper),
                }}
              >
                <span
                  style={{
                    ...styles.icon,
                    ...(isActiveItem && styles.iconActive),
                  }}
                >
                  {item.icon}
                </span>

                {isActiveItem && !item.primary && <div style={styles.activeGlow} />}
              </div>

              <span
                style={{
                  ...styles.label,
                  ...(isActiveItem && styles.labelActive),
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

const styles = {
  safeArea: {
    height: "80px",
  },

  container: {
    position: "fixed",
    bottom: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "calc(100% - 24px)",
    maxWidth: "500px",
    height: "60px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 999,
    padding: "0 12px",
    overflow: "hidden",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    background: "rgba(15, 23, 42, 0.75)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  },

  blurBackground: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(52, 211, 153, 0.05), rgba(251, 113, 133, 0.02))",
    pointerEvents: "none",
  },

  navItem: {
    flex: 1,
    height: "100%",
    border: "none",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    cursor: "pointer",
    position: "relative",
    zIndex: 2,
    transition: "all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
  },

  primaryItem: {
    transform: "translateY(-22px)",
  },

  iconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
  },

  iconWrapperActive: {
    background: "linear-gradient(135deg, rgba(52, 211, 153, 0.18), rgba(16, 185, 129, 0.12))",
    border: "1px solid rgba(52, 211, 153, 0.35)",
    boxShadow: "0 0 16px rgba(52, 211, 153, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  },

  primaryWrapper: {
    width: "60px",
    height: "60px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #34D399, #10B981)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 12px 28px rgba(16, 185, 129, 0.4), 0 0 20px rgba(52, 211, 153, 0.2)",
  },

  icon: {
    fontSize: "20px",
    transition: "all 0.25s ease",
    filter: "grayscale(0.15)",
    opacity: 0.75,
  },

  iconActive: {
    transform: "scale(1.08)",
    filter: "grayscale(0)",
    opacity: 1,
  },

  activeGlow: {
    position: "absolute",
    inset: "-6px",
    borderRadius: "22px",
    background: "rgba(52, 211, 153, 0.12)",
    filter: "blur(10px)",
    zIndex: -1,
    animation: "pulse 2s ease-in-out infinite",
  },

  label: {
    fontSize: "10px",
    fontWeight: "480",
    color: "#64748B",
    transition: "all 0.2s ease",
    letterSpacing: "-0.2px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
  },

  labelActive: {
    color: "#F8FAFC",
    fontWeight: "500",
  },
};

// Ajouter les animations
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes pulse {
      0% { opacity: 0.3; transform: scale(0.95); }
      50% { opacity: 0.7; transform: scale(1.05); }
      100% { opacity: 0.3; transform: scale(0.95); }
    }
    
    /* Animation au survol */
    button:hover .iconWrapper {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.08);
    }
    
    button:hover .icon {
      transform: scale(1.05);
      opacity: 0.9;
    }
    
    button:hover .label {
      transform: translateY(1px);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default BottomNav;