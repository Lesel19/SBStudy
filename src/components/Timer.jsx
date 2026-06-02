// components/Timer.jsx — Version avec stats par matière
import { useState, useEffect } from "react";
import { useTimer } from "../contexts/TimerContext";
import { getSubjects } from "../services/api";
import CibleIcon from "../assets/cible-icon.svg";
import LivreIcon from "../assets/livre-icon.svg";
import FlammeIcon from "../assets/flamme-icon.svg";
import PauseIcon from "../assets/pause-icon.svg";
import AttentionIcon from "../assets/attention-icon.svg";

function Timer() {
  const {
    time,
    isRunning,
    isBreak,
    selectedSubject,
    showCompletion,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
    formatTime,
    getProgressPercent,
    userId
  } = useTimer();

  const [subjectStats, setSubjectStats] = useState({ sessions: 0, minutes: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const progress = getProgressPercent();
  const radius = 92;
  const circumference = 2 * Math.PI * radius;

  // Charger les stats de la matière sélectionnée
  useEffect(() => {
    if (selectedSubject && userId) {
      loadSubjectStats();
    }
  }, [selectedSubject, userId]);

  const loadSubjectStats = async () => {
    setIsLoading(true);
    try {
      const subjects = await getSubjects(userId);
      const currentSubject = subjects.find(s => s.name === selectedSubject);
      if (currentSubject) {
        setSubjectStats({
          sessions: currentSubject.sessions || 0,
          minutes: (currentSubject.hours || 0) * 60
        });
      } else {
        setSubjectStats({ sessions: 0, minutes: 0 });
      }
    } catch (error) {
      console.error("Erreur chargement stats matière:", error);
      setSubjectStats({ sessions: 0, minutes: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour les stats quand une session se termine
  useEffect(() => {
    if (!isBreak && showCompletion && selectedSubject) {
      // Recharger les stats après une session complétée
      loadSubjectStats();
    }
  }, [showCompletion, isBreak, selectedSubject]);

  return (
    <div style={styles.container}>
      {/* Glow */}
      <div
        style={{
          ...styles.backgroundGlow,
          background: isBreak
            ? "rgba(52,211,153,0.18)"
            : "rgba(251,113,133,0.15)",
        }}
      />

      {/* Completion Toast */}
      {showCompletion && (
        <div style={styles.toast}>
          <span style={styles.toastEmoji}>✨</span>
          <span>
            {isBreak
              ? "Pause terminée, retour au focus 💪"
              : "Session terminée ! Prends une pause ☕"}
          </span>
        </div>
      )}

      {/* HEADER */}
      <div style={styles.header}>
        <div
          style={{
            ...styles.modeBadge,
            background: isBreak
              ? "linear-gradient(135deg,#34D399,#22C55E)"
              : "linear-gradient(135deg,#FB7185,#F43F5E)",
          }}
        >
          <img 
            src={isBreak ? PauseIcon : LivreIcon} 
            alt={isBreak ? "Pause" : "Focus"}
            style={styles.menuIconSvg}
          />
          <span>{isBreak ? "Pause" : "Focus"}</span>
        </div>

        <div style={styles.subjectChip}>
          <img src={LivreIcon} alt="Livre" style={styles.menuIconSvg} />
          <span style={styles.subjectText}>
            {selectedSubject || "Choisis une matière"}
          </span>
        </div>
      </div>

      {/* TIMER */}
      <div style={styles.timerSection}>
        <div style={styles.timerGlass}>
          <svg width="250" height="250" viewBox="0 0 250 250">
            <circle
              cx="125"
              cy="125"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="14"
            />
            <circle
              cx="125"
              cy="125"
              r={radius}
              fill="none"
              stroke={isBreak ? "#34D399" : "#FB7185"}
              strokeWidth="16"
              opacity="0.25"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress / 100)}
              style={{
                transition: "all 0.5s linear",
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
                filter: "blur(6px)",
              }}
            />
            <circle
              cx="125"
              cy="125"
              r={radius}
              fill="none"
              stroke={isBreak ? "#34D399" : "#FB7185"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress / 100)}
              style={{
                transition: "all 0.5s linear",
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>

          <div style={styles.timeContent}>
            <span style={styles.timeValue}>{formatTime()}</span>
            <span style={styles.timeLabel}>
              {isBreak ? "Moment de récupération" : "Session de concentration"}
            </span>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                  background: isBreak ? "#34D399" : "#FB7185",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* STATS PAR MATIÈRE */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {isLoading ? "..." : subjectStats.sessions}
          </span>
          <span style={styles.statLabel}>Sessions</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {isLoading ? "..." : Math.floor(subjectStats.minutes)}
          </span>
          <span style={styles.statLabel}>Minutes</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {selectedSubject ? (
              <img src={FlammeIcon} alt="Flamme" style={styles.homeIconSvg} />
            ) : (
              <img src={AttentionIcon} alt="Attention" style={styles.homeIconSvg} />
            )}
          </span>
          <span style={styles.statLabel}>
            {selectedSubject ? "Ready" : "Matière"}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div style={styles.buttonsContainer}>
        {!isRunning && !isBreak && time > 0 && (
          <button
            style={{
              ...styles.primaryButton,
              background: "linear-gradient(135deg,#FB7185,#F43F5E)",
            }}
            onClick={startTimer}
          >
            ▶ Démarrer
          </button>
        )}
        
        {isRunning && (
          <button style={styles.pauseButton} onClick={pauseTimer}>
            ⏸ Pause
          </button>
        )}
        
        {!isRunning && isBreak && (
          <button
            style={{
              ...styles.primaryButton,
              background: "linear-gradient(135deg,#34D399,#22C55E)",
            }}
            onClick={startTimer}
          >
            ▶ Reprendre
          </button>
        )}
        
        <button style={styles.secondaryButton} onClick={resetTimer}>
          ↺ Reset
        </button>
        
        {isBreak && !isRunning && (
          <button style={styles.secondaryButton} onClick={skipBreak}>
            ⏭ Passer
          </button>
        )}
      </div>

      {/* MOTIVATION */}
      <div style={styles.quoteCard}>
        <img src={CibleIcon} alt="Cible" style={styles.homeIconSvg} />
        <div>
          <div style={styles.quoteTitle}>Mode Deep Focus</div>
          <div style={styles.quoteText}>
            {isBreak
              ? "Respire, hydrate-toi et recharge ton attention."
              : selectedSubject
              ? `Chaque minute sur ${selectedSubject} te rapproche de tes objectifs.`
              : "Sélectionne une matière et entre dans ta zone de concentration."}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    overflow: "hidden",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "36px",
    padding: "26px",
    backdropFilter: "blur(24px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },

  backgroundGlow: {
    position: "absolute",
    width: "240px",
    height: "240px",
    borderRadius: "999px",
    top: "-80px",
    right: "-80px",
    filter: "blur(80px)",
    zIndex: 0,
  },

  toast: {
    position: "absolute",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 18px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    color: "#F8FAFC",
    fontSize: "13px",
    fontWeight: "450",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    zIndex: 20,
  },

  toastEmoji: { fontSize: "14px" },

  header: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },

  modeBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "999px",
    color: "white",
    fontSize: "13px",
    fontWeight: "480",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  },

  menuIconSvg: {
    width: "20px",
    height: "20px",
    opacity: 0.7,
  },

  homeIconSvg: {
    width: "28px",
    height: "28px",
    opacity: 0.7,
  },

  subjectChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: "10px 14px",
    borderRadius: "999px",
    color: "#CBD5E1",
    fontSize: "13px",
    fontWeight: "450",
  },

  subjectText: {
    maxWidth: "120px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  timerSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "28px",
  },

  timerGlass: {
    position: "relative",
    width: "250px",
    height: "250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  timeContent: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },

  timeValue: {
    fontSize: "48px",
    fontWeight: "590",
    color: "#F8FAFC",
    letterSpacing: "-2px",
    fontVariantNumeric: "tabular-nums",
  },

  timeLabel: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#94A3B8",
    fontWeight: "450",
  },

  progressBar: {
    marginTop: "16px",
    width: "110px",
    height: "5px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "0.5s ease",
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "14px",
    marginBottom: "24px",
  },

  statCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "24px",
    padding: "18px 12px",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    backdropFilter: "blur(14px)",
  },

  statValue: {
    fontSize: "24px",
    fontWeight: "500",
    color: "#F8FAFC",
  },

  statLabel: {
    fontSize: "11px",
    fontWeight: "450",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  buttonsContainer: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "22px",
  },

  primaryButton: {
    border: "none",
    color: "white",
    padding: "14px 22px",
    borderRadius: "18px",
    fontSize: "15px",
    fontWeight: "480",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    transition: "0.25s ease",
  },

  pauseButton: {
    border: "none",
    background: "linear-gradient(135deg, #F59E0B, #F97316)",
    color: "white",
    padding: "14px 22px",
    borderRadius: "18px",
    fontSize: "15px",
    fontWeight: "480",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(249,115,22,0.2)",
  },

  secondaryButton: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#F8FAFC",
    padding: "14px 18px",
    borderRadius: "18px",
    fontSize: "14px",
    fontWeight: "450",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
  },

  quoteCard: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    background: "linear-gradient(180deg, rgba(52,211,153,0.10), rgba(52,211,153,0.04))",
    border: "1px solid rgba(52,211,153,0.15)",
    borderRadius: "24px",
    padding: "18px",
  },

  quoteTitle: {
    color: "#34D399",
    fontWeight: "500",
    marginBottom: "6px",
    fontSize: "14px",
  },

  quoteText: {
    color: "#CBD5E1",
    fontSize: "13px",
    fontWeight: "450",
    lineHeight: "1.45",
  },
};

export default Timer;