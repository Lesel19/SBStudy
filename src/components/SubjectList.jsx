// components/SubjectList.jsx — Version avec blocage pendant le timer
import React, { useState, useEffect } from "react";
import { useTimer } from "../contexts/TimerContext";
import { getSubjects, addSubject, deleteSubject } from "../services/api";
import ModifierIcon from "../assets/modifier-icon.svg";
import SupprimerIcon from "../assets/supprimer-icon.svg";
import LivresIcon from "../assets/livres-icon.svg";
import AjouterIcon from "../assets/ajouter-icon.svg";
import VideIcon from "../assets/vide-icon.svg";
import AttentionIcon from "../assets/attention-icon.svg";
import BlockerIcon from "../assets/blocker-icon.svg";

function SubjectList() {
  const { 
    setSelectedSubject, 
    selectedSubject, 
    userId, 
    isRunning,     // ← Ajouté : état du timer
    isBreak        // ← Ajouté : si on est en pause
  } = useTimer();
  
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Vérifier si le timer est actif
  const isTimerActive = isRunning || isBreak;

  useEffect(() => {
    if (userId) loadSubjects();
  }, [userId]);

  const loadSubjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getSubjects(userId);
      setSubjects(data || []);
    } catch (error) {
      console.error("Erreur chargement:", error);
      setError("Erreur chargement des matières");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    
    if (isTimerActive) {
      setError("⏳ Termine ta session en cours avant d'ajouter une matière");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    if (!newSubject.trim()) {
      setError("Veuillez entrer un nom de matière");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    const colors = ["#34D399", "#10B981", "#F43F5E", "#F59E0B", "#3B82F6", "#8B5CF6"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    try {
      await addSubject(newSubject.trim(), randomColor, userId);
      await loadSubjects();
      setNewSubject("");
    } catch (error) {
      setError("Erreur lors de l'ajout");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (isTimerActive) {
      setError("⏳ Termine ta session en cours avant de supprimer une matière");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    if (window.confirm("Supprimer cette matière ?")) {
      try {
        await deleteSubject(id);
        await loadSubjects();
        if (subjects.length === 1 && selectedSubject) setSelectedSubject(null);
      } catch (error) {
        setError("Erreur lors de la suppression");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const startEditing = (subject) => {
    if (isTimerActive) {
      setError("⏳ Termine ta session en cours avant de modifier une matière");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setEditingId(subject.id);
    setEditingName(subject.name);
  };

  const saveEditing = (id) => {
    if (!editingName.trim()) return;
    setSubjects(subjects.map((s) => s.id === id ? { ...s, name: editingName.trim() } : s));
    setEditingId(null);
    setEditingName("");
    if (selectedSubject === subjects.find(s => s.id === id)?.name) {
      setSelectedSubject(editingName.trim());
    }
  };

  const handleSelectSubject = (subject) => {
    // ⭐ Bloquer la sélection si le timer est actif
    if (isTimerActive && selectedSubject !== subject.name) {
      setError("⏳ Une session est en cours ! Réinitialise ou termine ta session avant de changer de matière.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setSelectedSubject(subject.name);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <img src={LivresIcon} alt="Livres" style={styles.menuIconSvg} />
          Matières à réviser
          {isTimerActive && (
            <span style={styles.lockBadge}><img src={BlockerIcon} alt="Verrou" style={styles.menuIconSvg} /> Session en cours</span>
          )}
        </h3>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}><img src={AttentionIcon} alt="Erreur" style={styles.menuIconSvg} /></span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      <div style={styles.subjectList}>
        {isLoading && (
          <div style={styles.emptyState}>
            <div style={styles.spinner} />
            <p style={styles.emptyText}>Chargement...</p>
          </div>
        )}
        {!isLoading && subjects.length === 0 && (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}><img src={VideIcon} alt="Vide" style={styles.otherIconSvg} /></span>
            <p style={styles.emptyText}>Aucune matière</p>
            <p style={styles.emptySubtext}>Ajoute ta première matière</p>
          </div>
        )}
        {!isLoading && subjects.map((subject) => (
          <div
            key={subject.id}
            style={{
              ...styles.subjectCard,
              border: selectedSubject === subject.name ? "1px solid #34D399" : "1px solid rgba(255,255,255,0.05)",
              background: selectedSubject === subject.name ? "rgba(52, 211, 153, 0.08)" : "rgba(255,255,255,0.03)",
              opacity: isTimerActive && selectedSubject !== subject.name ? 0.6 : 1,
              cursor: isTimerActive && selectedSubject !== subject.name ? "not-allowed" : "pointer",
            }}
            onClick={() => handleSelectSubject(subject)}
          >
            <div style={styles.subjectContent}>
              <div style={{ ...styles.subjectColor, backgroundColor: subject.color }} />
              {editingId === subject.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => saveEditing(subject.id)}
                  onKeyPress={(e) => e.key === "Enter" && saveEditing(subject.id)}
                  autoFocus
                  style={styles.editInput}
                />
              ) : (
                <div style={styles.subjectInfo}>
                  <div style={styles.subjectNameWrapper}>
                    <span style={styles.subjectName}>{subject.name}</span>
                    {selectedSubject === subject.name && <span style={styles.selectedBadge}>✓ sélectionnée</span>}
                    {isTimerActive && selectedSubject === subject.name && (
                      <span style={styles.activeBadge}>⏳ en cours</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={styles.subjectActions}>
              <button 
                style={styles.editButton} 
                onClick={(e) => { e.stopPropagation(); startEditing(subject); }}
                disabled={isTimerActive}
              >
                <img src={ModifierIcon} alt="Modifier" style={styles.menuIconSvg} />
              </button>
              <button 
                style={styles.deleteButton} 
                onClick={(e) => { e.stopPropagation(); handleDeleteSubject(subject.id); }}
                disabled={isTimerActive}
              >
                <img src={SupprimerIcon} alt="Supprimer" style={styles.menuIconSvg} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddSubject} style={styles.addForm}>
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder={isTimerActive ? "Session en cours..." : "Nouvelle matière..."}
          disabled={isTimerActive}
          style={{
            ...styles.addInput,
            opacity: isTimerActive ? 0.5 : 1,
          }}
        />
        <button 
          type="submit" 
          style={{
            ...styles.addButton,
            opacity: isTimerActive ? 0.5 : 1,
            cursor: isTimerActive ? "not-allowed" : "pointer",
          }}
          disabled={isTimerActive}
        >
          <img src={AjouterIcon} alt="Ajouter" style={styles.menuIconSvg} />
        </button>
      </form>

      {isTimerActive && (
        <div style={styles.warningCard}>
          <span style={styles.warningIcon}>⏳</span>
          <span style={styles.warningText}>
            Une session est en cours. Réinitialise ou termine ton Pomodoro pour changer de matière.
          </span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { width: "100%" },

  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "16px" 
  },

  title: {
    fontSize: "17px",
    fontWeight: "590",
    color: "#F8FAFC",
    margin: 0,
    letterSpacing: "-0.3px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  lockBadge: {
    fontSize: "11px",
    fontWeight: "450",
    color: "#F59E0B",
    background: "rgba(245, 158, 11, 0.15)",
    padding: "3px 10px",
    borderRadius: "20px",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(251, 113, 133, 0.15)",
    padding: "10px 14px",
    borderRadius: "12px",
    marginBottom: "12px",
  },
  errorIcon: { fontSize: "14px" },
  errorText: { fontSize: "13px", color: "#FB7185", flex: 1 },

  menuIconSvg: { width: "20px", height: "20px", opacity: 0.7 },

  subjectList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "400px",
    overflowY: "auto",
    marginBottom: "16px",
  },

  userIconSvg: { width: "40px", height: "40px", opacity: 0.7 },
  menuIconSvg: { width: "20px", height: "20px", opacity: 0.7 },
  otherIconSvg: { width: "50px", height: "50px", opacity: 0.7 },
  homeIconSvg: { width: "28px", height: "28px", opacity: 0.7 },

  subjectCard: {
    borderRadius: "20px",
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s ease",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },

  subjectContent: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flex: 1,
    minWidth: 0,
  },

  subjectColor: {
    width: "10px",
    height: "40px",
    borderRadius: "6px",
    flexShrink: 0,
  },

  subjectInfo: {
    flex: 1,
    minWidth: 0,
  },

  subjectNameWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  subjectName: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#F8FAFC",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "160px",
  },

  selectedBadge: {
    fontSize: "10px",
    fontWeight: "480",
    color: "#34D399",
    background: "rgba(52, 211, 153, 0.12)",
    padding: "2px 8px",
    borderRadius: "20px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  activeBadge: {
    fontSize: "10px",
    fontWeight: "480",
    color: "#F59E0B",
    background: "rgba(245, 158, 11, 0.15)",
    padding: "2px 8px",
    borderRadius: "20px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  editInput: {
    fontSize: "15px",
    fontWeight: "500",
    padding: "6px 0",
    border: "none",
    borderBottom: "2px solid #34D399",
    background: "transparent",
    outline: "none",
    fontFamily: "inherit",
    width: "140px",
    color: "#F8FAFC",
  },

  subjectActions: {
    display: "flex",
    gap: "10px",
    flexShrink: 0,
  },

  editButton: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "none",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButton: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "none",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  addForm: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
  },

  addInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "40px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "rgba(255, 255, 255, 0.06)",
    color: "#F8FAFC",
    outline: "none",
  },

  addButton: {
    padding: "0 20px",
    borderRadius: "40px",
    border: "none",
    background: "linear-gradient(135deg, #34D399, #22C55E)",
    color: "white",
    fontSize: "14px",
    fontWeight: "480",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  warningCard: {
    background: "rgba(245, 158, 11, 0.1)",
    borderRadius: "16px",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    marginTop: "8px",
  },

  warningIcon: { fontSize: "18px" },
  warningText: { fontSize: "12px", fontWeight: "450", color: "#F59E0B", lineHeight: "1.4", flex: 1 },

  emptyState: {
    textAlign: "center",
    padding: "32px 20px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "20px",
  },

  emptyIcon: { fontSize: "40px", display: "block", marginBottom: "12px", opacity: 0.5 },
  emptyText: { fontSize: "15px", fontWeight: "450", color: "#94A3B8", marginBottom: "6px" },
  emptySubtext: { fontSize: "12px", color: "#64748B" },
  spinner: { width: "30px", height: "30px", border: "3px solid rgba(255, 255, 255, 0.1)", borderTopColor: "#34D399", borderRadius: "50%", margin: "0 auto 12px auto", animation: "spin 0.8s linear infinite" },
};

export default SubjectList;