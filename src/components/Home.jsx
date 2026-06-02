// components/Home.jsx — Version complète avec traduction
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../contexts/TimerContext";
import { useTranslation } from 'react-i18next';
import SubjectList from "./SubjectList";
import Timer from "./Timer";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

import AIRevision from "./AIRevision";


// Imports SVG
import HomeIcon from "../assets/home-icon.svg";
import PlannerIcon from "../assets/planner-icon.svg";
import StatsIcon from "../assets/stats-icon.svg";
import TimerIcon from "../assets/timer-icon.svg";
import InfoIcon from "../assets/info-icon.svg";
import UserIcon from "../assets/user-icon.svg";
import LogoutIcon from "../assets/logout-icon.svg";
import BrainIcon from "../assets/brain-icon.svg";
import ReveilIcon from "../assets/reveil-icon.svg";
import LivresIcon from "../assets/livres-icon.svg";
import CibleIcon from "../assets/cible-icon.svg";
import MyUserIcon from "../assets/myuser-icon.svg";

function Home({ user, setUser }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { 
    selectedSubject, 
    sessions, 
    totalTime, 
    userId,
    getTodayTotalTime,
    getTodaySessionCount
  } = useTimer();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [todayStats, setTodayStats] = useState({ time: 0, count: 0 });
  const [focusScore, setFocusScore] = useState(0);
  
  const userName = localStorage.getItem("userName") || (user ? user.split("@")[0] : "Étudiant");
  const userEmail = localStorage.getItem("userEmail") || user || "email@exemple.com";

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  // Mettre à jour les stats du jour
  useEffect(() => {
    const updateStats = () => {
      const todayCount = getTodaySessionCount();
      const todayTime = getTodayTotalTime();
      setTodayStats({ time: todayTime, count: todayCount });
      
      const score = Math.min(Math.round((todayCount / 10) * 100), 100);
      setFocusScore(score);
    };
    
    updateStats();
  }, [getTodaySessionCount, getTodayTotalTime]);

  const formatTime = (minutes) => {
    if (minutes === 0) return "0min";
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (mins === 0) return `${hours}h`;
      return `${hours}h${mins}`;
    }
    return `${minutes}min`;
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

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <button style={styles.iconButton} onClick={() => setMenuOpen(true)}>☰</button>
        <div style={styles.logoContainer}><Logo size={34} /></div>
        <div style={styles.userContainer}>
          <div style={styles.userText}>
            <span style={styles.hello}>{t('home.hello')}</span>
            <span style={styles.userName}>{userName}</span>
          </div>
          <img src={MyUserIcon} alt="Utilisateur" style={styles.userIconSvg} />
        </div>
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
              <h2 style={{ fontSize: "24px", margin: 0, fontWeight: "590", color: "#F8FAFC" }}>{t('menu.title')}</h2>
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
                <img src={HomeIcon} alt="Accueil" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> {t('nav.home')}
              </button>
              <button onClick={() => { navigate("/sessions"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={PlannerIcon} alt="Sessions" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> {t('nav.sessions')}
              </button>
              <button onClick={() => { navigate("/stats"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={StatsIcon} alt="Statistiques" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> {t('nav.stats')}
              </button>
              <button onClick={() => { navigate("/subjects"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={TimerIcon} alt="Timer" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> {t('nav.timer')}
              </button>
              <button onClick={() => { navigate("/profile"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={UserIcon} alt="Profil" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> {t('nav.profile')}
              </button>
              <button onClick={() => { navigate("/about"); setMenuOpen(false); }} style={menuItemStyle}>
                <img src={InfoIcon} alt="À propos" style={{ width: "20px", height: "20px", opacity: 0.7 }} /> {t('nav.about')}
              </button>
            </div>

            {/* Language Switcher */}
            <div style={{ padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "auto", marginBottom: "12px" }}>
              <LanguageSwitcher />
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
              }}
            >
              <span><img src={LogoutIcon} alt="Déconnexion" style={styles.menuIconSvg} /></span> {t('nav.logout')}
            </button>
          </div>
        </div>
      )}

      {/* CONTENU PRINCIPAL */}
      <div style={{ ...styles.content, opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)" }}>
        
        <div style={styles.heroCard}>
          <img src={BrainIcon} alt="Focus" style={styles.otherIconSvg} />
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>{t('home.title')}</h1>
            <p style={styles.heroSubtitle}>{t('home.subtitle')}</p>
          </div>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <img src={ReveilIcon} alt="Timer" style={styles.homeIconSvg} />
            <div>
              <div style={styles.statValue}>{formatTime(todayStats.time)}</div>
              <div style={styles.statLabel}>{t('home.today')}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <img src={LivresIcon} alt="Livres" style={styles.homeIconSvg} />
            <div>
              <div style={styles.statValue}>{sessions}</div>
              <div style={styles.statLabel}>{t('home.sessions')}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <img src={CibleIcon} alt="Cible" style={styles.homeIconSvg} />
            <div>
              <div style={styles.statValue}>{focusScore}%</div>
              <div style={styles.statLabel}>{t('home.focus')}</div>
            </div>
          </div>
        </div>

        <div style={styles.glassCard}><Timer /></div>
        <div style={styles.glassCard}><SubjectList /></div>
      </div>

      <AIRevision />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0F172A 0%, #111827 100%)",
    position: "relative",
    overflowX: "hidden",
    overflowY: "auto",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    color: "#F8FAFC",
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

  logoContainer: { display: "flex", alignItems: "center", justifyContent: "center" },

  userContainer: { display: "flex", alignItems: "center", gap: "12px" },
  userText: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  hello: { fontSize: "12px", fontWeight: "450", color: "#64748B" },
  userName: { fontWeight: "500", fontSize: "15px", color: "#F8FAFC" },

  userIconSvg: { width: "40px", height: "40px", opacity: 0.7 },
  menuIconSvg: { width: "20px", height: "20px", opacity: 0.7 },
  otherIconSvg: { width: "50px", height: "50px", opacity: 0.7 },
  homeIconSvg: { width: "28px", height: "28px", opacity: 0.7 },

  content: {
    position: "relative",
    zIndex: 2,
    padding: "20px",
    paddingBottom: "100px",
    maxWidth: "560px",
    margin: "0 auto",
    transition: "0.5s ease",
    minHeight: "calc(100vh - 100px)",
  },

  heroCard: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.06)",
    borderRadius: "32px",
    padding: "24px",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    marginBottom: "24px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
  },

  heroContent: { flex: 1 },
  heroTitle: { margin: 0, fontSize: "22px", fontWeight: "590", letterSpacing: "-0.5px", lineHeight: 1.3, color: "#F8FAFC" },
  heroSubtitle: { marginTop: "8px", color: "#94A3B8", fontSize: "14px", fontWeight: "450", lineHeight: 1.45, letterSpacing: "-0.2px" },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginBottom: "24px",
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "24px",
    padding: "16px 12px",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },

  statValue: { fontSize: "22px", fontWeight: "590", color: "#F8FAFC", letterSpacing: "-0.5px", lineHeight: 1.2 },
  statLabel: { fontSize: "11px", fontWeight: "450", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" },

  glassCard: {
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "32px",
    padding: "4px",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    marginBottom: "20px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
  },
};

export default Home;