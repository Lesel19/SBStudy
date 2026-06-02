// components/Login.jsx — Version corrigée
import { useState } from "react";
import { useTimer } from "../contexts/TimerContext";
import { login } from '../services/api';

//SVG
import KeyIcon from "../assets/key-icon.svg";
import EmailIcon from "../assets/email-icon.svg";
import MasquerIcon from "../assets/masquer-icon.svg";
import DemasquerIcon from "../assets/demasquer-icon.svg";
import BlockerIcon from "../assets/blocker-icon.svg";
import UserIcon from "../assets/user-icon.svg";
import AccepterIcon from "../assets/accepter-icon.svg";

function Login({ setUser, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const { setUserId, loadStatsFromServer, resetStats } = useTimer();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await login(email, password);
      const data = await response.json();
      console.log("📥 Réponse du serveur:", data);

      if (response.ok) {
        resetStats();
        
        console.log("🔑 userId reçu:", data.userId);
        // ⭐ Sauvegarde correcte dans localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.username || email.split("@")[0]);
        
        setUserId(data.userId);
        await loadStatsFromServer();
        setUser(data.email, data.userId, data.username);
      } else {
        setError(data.error || "Erreur de connexion");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Impossible de se connecter au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Connexion</h2>

      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠️</span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      <div style={styles.inputGroup}>
        <div style={styles.inputIcon}><img src={EmailIcon} alt="Email" style={styles.menuIconSvg} /></div>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={styles.inputGroup}>
        <div style={styles.inputIcon}><img src={BlockerIcon} alt="Bloquer" style={styles.menuIconSvg} /></div>
        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleLogin()}
        />
        <button style={styles.eyeButton} onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <img src={MasquerIcon} alt="Masquer" style={styles.menuIconSvg} /> : <img src={DemasquerIcon} alt="Démasquer" style={styles.menuIconSvg} />}
        </button>
      </div>

      <button 
        style={{ ...styles.button, ...(isLoading && styles.buttonLoading) }}
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? <div style={styles.spinner} /> : "Se connecter"}
      </button>

      <div style={styles.divider}>
        <span style={styles.dividerLine} />
        <span style={styles.dividerText}>ou</span>
        <span style={styles.dividerLine} />
      </div>

      <p style={styles.footerText}>
        Pas encore de compte ?{" "}
        <a href="#" style={styles.link} onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>S'inscrire</a>
      </p>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: "380px",
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(20px)",
    padding: "32px 24px",
    borderRadius: "32px",
    border: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
    zIndex: 2,
  },
  title: { fontSize: "24px", fontWeight: "590", marginBottom: "24px", color: "#F8FAFC" },
  errorBox: { display: "flex", alignItems: "center", gap: "8px", background: "rgba(251,113,133,0.15)", padding: "12px 16px", borderRadius: "16px", marginBottom: "20px" },
  errorIcon: { fontSize: "14px" },
  errorText: { fontSize: "14px", color: "#FB7185", flex: 1 },
  inputGroup: { position: "relative", marginBottom: "16px", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "14px", fontSize: "16px", opacity: 0.6 },
  input: { width: "100%", padding: "14px 16px 14px 44px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "16px", fontFamily: "inherit", background: "rgba(255,255,255,0.06)", color: "#F8FAFC", boxSizing: "border-box", outline: "none" },
  eyeButton: { position: "absolute", right: "14px", background: "none", border: "none", fontSize: "18px", cursor: "pointer", opacity: 0.6 },
  button: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #34D399, #22C55E)", color: "white", border: "none", borderRadius: "40px", fontSize: "17px", fontWeight: "480", cursor: "pointer", marginTop: "8px", transition: "all 0.2s ease" },
  buttonLoading: { opacity: 0.7, cursor: "not-allowed" },
  spinner: { width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "24px 0 20px 0" },
  dividerLine: { flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" },
  dividerText: { fontSize: "12px", color: "#64748B" },
  footerText: { fontSize: "13px", color: "#94A3B8", marginTop: "24px", marginBottom: 0 },
  link: { color: "#34D399", textDecoration: "none", fontWeight: "480" },
  userIconSvg: { width: "40px", height: "40px", opacity: 0.7 },
  menuIconSvg: { width: "20px", height: "20px", opacity: 0.7 },
  otherIconSvg: { width: "50px", height: "50px", opacity: 0.7 },
  homeIconSvg: { width: "28px", height: "28px", opacity: 0.7 },
};

export default Login;