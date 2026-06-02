// components/SessionPlanner.jsx — Version avec pop-ups personnalisées
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../contexts/TimerContext";
import { getPlannedSessions, addPlannedSession, updatePlannedSession, deletePlannedSession } from "../services/api";
import { useTranslation } from 'react-i18next';
import CustomModal from "./CustomModal";
import CustomToast from "./CustomToast";

// Imports SVG
import HomeIcon from "../assets/home-icon.svg";
import PlannerIcon from "../assets/planner-icon.svg";
import StatsIcon from "../assets/stats-icon.svg";
import TimerIcon from "../assets/timer-icon.svg";
import InfoIcon from "../assets/info-icon.svg";
import UserIcon from "../assets/user-icon.svg";
import LogoutIcon from "../assets/logout-icon.svg";
import AddIcon from "../assets/ajouter-icon.svg";
import VideIcon from "../assets/vide-icon.svg";
import AccepterIcon from "../assets/accepter-icon.svg";
import ReveilIcon from "../assets/reveil-icon.svg";
import SupprimerIcon from "../assets/supprimer-icon.svg";
import CibleIcon from "../assets/cible-icon.svg";

function SessionPlanner({ setUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useTimer();
  const [plannedSessions, setPlannedSessions] = useState([]);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [modal, setModal] = useState({ visible: false, title: "", message: "", onConfirm: null, type: "info" });
  const [toast, setToast] = useState(null);
  
  const userName = localStorage.getItem("userName") || "Étudiant";
  const userEmail = localStorage.getItem("userEmail") || "email@exemple.com";

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

  const loadSessions = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await getPlannedSessions(userId);
      setPlannedSessions(data || []);
    } catch (error) {
      console.error("Erreur chargement sessions:", error);
      setToast({ message: "Erreur chargement des sessions", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadSessions();
    } else {
      setPlannedSessions([]);
      setIsLoading(false);
    }
  }, [userId, loadSessions]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userId) {
        loadSessions();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, loadSessions]);

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!subject || !date || !time) {
      setToast({ message: "Veuillez remplir tous les champs", type: "warning" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const sessionDate = new Date(`${date}T${time}`);
    const now = new Date();

    if (sessionDate < now) {
      setToast({ message: "⏰ La date doit être dans le futur !", type: "warning" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      await addPlannedSession(subject, date, time, userId);
      await loadSessions();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setSubject("");
      setDate("");
      setTime("");
      setToast({ message: "✅ Session ajoutée avec succès !", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Erreur ajout session:", error);
      setToast({ message: "Erreur lors de l'ajout de la session", type: "error" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDeleteSession = async (id, subjectName) => {
    setModal({
      visible: true,
      title: "Supprimer la session",
      message: `Supprimer la session "${subjectName}" ?`,
      type: "warning",
      onConfirm: async () => {
        try {
          await deletePlannedSession(id);
          await loadSessions();
          setModal({ ...modal, visible: false });
          setToast({ message: `Session "${subjectName}" supprimée`, type: "success" });
          setTimeout(() => setToast(null), 3000);
        } catch (error) {
          console.error("Erreur suppression session:", error);
          setModal({ ...modal, visible: false });
          setToast({ message: "Erreur lors de la suppression", type: "error" });
          setTimeout(() => setToast(null), 3000);
        }
      },
      onCancel: () => setModal({ ...modal, visible: false }),
    });
  };

  const handleCompleteSession = async (id, subjectName) => {
    setModal({
      visible: true,
      title: "Valider la session",
      message: `Marquer "${subjectName}" comme terminée ?`,
      type: "success",
      onConfirm: async () => {
        try {
          await updatePlannedSession(id, true);
          await loadSessions();
          setModal({ ...modal, visible: false });
          setToast({ message: `✅ "${subjectName}" terminée !`, type: "success" });
          setTimeout(() => setToast(null), 3000);
        } catch (error) {
          console.error("Erreur mise à jour session:", error);
          setModal({ ...modal, visible: false });
          setToast({ message: "Erreur lors de la validation", type: "error" });
          setTimeout(() => setToast(null), 3000);
        }
      },
      onCancel: () => setModal({ ...modal, visible: false }),
    });
  };

  const getFilteredSessions = () => {
    const now = new Date();
    let filtered = [...plannedSessions];
    
    if (selectedFilter === "upcoming") {
      filtered = filtered.filter(s => {
        const sessionDate = new Date(`${s.date}T${s.time}`);
        return sessionDate >= now && !s.completed;
      });
    } else if (selectedFilter === "past") {
      filtered = filtered.filter(s => {
        const sessionDate = new Date(`${s.date}T${s.time}`);
        return sessionDate < now || s.completed;
      });
    }
    
    return filtered.sort((a, b) => 
      new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
    );
  };

  const filteredSessions = getFilteredSessions();
  
  const upcomingCount = plannedSessions.filter(s => {
    const sessionDate = new Date(`${s.date}T${s.time}`);
    return sessionDate >= new Date() && !s.completed;
  }).length;

  const formatDisplayDate = (dateStr) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  // Style pour les boutons du menu
  const menuItemStyle = {
    background: "transparent",
    border: "none",
    color: "#F8FAFC",
    padding: "12px 16px",
    borderRadius: "12px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "450",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    transition: "all 0.2s ease",
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow1} />
      <div style={styles.backgroundGlow2} />

      {/* Modale personnalisée */}
      <CustomModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />

      {/* Toast personnalisé */}
      {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <button style={styles.iconButton} onClick={() => setMenuOpen(true)}>☰</button>
        <h1 style={styles.pageTitle}>{t('sessions.title')}</h1>
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
            zIndex: 1000,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "280px",
              background: "rgba(15, 23, 42, 0.98)",
              backdropFilter: "blur(24px)",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              zIndex: 1001,
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              transform: "translateX(0)",
              animation: "slideIn 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", margin: 0, fontWeight: "590", color: "#F8FAFC" }}>Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Profil */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                padding: "16px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #34D399, #FB7185)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={UserIcon} alt="Avatar" style={{ width: "24px", height: "24px", filter: "brightness(0) invert(1)" }} />
              </div>
              <div>
                <div style={{ fontWeight: "500", fontSize: "15px", color: "#F8FAFC" }}>{userName}</div>
                <div style={{ color: "#64748B", fontSize: "11px", marginTop: "2px" }}>{userEmail}</div>
              </div>
            </div>

            {/* Items du menu */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={() => { navigate("/"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={HomeIcon} alt="" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> Accueil
              </button>
              <button onClick={() => { navigate("/sessions"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={PlannerIcon} alt="" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> Sessions
              </button>
              <button onClick={() => { navigate("/stats"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={StatsIcon} alt="" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> Statistiques
              </button>
              <button onClick={() => { navigate("/subjects"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={TimerIcon} alt="" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> Timer
              </button>
              <button onClick={() => { navigate("/profile"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={UserIcon} alt="" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> Mon profil
              </button>
              <button onClick={() => { navigate("/about"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={InfoIcon} alt="" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> À propos
              </button>
            </div>

            {/* Bouton déconnexion */}
            <button
              onClick={() => {
                localStorage.removeItem("userId");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userName");
                setUser(null);
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "16px",
                border: "none",
                background: "rgba(251, 113, 133, 0.12)",
                color: "#FB7185",
                fontWeight: "450",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "20px",
              }}
            >
              <span><img src={LogoutIcon} alt="Déconnexion" style={styles.menuIconSvg} /></span> Déconnexion
            </button>
          </div>
        </div>
      )}

      {/* Toast de succès (ancien) - supprimé car remplacé par le toast personnalisé */}
      
      {/* CONTENU PRINCIPAL */}
      <div style={styles.content}>
        <div
          style={{
            opacity: isContentVisible ? 1 : 0,
            transform: isContentVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div style={styles.statsCard}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{plannedSessions.length}</span>
              <span style={styles.statLabel}>Total</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{upcomingCount}</span>
              <span style={styles.statLabel}>À venir</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{plannedSessions.filter(s => s.completed).length}</span>
              <span style={styles.statLabel}>Terminées</span>
            </div>
          </div>

          <div style={styles.formCard}>
            <h2 style={styles.formTitle}><img src={PlannerIcon} alt="Planifier" style={styles.menuIconSvg} /> Planifier une révision</h2>
            <form onSubmit={handleAddSession} style={styles.form}>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Matière (ex: Mathématiques)"
                required
                style={styles.input}
              />
              <div style={styles.inputRow}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ ...styles.input, width: "50%" }}
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  style={{ ...styles.input, width: "50%" }}
                />
              </div>
              <button type="submit" style={styles.addButton}><img src={AddIcon} alt="Ajouter" style={styles.menuIconSvg} /> {t('sessions.add')}</button>
            </form>
          </div>

          <div style={styles.filterBar}>
            <button style={{ ...styles.filterButton, ...(selectedFilter === "all" && styles.filterActive) }} onClick={() => setSelectedFilter("all")}>Toutes</button>
            <button style={{ ...styles.filterButton, ...(selectedFilter === "upcoming" && styles.filterActive) }} onClick={() => setSelectedFilter("upcoming")}>À venir</button>
            <button style={{ ...styles.filterButton, ...(selectedFilter === "past" && styles.filterActive) }} onClick={() => setSelectedFilter("past")}>Passées</button>
          </div>

          <div style={styles.sessionsList}>
            {isLoading && (
              <div style={styles.emptyState}>
                <div style={styles.spinner} />
                <p style={styles.emptyText}>Chargement...</p>
              </div>
            )}

            {!isLoading && filteredSessions.length === 0 && (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}><img src={VideIcon} alt="Vide" style={styles.otherIconSvg} /></span>
                <p style={styles.emptyText}>Aucune session planifiée</p>
                <p style={styles.emptySubtext}>Ajoute ta première session ci-dessus</p>
              </div>
            )}

            {!isLoading && filteredSessions.map((session, index) => {
              const sessionDate = new Date(`${session.date}T${session.time}`);
              const isPast = sessionDate < new Date() || session.completed;
              const delay = index * 0.05;

              return (
                <div
                  key={session.id}
                  style={{
                    ...styles.sessionCard,
                    ...(isPast && styles.sessionCardPast),
                    transitionDelay: `${delay}s`,
                  }}
                >
                  <div style={styles.sessionInfo}>
                    <div style={styles.sessionHeader}>
                      <span style={styles.sessionSubject}>{session.subject}</span>
                      {session.completed && <span style={styles.completedBadge}><img src={AccepterIcon} alt="Accepter" style={styles.menuIconSvg} /> Terminé</span>}
                      {!session.completed && isPast && <span style={styles.missedBadge}><img src={ReveilIcon} alt="Dépassé" style={styles.menuIconSvg} /> Dépassé</span>}
                    </div>
                    <div style={styles.sessionDateTime}><img src={PlannerIcon} alt="Date" style={styles.menuIconSvg} /> {formatDisplayDate(session.date)} à {session.time}</div>
                  </div>
                  <div style={styles.sessionActions}>
                    {!session.completed && !isPast && (
                      <button style={styles.completeButton} onClick={() => handleCompleteSession(session.id, session.subject)}><img src={AccepterIcon} alt="Terminé" style={styles.menuIconSvg} /></button>
                    )}
                    <button style={styles.deleteButton} onClick={() => handleDeleteSession(session.id, session.subject)}><img src={SupprimerIcon} alt="Supprimer" style={styles.menuIconSvg} /></button>
                  </div>
                </div>
              );
            })}
          </div>

          {!isLoading && upcomingCount > 0 && (
            <div style={styles.quoteCard}>
              <span style={styles.quoteIcon}><img src={CibleIcon} alt="Cible" style={styles.menuIconSvg} /></span>
              <span style={styles.quoteText}>{upcomingCount} session{upcomingCount > 1 ? "s" : ""} à venir — Tu vas y arriver !</span>
            </div>
          )}
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

  pageTitle: { fontSize: "22px", fontWeight: "590", margin: 0 },
  placeholder: { width: "46px" },

  content: {
    position: "relative",
    zIndex: 2,
    padding: "20px",
    maxWidth: "560px",
    margin: "0 auto",
  },

  statsCard: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "24px",
    padding: "20px",
    marginBottom: "20px",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  userIconSvg: { width: "40px", height: "40px", opacity: 0.7 },
  menuIconSvg: { width: "20px", height: "20px", opacity: 0.7 },
  otherIconSvg: { width: "50px", height: "50px", opacity: 0.7 },
  homeIconSvg: { width: "28px", height: "28px", opacity: 0.7 },

  statItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" },
  statNumber: { fontSize: "28px", fontWeight: "590", color: "#34D399" },
  statLabel: { fontSize: "11px", fontWeight: "450", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" },
  statDivider: { width: "1px", height: "40px", background: "rgba(255, 255, 255, 0.1)" },

  formCard: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "28px",
    padding: "24px",
    marginBottom: "20px",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },

  formTitle: { fontSize: "18px", fontWeight: "590", marginBottom: "20px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  inputRow: { display: "flex", gap: "12px" },
  input: { width: "100%", padding: "14px 16px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "16px", background: "rgba(255, 255, 255, 0.06)", color: "#F8FAFC", boxSizing: "border-box" },
  addButton: { background: "linear-gradient(135deg, #34D399, #22C55E)", color: "white", border: "none", padding: "14px 20px", borderRadius: "40px", fontSize: "16px", fontWeight: "480", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },

  filterBar: { display: "flex", gap: "10px", marginBottom: "20px", background: "rgba(255, 255, 255, 0.05)", padding: "6px", borderRadius: "40px" },
  filterButton: { flex: 1, padding: "10px 16px", borderRadius: "32px", border: "none", fontSize: "14px", fontWeight: "450", background: "transparent", color: "#CBD5E1", cursor: "pointer" },
  filterActive: { background: "#34D399", color: "white" },

  sessionsList: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" },
  sessionCard: { background: "rgba(255, 255, 255, 0.04)", borderRadius: "20px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s ease", border: "1px solid rgba(255, 255, 255, 0.06)" },
  sessionCardPast: { opacity: 0.5 },
  sessionInfo: { flex: 1 },
  sessionHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" },
  sessionSubject: { fontSize: "16px", fontWeight: "500" },
  completedBadge: { fontSize: "11px", fontWeight: "450", color: "#34D399", background: "rgba(52, 211, 153, 0.15)", padding: "2px 8px", borderRadius: "20px" },
  missedBadge: { fontSize: "11px", fontWeight: "450", color: "#FB7185", background: "rgba(251, 113, 133, 0.15)", padding: "2px 8px", borderRadius: "20px" },
  sessionDateTime: { fontSize: "13px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "6px" },
  sessionActions: { display: "flex", gap: "8px" },
  completeButton: { background: "rgba(52, 211, 153, 0.15)", border: "none", fontSize: "18px", cursor: "pointer", padding: "8px 12px", borderRadius: "12px" },
  deleteButton: { background: "rgba(251, 113, 133, 0.15)", border: "none", fontSize: "18px", cursor: "pointer", padding: "8px 12px", borderRadius: "12px" },

  emptyState: { textAlign: "center", padding: "48px 20px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "28px" },
  emptyIcon: { fontSize: "48px", display: "block", marginBottom: "16px", opacity: 0.5 },
  emptyText: { fontSize: "17px", fontWeight: "450", color: "#94A3B8", marginBottom: "8px" },
  emptySubtext: { fontSize: "14px", color: "#64748B" },

  quoteCard: { background: "rgba(52, 211, 153, 0.08)", borderRadius: "20px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid rgba(52, 211, 153, 0.15)" },
  quoteIcon: { fontSize: "20px" },
  quoteText: { fontSize: "13px", fontWeight: "450", color: "#34D399", lineHeight: "1.4", flex: 1 },

  spinner: { width: "30px", height: "30px", border: "3px solid rgba(255, 255, 255, 0.1)", borderTopColor: "#34D399", borderRadius: "50%", margin: "0 auto 12px auto", animation: "spin 0.8s linear infinite" },
};

export default SessionPlanner;