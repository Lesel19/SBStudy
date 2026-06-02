// components/Register.jsx — Version avec pseudo
import { useState } from "react";
import { useTimer } from "../contexts/TimerContext";

//SVG
import KeyIcon from "../assets/key-icon.svg";
import EmailIcon from "../assets/email-icon.svg";
import MasquerIcon from "../assets/masquer-icon.svg";
import DemasquerIcon from "../assets/demasquer-icon.svg";
import BlockerIcon from "../assets/blocker-icon.svg";
import UserIcon from "../assets/user-icon.svg";
import AccepterIcon from "../assets/accepter-icon.svg";


function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          username: username.trim() || email.split("@")[0], 
          password 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess("✅ Compte créé avec succès ! Connectez-vous.");
        setTimeout(() => {
          if (onSwitchToLogin) onSwitchToLogin();
        }, 2000);
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Inscription</h2>

      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠️</span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      {success && (
        <div style={styles.successBox}>
          <span style={styles.successIcon}>✅</span>
          <span style={styles.successText}>{success}</span>
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
        <div style={styles.inputIcon}><img src={UserIcon} alt="Utilisateur" style={styles.menuIconSvg} /></div>
        <input
          style={styles.input}
          type="text"
          placeholder="Pseudo (optionnel)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div style={styles.inputGroup}>
        <div style={styles.inputIcon}><img src={BlockerIcon} alt="Bloquer" style={styles.menuIconSvg} /></div>
        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe (min. 6 caractères)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.eyeButton} onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <img src={MasquerIcon} alt="Masquer" style={styles.menuIconSvg} /> : <img src={DemasquerIcon} alt="Démasquer" style={styles.menuIconSvg} />}
        </button>
      </div>

      <div style={styles.inputGroup}>
        <div style={styles.inputIcon}><img src={AccepterIcon} alt="Accepter" style={styles.menuIconSvg} /></div>
        <input
          style={styles.input}
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleRegister()}
        />
        <button style={styles.eyeButton} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? <img src={MasquerIcon} alt="Masquer" style={styles.menuIconSvg} /> : <img src={DemasquerIcon} alt="Démasquer" style={styles.menuIconSvg} />}
        </button>
      </div>

      <button 
        style={{ ...styles.button, ...(isLoading && styles.buttonLoading) }}
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? <div style={styles.spinner} /> : "S'inscrire"}
      </button>

      <div style={styles.divider}>
        <span style={styles.dividerLine} />
        <span style={styles.dividerText}>ou</span>
        <span style={styles.dividerLine} />
      </div>

      <p style={styles.footerText}>
        Déjà un compte ?{" "}
        <a href="#" style={styles.link} onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
          Se connecter
        </a>
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
  title: { 
    fontSize: "24px", 
    fontWeight: "590", 
    marginBottom: "24px", 
    color: "#F8FAFC",
    letterSpacing: "-0.5px",
  },
  errorBox: { 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    background: "rgba(251,113,133,0.15)", 
    padding: "12px 16px", 
    borderRadius: "16px", 
    marginBottom: "20px" 
  },
  errorIcon: { fontSize: "14px" },
  errorText: { fontSize: "14px", color: "#FB7185", flex: 1 },
  successBox: { 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    background: "rgba(52,211,153,0.15)", 
    padding: "12px 16px", 
    borderRadius: "16px", 
    marginBottom: "20px" 
  },
  successIcon: { fontSize: "14px" },
  successText: { fontSize: "14px", color: "#34D399", flex: 1 },
  inputGroup: { 
    position: "relative", 
    marginBottom: "16px", 
    display: "flex", 
    alignItems: "center" 
  },
  inputIcon: { 
    position: "absolute", 
    left: "14px", 
    fontSize: "16px", 
    opacity: 0.6 
  },
  input: { 
    width: "100%", 
    padding: "14px 16px 14px 44px", 
    borderRadius: "16px", 
    border: "1px solid rgba(255,255,255,0.1)", 
    fontSize: "16px", 
    fontFamily: "inherit", 
    background: "rgba(255,255,255,0.06)", 
    color: "#F8FAFC", 
    boxSizing: "border-box", 
    outline: "none" 
  },
  eyeButton: { 
    position: "absolute", 
    right: "14px", 
    background: "none", 
    border: "none", 
    fontSize: "18px", 
    cursor: "pointer", 
    opacity: 0.6 
  },
  button: { 
    width: "100%", 
    padding: "14px", 
    background: "linear-gradient(135deg, #34D399, #22C55E)", 
    color: "white", 
    border: "none", 
    borderRadius: "40px", 
    fontSize: "17px", 
    fontWeight: "480", 
    cursor: "pointer", 
    marginTop: "8px", 
    transition: "all 0.2s ease" 
  },
  buttonLoading: { 
    opacity: 0.7, 
    cursor: "not-allowed" 
  },
  spinner: { 
    width: "20px", 
    height: "20px", 
    border: "2px solid rgba(255,255,255,0.3)", 
    borderTopColor: "white", 
    borderRadius: "50%", 
    margin: "0 auto", 
    animation: "spin 0.8s linear infinite" 
  },
  divider: { 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    margin: "24px 0 20px 0" 
  },
  dividerLine: { 
    flex: 1, 
    height: "1px", 
    background: "rgba(255,255,255,0.1)" 
  },
  dividerText: { 
    fontSize: "12px", 
    color: "#64748B" 
  },

  userIconSvg: { width: "40px", height: "40px", opacity: 0.7 },
  menuIconSvg: { width: "20px", height: "20px", opacity: 0.7 },
  otherIconSvg: { width: "50px", height: "50px", opacity: 0.7 },
  homeIconSvg: { width: "28px", height: "28px", opacity: 0.7 },

  footerText: { 
    fontSize: "13px", 
    color: "#94A3B8", 
    marginTop: "24px", 
    marginBottom: 0 
  },
  link: { 
    color: "#34D399", 
    textDecoration: "none", 
    fontWeight: "480" 
  },
};

// Injecter l'animation spinner
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Register;