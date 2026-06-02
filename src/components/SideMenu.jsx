import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/home-icon.svg";
import StatsIcon from "../assets/stats-icon.svg";
import PlannerIcon from "../assets/planner-icon.svg";

function SideMenu({ setUser }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Bouton menu */}
      <button style={styles.menuButton} onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* Overlay + menu */}
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.sideMenu} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.menuTitle}>Menu</h3>

            <button
              style={styles.menuItem}
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
            >
              <img src={HomeIcon} alt="Accueil" style={styles.menuIcon} />
              Accueil
            </button>

            <button
              style={styles.menuItem}
              onClick={() => {
                navigate("/sessions");
                setOpen(false);
              }}
            >
              <img src={PlannerIcon} alt="Sessions" style={styles.menuIcon} />
              Sessions
            </button>

            <button
              style={styles.menuItem}
              onClick={() => {
                navigate("/stats");
                setOpen(false);
              }}
            >
              <img src={StatsIcon} alt="Statistiques" style={styles.menuIcon} />
              Statistiques
            </button>

            <button
              style={{ ...styles.menuItem, color: "#ff5252" }}
              onClick={() => {
                localStorage.removeItem("userId");
                setUser(null);
              }}
            >
            
              🚪 Déconnexion
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  menuButton: {
    fontSize: "26px",
    background: "none",
    border: "none",
    cursor: "pointer",
    marginBottom: "15px",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    zIndex: 999,
  },

  sideMenu: {
    width: "70%",
    maxWidth: "260px",
    background: "white",
    height: "100%",
    padding: "20px",
    borderRadius: "0 20px 20px 0",
    boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
  },

  menuTitle: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "700",
  },

  menuItem: {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    background: "#eeeeee",
    border: "none",
    borderRadius: "12px",
    textAlign: "left",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default SideMenu;
