// pages/StatsPage.jsx — Version avec stats du mois (30 derniers jours)
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../contexts/TimerContext";
import { getPlannedSessions } from "../services/api";
import { useTranslation } from 'react-i18next';

// Imports SVG (garde tes imports)
import HomeIcon from "../assets/home-icon.svg";
import PlannerIcon from "../assets/planner-icon.svg";
import StatsIcon from "../assets/stats-icon.svg";
import TimerIcon from "../assets/timer-icon.svg";
import InfoIcon from "../assets/info-icon.svg";
import UserIcon from "../assets/user-icon.svg";
import LogoutIcon from "../assets/logout-icon.svg";
import FeteIcon from "../assets/fete-icon.svg";
import LivresIcon from "../assets/livres-icon.svg";
import FlammeIcon from "../assets/flamme-icon.svg";
import CibleIcon from "../assets/cible-icon.svg";
import MuscleIcon from "../assets/muscle-icon.svg";
import TropheeIcon from "../assets/trophee-icon.svg";

function StatsPage({ setUser }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sessions, totalTime, streak, userId } = useTimer();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]); // Changé de weeklyData à monthlyData
  const [bestDay, setBestDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
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

  // ⭐ Calculer les stats des 30 derniers jours (mois)
  const loadMonthlyStats = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const allSessions = await getPlannedSessions(userId);
      console.log("📊 Toutes les sessions:", allSessions);
      
      const completedSessions = allSessions.filter(s => s.completed === 1 || s.completed === true);
      console.log("✅ Sessions complétées:", completedSessions.length);
      
      // Générer les 30 derniers jours
      const last30Days = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        const dayNumber = date.getDate();
        last30Days.push({
          date: dateStr,
          day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
          dayNumber: dayNumber,
          count: 0
        });
      }
      
      // Compter les sessions complétées pour chaque jour
      completedSessions.forEach(session => {
        const sessionDate = session.date;
        const dayData = last30Days.find(d => d.date === sessionDate);
        if (dayData) {
          dayData.count += 1;
          console.log(`Session ajoutée: ${session.subject} le ${sessionDate}`);
        }
      });
      
      console.log("📊 Stats 30 derniers jours:", last30Days);
      setMonthlyData(last30Days);
      
      // Trouver le meilleur jour
      const best = [...last30Days].sort((a, b) => b.count - a.count)[0];
      if (best && best.count > 0) {
        setBestDay({ day: best.day, date: best.date, count: best.count });
      } else {
        setBestDay(null);
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadMonthlyStats();
  }, [loadMonthlyStats, sessions]);

  const formatTotalTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins} min`;
  };

  const getMaxCount = () => {
    if (!monthlyData.length) return 1;
    return Math.max(...monthlyData.map(d => d.count), 1);
  };

  const getBarHeight = (count) => {
    if (count === 0) return 0;
    const max = getMaxCount();
    return Math.max((count / max) * 100, 5);
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow1} />
      <div style={styles.backgroundGlow2} />

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <button style={styles.iconButton} onClick={() => setMenuOpen(true)}>☰</button>
        <h1 style={styles.pageTitle}>{t('stats.title') || "Statistiques"}</h1>
        <div style={styles.placeholder} />
      </div>

      {/* MENU LATÉRAL (garde ton menu existant) */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", margin: 0, fontWeight: "590", color: "#F8FAFC" }}>Menu</h2>
              <button onClick={() => setMenuOpen(false)} style={{ width: "36px", height: "36px", borderRadius: "12px", border: "none", background: "rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "16px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", marginBottom: "24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "20px", background: "linear-gradient(135deg, #34D399, #FB7185)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={UserIcon} alt="Avatar" style={{ width: "24px", height: "24px", filter: "brightness(0) invert(1)" }} />
              </div>
              <div>
                <div style={{ fontWeight: "500", fontSize: "15px", color: "#F8FAFC" }}>{userName}</div>
                <div style={{ color: "#64748B", fontSize: "11px", marginTop: "2px" }}>{userEmail}</div>
              </div>
            </div>

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

            <button onClick={() => { localStorage.removeItem("userId"); localStorage.removeItem("userEmail"); localStorage.removeItem("userName"); setUser(null); }} style={{ width: "100%", padding: "12px", borderRadius: "16px", border: "none", background: "rgba(251,113,133,0.12)", color: "#FB7185", fontWeight: "450", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
              <span><img src={LogoutIcon} alt="Déconnexion" style={styles.menuIconSvg} /></span> Déconnexion
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
          <div style={styles.congratsCard}>
            <span style={styles.congratsIcon}><img src={FeteIcon} alt="Bravo" style={styles.otherIconSvg} /></span>
            <div>
              <h2 style={styles.congratsTitle}>Bravo !</h2>
              <p style={styles.congratsText}>
                {sessions === 0 && "Commence ta première session !"}
                {sessions > 0 && sessions < 10 && "Tu commences bien !"}
                {sessions >= 10 && sessions < 30 && "Continue comme ça !"}
                {sessions >= 30 && "Performance exceptionnelle !"}
              </p>
            </div>
          </div>

          <div style={styles.kpiContainer}>
            <div style={styles.kpiCard}>
              <div style={styles.kpiIcon}><img src={LivresIcon} alt="Livres" style={styles.homeIconSvg} /></div>
              <div>
                <p style={styles.kpiValue}>{sessions}</p>
                <p style={styles.kpiLabel}>Sessions</p>
              </div>
            </div>
            <div style={styles.kpiCard}>
              <div style={styles.kpiIcon}><img src={TimerIcon} alt="Timer" style={styles.homeIconSvg} /></div>
              <div>
                <p style={styles.kpiValue}>{formatTotalTime(totalTime)}</p>
                <p style={styles.kpiLabel}>Temps total</p>
              </div>
            </div>
            <div style={styles.kpiCard}>
              <div style={styles.kpiIcon}><img src={FlammeIcon} alt="Feu" style={styles.homeIconSvg} /></div>
              <div>
                <p style={styles.kpiValue}>{streak || 0}</p>
                <p style={styles.kpiLabel}>Jours consécutifs</p>
              </div>
            </div>
          </div>

          {/* GRAPHIQUE - 30 DERNIERS JOURS */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}><img src={StatsIcon} alt="Graphique" style={styles.menuIconSvg} /> Activité du mois (30 derniers jours)</h3>
            {isLoading ? (
              <div style={styles.emptyState}>
                <div style={styles.spinner} />
                <p style={styles.emptyText}>Chargement...</p>
              </div>
            ) : monthlyData.length > 0 && monthlyData.some(d => d.count > 0) ? (
              <div style={styles.barChart}>
                {monthlyData.map((data, index) => (
                  <div key={index} style={styles.barContainer}>
                    <div style={styles.barWrapper}>
                      <div
                        style={{
                          ...styles.bar,
                          height: `${getBarHeight(data.count)}%`,
                          backgroundColor: data.count > 0 ? "#34D399" : "rgba(255,255,255,0.1)",
                          transitionDelay: `${index * 0.05}s`,
                        }}
                      />
                    </div>
                    <span style={styles.barLabel}>{data.dayNumber}</span>
                    <span style={styles.barValue}>{data.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyChart}>
                <span style={styles.emptyChartIcon}><img src={StatsIcon} alt="Aucune donnée" style={styles.otherIconSvg} /></span>
                <p>Aucune session complétée ce mois-ci</p>
                <p style={styles.emptyChartSubtext}>Marque une session comme terminée pour voir tes stats !</p>
              </div>
            )}
          </div>

          {bestDay && bestDay.count > 0 && (
            <div style={styles.bestCard}>
              <div style={styles.bestIcon}><img src={TropheeIcon} alt="Trophée" style={styles.otherIconSvg} /></div>
              <div style={styles.bestInfo}>
                <p style={styles.bestTitle}>Meilleure performance</p>
                <p style={styles.bestDay}>{bestDay.day} {bestDay.date}</p>
                <p style={styles.bestStats}>
                  {bestDay.count} session{bestDay.count > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}

          <div style={styles.progressCard}>
            <h3 style={styles.progressTitle}><img src={CibleIcon} alt="Objectif" style={styles.menuIconSvg} /> Objectif du mois</h3>
            <div style={styles.progressBarContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${Math.min((sessions / 30) * 100, 100)}%`,
                }}
              />
            </div>
            <div style={styles.progressStats}>
              <span>{sessions} / 30 sessions</span>
              <span>{Math.min(Math.round((sessions / 30) * 100), 100)}%</span>
            </div>
          </div>

          <div style={styles.quoteCard}>
            <span style={styles.quoteIcon}><img src={MuscleIcon} alt="Citation" style={styles.homeIconSvg} /></span>
            <span style={styles.quoteText}>
              {sessions === 0 && "Commence dès aujourd'hui, chaque petit pas compte !"}
              {sessions > 0 && sessions < 10 && "Excellent début ! Continue comme ça ✨"}
              {sessions >= 10 && sessions < 30 && "Tu es sur la bonne voie, ne lâche rien ! 🚀"}
              {sessions >= 30 && "Performance exceptionnelle ! Tu déchires tout ! 🎯"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  // ... garde tous tes styles existants
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

  congratsCard: {
    background: "linear-gradient(135deg, #34D399, #22C55E)",
    borderRadius: "28px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    color: "white",
    boxShadow: "0 8px 20px rgba(52, 211, 153, 0.3)",
  },

  congratsIcon: { fontSize: "40px" },
  congratsTitle: { fontSize: "20px", fontWeight: "590", margin: 0 },
  congratsText: { fontSize: "14px", opacity: 0.9, margin: "4px 0 0 0" },

  kpiContainer: { display: "flex", gap: "14px", marginBottom: "20px" },
  kpiCard: {
    flex: 1,
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "24px",
    padding: "18px 12px",
    textAlign: "center",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  kpiIcon: { fontSize: "28px", marginBottom: "8px" },
  kpiValue: { fontSize: "24px", fontWeight: "590", color: "#34D399", marginBottom: "4px" },
  kpiLabel: { fontSize: "11px", fontWeight: "450", color: "#94A3B8", textTransform: "uppercase" },

  chartCard: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "28px",
    padding: "20px",
    marginBottom: "20px",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  chartTitle: { fontSize: "17px", fontWeight: "590", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" },

  barChart: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "180px",
    overflowX: "auto",
  },
  barContainer: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0, width: "32px" },
  barWrapper: { height: "120px", width: "32px", background: "rgba(255, 255, 255, 0.06)", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column-reverse" },
  bar: { width: "100%", borderRadius: "16px", transition: "height 0.5s ease" },
  barLabel: { fontSize: "10px", fontWeight: "450", color: "#94A3B8" },
  barValue: { fontSize: "10px", fontWeight: "450", color: "#34D399" },

  emptyChart: { textAlign: "center", padding: "40px 20px" },
  emptyChartIcon: { fontSize: "48px", display: "block", marginBottom: "16px", opacity: 0.5 },
  emptyChartSubtext: { fontSize: "12px", color: "#64748B", marginTop: "8px" },

  menuIconSvg: { width: "20px", height: "20px", opacity: 0.7 },
  homeIconSvg: { width: "28px", height: "28px", opacity: 0.7 },
  otherIconSvg: { width: "50px", height: "50px", opacity: 0.7 },

  bestCard: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  bestIcon: { fontSize: "36px" },
  bestInfo: { flex: 1 },
  bestTitle: { fontSize: "11px", fontWeight: "450", color: "#94A3B8", textTransform: "uppercase" },
  bestDay: { fontSize: "16px", fontWeight: "500", margin: "4px 0" },
  bestStats: { fontSize: "12px", color: "#34D399", fontWeight: "450" },

  progressCard: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    padding: "16px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  progressTitle: { fontSize: "14px", fontWeight: "590", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" },
  progressBarContainer: { height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px", overflow: "hidden" },
  progressBar: { height: "100%", background: "linear-gradient(90deg, #34D399, #22C55E)", borderRadius: "4px", transition: "width 0.5s ease" },
  progressStats: { display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11px", color: "#94A3B8" },

  quoteCard: {
    background: "rgba(52, 211, 153, 0.08)",
    borderRadius: "20px",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid rgba(52, 211, 153, 0.15)",
  },
  quoteIcon: { fontSize: "20px" },
  quoteText: { fontSize: "13px", fontWeight: "450", color: "#34D399", lineHeight: "1.4", flex: 1 },

  emptyState: { textAlign: "center", padding: "48px 20px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "28px" },
  emptyText: { fontSize: "17px", fontWeight: "450", color: "#94A3B8", marginBottom: "8px" },
  spinner: { width: "30px", height: "30px", border: "3px solid rgba(255, 255, 255, 0.1)", borderTopColor: "#34D399", borderRadius: "50%", margin: "0 auto 12px auto", animation: "spin 0.8s linear infinite" },
};

export default StatsPage;