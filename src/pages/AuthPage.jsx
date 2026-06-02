// pages/AuthPage.jsx — Version corrigée
import { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Logo from "../components/Logo";

function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSetUser = (email, userId, username) => {
    setUser(email, userId, username);
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>

      <div style={styles.logoWrapper}>
        <Logo size={80} variant="circle" />
        <h1 style={styles.appName}>SBStudy</h1>
        <p style={styles.tagline}>Révise plus intelligemment</p>
      </div>

      <div style={styles.toggleContainer}>
        <button
          style={{ ...styles.toggleButton, ...(isLogin && styles.toggleActive) }}
          onClick={() => setIsLogin(true)}
        >
          Connexion
        </button>
        <button
          style={{ ...styles.toggleButton, ...(!isLogin && styles.toggleActive) }}
          onClick={() => setIsLogin(false)}
        >
          Inscription
        </button>
      </div>
      
      {isLogin ? (
        <Login setUser={handleSetUser} onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0F172A 0%, #111827 100%)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  backgroundGlow1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "999px",
    background: "rgba(52, 211, 153, 0.12)",
    top: "-120px",
    left: "-80px",
    filter: "blur(80px)",
  },
  backgroundGlow2: {
    position: "absolute",
    width: "280px",
    height: "280px",
    borderRadius: "999px",
    background: "rgba(251, 113, 133, 0.10)",
    bottom: "-120px",
    right: "-80px",
    filter: "blur(90px)",
  },
  logoWrapper: {
    textAlign: "center",
    marginBottom: "30px",
    zIndex: 2,
  },
  appName: {
    fontSize: "32px",
    fontWeight: "700",
    marginTop: "12px",
    marginBottom: "4px",
    background: "linear-gradient(135deg, #34D399, #22C55E)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  tagline: {
    fontSize: "14px",
    color: "#94A3B8",
  },
  toggleContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    background: "rgba(15, 23, 42, 0.8)",
    padding: "6px",
    borderRadius: "40px",
    backdropFilter: "blur(10px)",
    zIndex: 2,
  },
  toggleButton: {
    padding: "10px 24px",
    borderRadius: "32px",
    border: "none",
    fontSize: "15px",
    fontWeight: "500",
    background: "transparent",
    color: "#94A3B8",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  toggleActive: {
    background: "#34D399",
    color: "white",
    boxShadow: "0 2px 8px rgba(52,211,153,0.3)",
  },
};

export default AuthPage;