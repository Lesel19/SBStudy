// components/AIRevision.jsx — Version corrigée
import React, { useState, useEffect } from "react";
import { useTimer } from "../contexts/TimerContext";
import { saveUserQuestions, getUserQuestions, getRandomQuestions } from "../services/aiService";
import BrainIcon from "../assets/brain-icon.svg";
import ModifierIcon from "../assets/modifier-icon.svg";
import LivreIcon from "../assets/livre-icon.svg";
import StatsIcon from "../assets/stats-icon.svg";
import AjouterIcon from "../assets/ajouter-icon.svg";
import CibleIcon from "../assets/cible-icon.svg";
import AmpouleIcon from "../assets/ampoule-icon.svg";
import InterrogationIcon from "../assets/interrogation-icon.svg";
import ResetIcon from "../assets/reset-icon.svg";
import LoupeIcon from "../assets/loupe-icon.svg";
import QuestionIcon from "../assets/question-icon.svg";
import SuivantIcon from "../assets/suivant-icon.svg";
import TropheeIcon from "../assets/trophee-icon.svg";

function AIRevision() {
  const { userId, selectedSubject } = useTimer();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Charger les questions quand le modal s'ouvre ou que la matière change
  useEffect(() => {
    if (userId && selectedSubject && isOpen) {
      loadSavedQuestions();
    }
  }, [userId, selectedSubject, isOpen]);

  const loadSavedQuestions = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      console.log("🔍 Chargement des questions pour:", selectedSubject);
      const result = await getUserQuestions(userId, selectedSubject);
      console.log("📥 Résultat chargement:", result);
      
      if (result?.success) {
        const questionsList = result.questions || [];
        setSavedQuestions(questionsList);
        console.log(`✅ ${questionsList.length} questions chargées`);
        if (questionsList.length === 0) {
          setMessage("📝 Aucune question enregistrée pour cette matière");
        }
      } else {
        setSavedQuestions([]);
        setMessage("📝 Aucune question enregistrée pour cette matière");
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
      setSavedQuestions([]);
      setMessage("❌ Erreur lors du chargement des questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      setMessage("❓ Veuillez entrer une question");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    if (!newAnswer.trim()) {
      setMessage("❓ Veuillez entrer la réponse");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    const allQuestions = [
      ...savedQuestions,
      { question: newQuestion.trim(), answer: newAnswer.trim() }
    ];
    
    setIsLoading(true);
    try {
      const result = await saveUserQuestions(userId, selectedSubject, allQuestions);
      console.log("📥 Réponse sauvegarde:", result);
      
      if (result?.success) {
        await loadSavedQuestions(); // Recharger après sauvegarde
        setNewQuestion("");
        setNewAnswer("");
        setMessage(`✅ ${result.message || "Question ajoutée !"}`);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ ${result?.error || "Erreur lors de la sauvegarde"}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
      setMessage("❌ Erreur lors de la sauvegarde");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartReview = async () => {
    if (!selectedSubject) {
      setMessage("📚 Sélectionne d'abord une matière");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    if (savedQuestions.length === 0) {
      setMessage("📝 Aucune question enregistrée pour cette matière");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await getRandomQuestions(userId, selectedSubject);
      console.log("🎲 Questions aléatoires reçues:", result);
      
      if (result?.success && result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        setCurrentQuestionIndex(0);
        setShowAnswer(false);
        setMode("review");
      } else {
        setMessage("📝 Aucune question disponible pour la révision");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("❌ Erreur lors du chargement des questions");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    } else {
      setMessage("🎉 Félicitations ! Tu as terminé toutes les questions !");
      setTimeout(() => setMessage(""), 3000);
      setMode("add");
      setQuestions([]);
      loadSavedQuestions();
    }
  };

  const handleReset = () => {
    setMode("add");
    setQuestions([]);
    setShowAnswer(false);
    loadSavedQuestions();
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <button onClick={() => setIsOpen(true)} style={styles.fab}>
        <span style={styles.fabEmoji}><img src={BrainIcon} alt="Brain" style={styles.menuIconSvg} /></span>
        <span style={styles.fabText}>SBQuiz</span>
      </button>

      {isOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={styles.modalIcon}><img src={ModifierIcon} alt="Modifier" style={styles.menuIconSvg} /></span>
              <h2 style={styles.modalTitle}>Assistant Révision</h2>
              <button style={styles.closeButton} onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div style={styles.subjectBadge}>
              <span><img src={LivreIcon} alt="Livre" style={styles.menuIconSvg} /> Matière : </span>
              <strong>{selectedSubject || "Aucune matière sélectionnée"}</strong>
            </div>

            {message && (
              <div style={styles.messageBox}>
                <span>{message}</span>
              </div>
            )}

            {mode === "add" ? (
              <div style={styles.addMode}>
                <div style={styles.statsBox}>
                  <span><img src={StatsIcon} alt="Stats" style={styles.menuIconSvg} /> Questions enregistrées : </span>
                  <strong>{savedQuestions.length}</strong>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Question :</label>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ex: Qu'est-ce qu'une closure en JavaScript ?"
                    style={styles.textarea}
                    rows={3}
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Réponse :</label>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Ex: Une closure est une fonction qui a accès aux variables de son scope parent..."
                    style={styles.textarea}
                    rows={3}
                  />
                </div>
                
                <button
                  style={styles.addButton}
                  onClick={handleAddQuestion}
                  disabled={isLoading}
                >
                  {isLoading ? "⏳ Sauvegarde..." : " Ajouter la question"}
                </button>
                
                {savedQuestions.length > 0 && (
                  <button
                    style={styles.reviewButton}
                    onClick={handleStartReview}
                    disabled={isLoading}
                  >
                    <img src={CibleIcon} alt="Cible" style={styles.menuIconSvg} /> Commencer la révision ({savedQuestions.length} questions)
                  </button>
                )}
              </div>
            ) : (
              <div style={styles.reviewMode}>
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                  }} />
                </div>
                <div style={styles.progressText}>
                  Question {currentQuestionIndex + 1} / {questions.length}
                </div>
                
                <div style={styles.questionCard}>
                  <div style={styles.questionIcon}><img src={InterrogationIcon} alt="Question" style={styles.menuIconSvg} /></div>
                  <div style={styles.questionText}>{currentQuestion?.question}</div>
                </div>
                
                {!showAnswer ? (
                  <button
                    style={styles.showAnswerButton}
                    onClick={() => setShowAnswer(true)}
                  >
                    <img src={LoupeIcon} alt="Loupe" style={styles.menuIconSvg} /> Voir la réponse
                  </button>
                ) : (
                  <div style={styles.answerCard}>
                    <div style={styles.answerIcon}><img src={AmpouleIcon} alt="Ampoule" style={styles.menuIconSvg} /></div>
                    <div style={styles.answerText}>{currentQuestion?.answer}</div>
                  </div>
                )}
                
                <div style={styles.reviewButtons}>
                  <button style={styles.resetButton} onClick={handleReset}> <img src={ResetIcon} alt="Reset" style={styles.menuIconSvg} /> Retour</button>
                  <button style={styles.nextButton} onClick={handleNextQuestion}>
                    {currentQuestionIndex + 1 === questions.length ? (
                      <>
                        <img src={TropheeIcon} alt="Terminer" style={styles.menuIconSvg} />  Terminer
                       
                      </>
                    ) : (
                      <>
                        Suivante
                        <img src={SuivantIcon} alt="Suivant" style={styles.menuIconSvg} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === "add" && savedQuestions.length > 0 && (
              <div style={styles.questionsList}>
                <div style={styles.questionsListTitle}>📋 Mes questions</div>
                {savedQuestions.map((q, i) => (
                  <div key={i} style={styles.savedQuestionItem}>
                    <span style={styles.savedQuestionNumber}>{i + 1}</span>
                    <span style={styles.savedQuestionText}>{q.question?.substring(0, 50)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: "160px",
    right: "20px",
    width: "90px",
    height: "65px",
    borderRadius: "28px",
    background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
    zIndex: 998,
  },
  fabEmoji: { fontSize: "22px" },
  fabText: { color: "white", fontSize: "11px", fontWeight: "600" },
  
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(8px)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "90%",
    maxWidth: "500px",
    maxHeight: "85vh",
    background: "rgba(15, 23, 42, 0.98)",
    backdropFilter: "blur(24px)",
    borderRadius: "32px",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    overflow: "hidden",
    animation: "scaleIn 0.2s ease",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  modalIcon: { fontSize: "24px" },
  modalTitle: { fontSize: "20px", fontWeight: "590", color: "#F8FAFC", margin: 0 },
  closeButton: {
    width: "32px",
    height: "32px",
    borderRadius: "16px",
    border: "none",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
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
  
  subjectBadge: {
    margin: "16px 20px",
    padding: "10px 16px",
    background: "rgba(139, 92, 246, 0.12)",
    borderRadius: "40px",
    fontSize: "13px",
    color: "#CBD5E1",
    textAlign: "center",
  },
  
  messageBox: {
    margin: "0 20px 16px 20px",
    padding: "10px 16px",
    background: "rgba(52, 211, 153, 0.12)",
    borderRadius: "12px",
    color: "#34D399",
    fontSize: "13px",
    textAlign: "center",
  },
  
  addMode: { padding: "0 20px 20px 20px" },
  statsBox: {
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "16px",
    textAlign: "center",
    marginBottom: "20px",
    color: "#94A3B8",
    fontSize: "13px",
  },
  inputGroup: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "8px", color: "#CBD5E1", fontSize: "13px", fontWeight: "480" },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "16px",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    background: "rgba(255,255,255,0.06)",
    color: "#F8FAFC",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  },
  addButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "40px",
    border: "none",
    background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
    color: "white",
    fontSize: "14px",
    fontWeight: "480",
    cursor: "pointer",
    marginBottom: "12px",
  },
  reviewButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "40px",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    background: "transparent",
    color: "#8B5CF6",
    fontSize: "14px",
    fontWeight: "480",
    cursor: "pointer",
  },
  
  reviewMode: { padding: "0 20px 20px 20px" },
  progressBar: { height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginBottom: "8px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#8B5CF6", borderRadius: "2px", transition: "width 0.3s ease" },
  progressText: { textAlign: "center", fontSize: "12px", color: "#64748B", marginBottom: "20px" },
  
  questionCard: {
    background: "rgba(139, 92, 246, 0.08)",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "20px",
    border: "1px solid rgba(139, 92, 246, 0.15)",
  },
  questionIcon: { fontSize: "32px", textAlign: "center", marginBottom: "12px" },
  questionText: { color: "#F8FAFC", fontSize: "16px", lineHeight: "1.5", textAlign: "center" },
  
  showAnswerButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "40px",
    border: "none",
    background: "linear-gradient(135deg, #34D399, #10B981)",
    color: "white",
    fontSize: "14px",
    fontWeight: "480",
    cursor: "pointer",
    marginBottom: "20px",
  },
  
  answerCard: {
    background: "rgba(52, 211, 153, 0.1)",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "20px",
    border: "1px solid rgba(52, 211, 153, 0.2)",
    animation: "fadeIn 0.3s ease",
  },
  answerIcon: { fontSize: "28px", textAlign: "center", marginBottom: "12px" },
  answerText: { color: "#CBD5E1", fontSize: "14px", lineHeight: "1.5" },
  
  reviewButtons: { display: "flex", gap: "12px" },
  resetButton: { flex: 1, padding: "12px", borderRadius: "40px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94A3B8", fontSize: "14px", cursor: "pointer" },
  nextButton: { flex: 2, padding: "12px", borderRadius: "40px", border: "none", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "white", fontSize: "14px", fontWeight: "480", cursor: "pointer" },
  
  questionsList: {
    margin: "0 20px 20px 20px",
    padding: "16px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "20px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  questionsListTitle: { fontSize: "13px", fontWeight: "590", color: "#8B5CF6", marginBottom: "12px" },
  savedQuestionItem: { display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "12px", color: "#CBD5E1" },
  savedQuestionNumber: { width: "22px", height: "22px", background: "rgba(139, 92, 246, 0.15)", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#8B5CF6" },
  savedQuestionText: { flex: 1, color: "#94A3B8" },
};

export default AIRevision;