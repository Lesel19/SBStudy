// pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../contexts/TimerContext";

// Importer tes SVG
import HomeIcon from "../assets/home-icon.svg";
import PlannerIcon from "../assets/planner-icon.svg";
import StatsIcon from "../assets/stats-icon.svg";
import TimerIcon from "../assets/timer-icon.svg";
import InfoIcon from "../assets/info-icon.svg";
import UserIcon from "../assets/user-icon.svg";
import LogoutIcon from "../assets/logout-icon.svg";
import ModifierIcon from "../assets/modifier-icon.svg";
import ValiderIcon from "../assets/accepter-icon.svg";

function Profile({ setUser }) {
  const navigate = useNavigate();
  const { userId } = useTimer();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const userEmail = localStorage.getItem("userEmail") || "";
  const storedUsername = localStorage.getItem("userName") || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  // Charger les informations utilisateur
  useEffect(() => {
    if (userId) {
      loadUserData();
    } else {
      // Fallback si userId n'est pas disponible
      setUserData({
        username: storedUsername,
        email: userEmail,
        created_at: new Date().toISOString()
      });
      setNewUsername(storedUsername || userEmail.split("@")[0]);
      setIsLoading(false);
    }
  }, [userId]);

  const loadUserData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:3001/user/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setUserData(data);
        setNewUsername(data.username || userEmail.split("@")[0]);
        // Mettre à jour le localStorage
        if (data.username) {
          localStorage.setItem("userName", data.username);
        }
      } else {
        console.error("Erreur API:", data);
        // Fallback avec les données locales
        setUserData({
          username: storedUsername || userEmail.split("@")[0],
          email: userEmail,
          created_at: new Date().toISOString()
        });
        setNewUsername(storedUsername || userEmail.split("@")[0]);
        setError(data.error || "Erreur chargement profil");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      // Fallback en cas d'erreur réseau
      setUserData({
        username: storedUsername || userEmail.split("@")[0],
        email: userEmail,
        created_at: new Date().toISOString()
      });
      setNewUsername(storedUsername || userEmail.split("@")[0]);
      setError("Mode hors ligne - Données locales");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setError("Le pseudo ne peut pas être vide");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`http://localhost:3001/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData({ ...userData, username: data.username });
        localStorage.setItem("userName", data.username);
        setSuccess("Pseudo mis à jour avec succès !");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible de mettre à jour le profil");
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = () => {
    if (userData?.username) return userData.username;
    if (storedUsername) return storedUsername;
    if (userEmail) return userEmail.split("@")[0];
    return "Étudiant";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Non disponible";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return "Non disponible";
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow1} />
      <div style={styles.backgroundGlow2} />

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <button style={styles.iconButton} onClick={() => setMenuOpen(true)}>☰</button>
        <h1 style={styles.pageTitle}>Mon profil</h1>
        <div style={styles.placeholder} />
      </div>

      {/* MENU LATÉRAL */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            zIndex: 100,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              ...styles.sidebar,
              transform: "translateX(0)",
              animation: "slideIn 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.sidebarHeader}>
              <h2 style={styles.sidebarTitle}>Menu</h2>
              <button style={styles.closeButton} onClick={() => setMenuOpen(false)}>✕</button>
            </div>

            <div style={styles.profileCard}>
              <div style={styles.profileAvatar}>
                <img src={UserIcon} alt="Avatar" style={{ width: "28px", height: "28px", filter: "brightness(0) invert(1)" }} />
              </div>
              <div>
                <div style={styles.profileName}>{getDisplayName()}</div>
                <div style={styles.profileEmail}>{userEmail}</div>
              </div>
            </div>

            <div style={styles.menuItemsWrapper}>
              <button style={styles.menuItem} onClick={() => { navigate("/"); setMenuOpen(false); }}>
                <img src={HomeIcon} alt="Accueil" style={styles.menuIconSvg} />
                <span>Accueil</span>
              </button>
              <button style={styles.menuItem} onClick={() => { navigate("/sessions"); setMenuOpen(false); }}>
                <img src={PlannerIcon} alt="Sessions" style={styles.menuIconSvg} />
                <span>Sessions</span>
              </button>
              <button style={styles.menuItem} onClick={() => { navigate("/stats"); setMenuOpen(false); }}>
                <img src={StatsIcon} alt="Statistiques" style={styles.menuIconSvg} />
                <span>Statistiques</span>
              </button>
              <button style={styles.menuItem} onClick={() => { navigate("/subjects"); setMenuOpen(false); }}>
                <img src={TimerIcon} alt="Timer" style={styles.menuIconSvg} />
                <span>Timer</span>
              </button>
              <button style={styles.menuItem} onClick={() => { navigate("/profile"); setMenuOpen(false); }}>
                <img src={UserIcon} alt="Profil" style={styles.menuIconSvg} />
                <span>Mon profil</span>
              </button>
              <button style={styles.menuItem} onClick={() => { navigate("/about"); setMenuOpen(false); }}>
                <img src={InfoIcon} alt="À propos" style={styles.menuIconSvg} />
                <span>À propos</span>
              </button>
            </div>

            <button
              style={styles.logoutButton}
              onClick={() => {
                localStorage.removeItem("userId");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userName");
                setUser(null);
              }}
            >
              <img src={LogoutIcon} alt="Déconnexion" style={styles.menuIconSvg} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTENU PRINCIPAL */}
      <div style={styles.content}>
        <div
          style={{
            opacity: isContentVisible ? 1 : 0,
            transform: isContentVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div style={styles.profileHeaderCard}>
            <div style={styles.profileHeaderAvatar}>
              <span style={styles.profileHeaderEmoji}>👤</span>
            </div>
            <div>
              <h1 style={styles.profileHeaderTitle}>Mon profil</h1>
              <p style={styles.profileHeaderSubtitle}>Gère tes informations personnelles</p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>Email</div>
              <div style={styles.infoValue}>{userEmail}</div>
              <div style={styles.infoBadge}>✓ Vérifié</div>
            </div>
            
            <div style={styles.divider} />
            
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>Pseudo</div>
              {isEditing ? (
                <div style={styles.editContainer}>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Entrez votre pseudo"
                    style={styles.editInput}
                    autoFocus
                  />
                  <button style={styles.saveButton} onClick={handleSaveUsername}>
                    <img src={ValiderIcon} alt="Valider" style={styles.menuIconSvg} />
                  </button>
                  <button style={styles.cancelButton} onClick={() => {
                    setIsEditing(false);
                    setNewUsername(getDisplayName());
                    setError("");
                  }}>
                    ✕
                  </button>
                </div>
              ) : (
                <div style={styles.infoValue}>
                  {getDisplayName()}
                  <button style={styles.editButton} onClick={() => setIsEditing(true)}>
                    <img src={ModifierIcon} alt="Modifier" style={styles.menuIconSvg} />
                  </button>
                </div>
              )}
            </div>

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
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>Membre depuis</div>
              <div style={styles.infoValue}>
                {formatDate(userData?.created_at)}
              </div>
            </div>
            <div style={styles.divider} />
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>ID utilisateur</div>
              <div style={styles.infoValue}>#{userId || "..."}</div>
            </div>
          </div>

          <div style={styles.statsCard}>
            <h3 style={styles.statsTitle}>📊 En un coup d'œil</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statsGridItem}>
                <span style={styles.statsGridValue}>{userData?.username ? "✓" : "○"}</span>
                <span style={styles.statsGridLabel}>Pseudo défini</span>
              </div>
              <div style={styles.statsGridItem}>
                <span style={styles.statsGridValue}>✓</span>
                <span style={styles.statsGridLabel}>Email vérifié</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0F172A 0%, #111827 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    color: "#F8FAFC",
    paddingBottom: "80px",
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

  topBar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backdropFilter: "blur(18px)",
    background: "rgba(15, 23, 42, 0.55)",
  },

  iconButton: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    background: "rgba(255, 255, 255, 0.03)",
    color: "#F8FAFC",
    fontSize: "20px",
    cursor: "pointer",
  },

  pageTitle: {
    fontSize: "22px",
    fontWeight: "590",
    margin: 0,
  },

  placeholder: {
    width: "46px",
  },

  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "84%",
    maxWidth: "340px",
    background: "rgba(15, 23, 42, 0.92)",
    backdropFilter: "blur(24px)",
    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
    zIndex: 100,
    padding: "28px 22px",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },

  sidebarHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  sidebarTitle: { fontSize: "28px", margin: 0, fontWeight: "590", letterSpacing: "-0.5px" },
  closeButton: { width: "40px", height: "40px", borderRadius: "14px", border: "none", background: "rgba(255, 255, 255, 0.05)", color: "#fff", cursor: "pointer", fontSize: "18px" },

  profileCard: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    padding: "18px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.04)",
    marginBottom: "24px",
    border: "1px solid rgba(255, 255, 255, 0.04)",
  },

  profileAvatar: {
    width: "54px",
    height: "54px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #34D399, #FB7185)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  profileName: { fontWeight: "500", fontSize: "16px" },
  profileEmail: { color: "#64748B", fontSize: "12px", fontWeight: "450", marginTop: "4px" },

  menuItemsWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
    overflowY: "auto",
  },

  menuItem: {
    background: "transparent",
    border: "none",
    color: "#F8FAFC",
    padding: "14px 18px",
    borderRadius: "18px",
    textAlign: "left",
    fontSize: "16px",
    fontWeight: "450",
    cursor: "pointer",
    transition: "0.2s",
    letterSpacing: "-0.3px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    width: "100%",
  },

  menuIconSvg: {
    width: "20px",
    height: "20px",
    opacity: 0.7,
  },

  logoutButton: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "18px",
    border: "none",
    background: "rgba(251, 113, 133, 0.12)",
    color: "#FB7185",
    fontWeight: "480",
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "auto",
  },

  content: {
    position: "relative",
    zIndex: 2,
    padding: "20px",
    maxWidth: "560px",
    margin: "0 auto",
  },

  profileHeaderCard: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.06)",
    borderRadius: "32px",
    padding: "24px",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    marginBottom: "24px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
  },

  profileHeaderAvatar: {
    width: "70px",
    height: "70px",
    borderRadius: "35px",
    background: "linear-gradient(135deg, #34D399, #FB7185)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  profileHeaderEmoji: {
    fontSize: "32px",
  },

  profileHeaderTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "590",
    letterSpacing: "-0.5px",
    color: "#F8FAFC",
  },

  profileHeaderSubtitle: {
    marginTop: "6px",
    color: "#94A3B8",
    fontSize: "14px",
    fontWeight: "450",
  },

  infoCard: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "24px",
    padding: "20px",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    marginBottom: "20px",
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
  },

  infoLabel: {
    fontSize: "14px",
    fontWeight: "450",
    color: "#64748B",
    minWidth: "100px",
  },

  infoValue: {
    fontSize: "15px",
    fontWeight: "480",
    color: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
  },

  infoBadge: {
    fontSize: "11px",
    fontWeight: "450",
    color: "#34D399",
    background: "rgba(52, 211, 153, 0.12)",
    padding: "4px 10px",
    borderRadius: "20px",
  },

  divider: {
    height: "1px",
    background: "rgba(255, 255, 255, 0.08)",
    margin: "8px 0",
  },

  editButton: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  editContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
  },

  editInput: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(52, 211, 153, 0.3)",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "rgba(15, 23, 42, 0.8)",
    color: "#F8FAFC",
    outline: "none",
  },

  saveButton: {
    background: "rgba(52, 211, 153, 0.15)",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButton: {
    background: "rgba(251, 113, 133, 0.15)",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FB7185",
    fontSize: "14px",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(251, 113, 133, 0.12)",
    padding: "12px 16px",
    borderRadius: "12px",
    marginTop: "16px",
  },

  errorIcon: { fontSize: "14px" },
  errorText: { fontSize: "13px", color: "#FB7185", flex: 1 },

  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(52, 211, 153, 0.12)",
    padding: "12px 16px",
    borderRadius: "12px",
    marginTop: "16px",
  },

  successIcon: { fontSize: "14px" },
  successText: { fontSize: "13px", color: "#34D399", flex: 1 },

  statsCard: {
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "20px",
    padding: "18px",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },

  statsTitle: {
    fontSize: "15px",
    fontWeight: "590",
    marginBottom: "16px",
  },

  statsGrid: {
    display: "flex",
    gap: "16px",
  },

  statsGridItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "16px",
  },

  statsGridValue: {
    fontSize: "24px",
    fontWeight: "590",
    color: "#34D399",
  },

  statsGridLabel: {
    fontSize: "11px",
    fontWeight: "450",
    color: "#64748B",
  },
};

export default Profile;