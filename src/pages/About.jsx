// pages/About.jsx — Version avec menu latéral identique
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// Imports SVG
import HomeIcon from "../assets/home-icon.svg";
import PlannerIcon from "../assets/planner-icon.svg";
import StatsIcon from "../assets/stats-icon.svg";
import TimerIcon from "../assets/timer-icon.svg";
import InfoIcon from "../assets/info-icon.svg";
import UserIcon from "../assets/user-icon.svg";
import LogoutIcon from "../assets/logout-icon.svg";

function About({ setUser }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  
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

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <button style={styles.iconButton} onClick={() => setMenuOpen(true)}>☰</button>
        <h1 style={styles.pageTitle}>{t('about.title') || "À propos"}</h1>
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
              <span>🚪</span> Déconnexion
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
          <div style={styles.heroCard}>
            <div style={styles.heroEmoji}>🍅</div>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>{t('about.title') || "La méthode Pomodoro"}</h1>
              <p style={styles.heroSubtitle}>
                {t('about.description') || "Développée par Francesco Cirillo à la fin des années 1980, la méthode Pomodoro est une technique de gestion du temps qui aide à maintenir sa concentration et sa productivité."}
              </p>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>{t('about.howItWorks') || "📖 Comment ça fonctionne ?"}</h3>
            <div style={styles.stepList}>
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>1</div>
                <div style={styles.stepContent}>
                  <div style={styles.stepTitle}>{t('about.step1') || "Choisis une tâche"}</div>
                  <div style={styles.stepDesc}>{t('about.step1Desc') || "Sélectionne la matière ou la tâche que tu souhaites réviser"}</div>
                </div>
              </div>
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>2</div>
                <div style={styles.stepContent}>
                  <div style={styles.stepTitle}>{t('about.step2') || "Règle un minuteur sur 25 minutes"}</div>
                  <div style={styles.stepDesc}>{t('about.step2Desc') || "C'est la durée d'un 'Pomodoro'"}</div>
                </div>
              </div>
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>3</div>
                <div style={styles.stepContent}>
                  <div style={styles.stepTitle}>{t('about.step3') || "Travaille sans interruption"}</div>
                  <div style={styles.stepDesc}>{t('about.step3Desc') || "Concentre-toi uniquement sur ta tâche jusqu'à la sonnerie"}</div>
                </div>
              </div>
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>4</div>
                <div style={styles.stepContent}>
                  <div style={styles.stepTitle}>{t('about.step4') || "Fais une pause de 5 minutes"}</div>
                  <div style={styles.stepDesc}>{t('about.step4Desc') || "Détends-toi, hydrate-toi, respire profondément"}</div>
                </div>
              </div>
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>5</div>
                <div style={styles.stepContent}>
                  <div style={styles.stepTitle}>{t('about.step5') || "Répète 4 fois"}</div>
                  <div style={styles.stepDesc}>{t('about.step5Desc') || "Après 4 Pomodoros, prends une pause plus longue de 15-20 minutes"}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>{t('about.whyEfficient') || "✨ Pourquoi c'est efficace ?"}</h3>
            <div style={styles.benefitsList}>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🧠</div>
                <div style={styles.benefitContent}>
                  <div style={styles.benefitTitle}>{t('about.benefit1') || "Réduit la procrastination"}</div>
                  <div style={styles.benefitDesc}>{t('about.benefit1Desc') || "25 minutes semble plus facile à accomplir qu'une longue session"}</div>
                </div>
              </div>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🎯</div>
                <div style={styles.benefitContent}>
                  <div style={styles.benefitTitle}>{t('about.benefit2') || "Améliore la concentration"}</div>
                  <div style={styles.benefitDesc}>{t('about.benefit2Desc') || "Des intervalles courts aident à maintenir l'attention"}</div>
                </div>
              </div>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🔄</div>
                <div style={styles.benefitContent}>
                  <div style={styles.benefitTitle}>{t('about.benefit3') || "Prévient l'épuisement"}</div>
                  <div style={styles.benefitDesc}>{t('about.benefit3Desc') || "Les pauses régulières évitent la fatigue mentale"}</div>
                </div>
              </div>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>📈</div>
                <div style={styles.benefitContent}>
                  <div style={styles.benefitTitle}>{t('about.benefit4') || "Permet de suivre sa progression"}</div>
                  <div style={styles.benefitDesc}>{t('about.benefit4Desc') || "Visualise le nombre de sessions complétées"}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.tipCard}>
            <div style={styles.tipIcon}>💡</div>
            <div style={styles.tipContent}>
              <div style={styles.tipTitle}>{t('about.tipTitle') || "Conseil SBStudy"}</div>
              <div style={styles.tipText}>
                {t('about.tipText') || "Commence par planifier tes sessions dans le calendrier, sélectionne une matière dans la liste, et lance le minuteur ! Plus tu utiliseras la méthode Pomodoro, plus elle deviendra une habitude naturelle."}
              </div>
            </div>
          </div>

          <div style={styles.quoteCard}>
            <div style={styles.quoteIcon}>“</div>
            <div style={styles.quoteText}>
              {t('about.quote') || "La constance vaut mieux que l'intensité. Mieux vaut 25 minutes de travail concentré chaque jour que 3 heures une fois par semaine."}
            </div>
            <div style={styles.quoteAuthor}>{t('about.quoteAuthor') || "— Francesco Cirillo"}</div>
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
    pointerEvents: "none",
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
    pointerEvents: "none",
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

  heroCard: {
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

  heroEmoji: { fontSize: "48px" },
  heroContent: { flex: 1 },
  heroTitle: { margin: 0, fontSize: "22px", fontWeight: "590", letterSpacing: "-0.5px", lineHeight: 1.3, color: "#F8FAFC" },
  heroSubtitle: { marginTop: "8px", color: "#94A3B8", fontSize: "14px", fontWeight: "450", lineHeight: 1.45, letterSpacing: "-0.2px" },

  card: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "28px",
    padding: "24px",
    marginBottom: "20px",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },

  sectionTitle: { fontSize: "18px", fontWeight: "590", marginBottom: "20px" },
  stepList: { display: "flex", flexDirection: "column", gap: "16px" },
  stepItem: { display: "flex", gap: "14px", alignItems: "flex-start" },
  stepNumber: {
    width: "28px", height: "28px",
    background: "linear-gradient(135deg, #34D399, #22C55E)",
    borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontWeight: "700", fontSize: "14px", flexShrink: 0,
  },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: "15px", fontWeight: "500", marginBottom: "4px" },
  stepDesc: { fontSize: "13px", color: "#94A3B8", lineHeight: 1.4 },

  benefitsList: { display: "flex", flexDirection: "column", gap: "12px" },
  benefitItem: { display: "flex", gap: "14px", alignItems: "flex-start", padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "16px" },
  benefitIcon: { fontSize: "28px" },
  benefitContent: { flex: 1 },
  benefitTitle: { fontSize: "15px", fontWeight: "500", marginBottom: "4px" },
  benefitDesc: { fontSize: "13px", color: "#94A3B8", lineHeight: 1.4 },

  tipCard: {
    background: "rgba(52,211,153,0.08)",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    gap: "14px",
    marginBottom: "20px",
    border: "1px solid rgba(52,211,153,0.15)",
  },
  tipIcon: { fontSize: "32px" },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: "15px", fontWeight: "600", color: "#34D399", marginBottom: "6px" },
  tipText: { fontSize: "13px", color: "#CBD5E1", lineHeight: 1.4 },

  quoteCard: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "20px",
    padding: "24px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  quoteIcon: { fontSize: "40px", color: "#34D399", opacity: 0.5, fontFamily: "Georgia, serif" },
  quoteText: { fontSize: "16px", fontStyle: "italic", color: "#CBD5E1", lineHeight: 1.5, margin: "12px 0" },
  quoteAuthor: { fontSize: "12px", color: "#64748B" },
};

export default About;