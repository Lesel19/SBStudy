// components/AIGenerator.jsx — Version sans fichiers SVG manquants
import React, { useState } from "react";
import { generateSummary, generateQuestions } from "../services/aiService";

function AIGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentType, setContentType] = useState("summary");
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setGeneratedContent(null);
    
    try {
      let result;
      if (contentType === "summary") {
        result = await generateSummary(topic);
        if (result?.success) {
          setGeneratedContent({ type: "summary", content: result.summary });
        }
      } else {
        result = await generateQuestions(topic, 6);
        if (result?.success) {
          setGeneratedContent({ type: "questions", content: result.questions });
        }
      }
    } catch (error) {
      console.error("Erreur génération:", error);
      setGeneratedContent({ 
        type: "error", 
        content: "Une erreur est survenue. Réessaie plus tard." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = generatedContent?.type === "summary" 
      ? generatedContent.content 
      : generatedContent?.content?.join("\n\n");
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const getPlaceholder = () => {
    if (contentType === "summary") {
      return "Ex: JavaScript, React, Pomodoro, CSS, Python...";
    }
    return "Ex: JavaScript, React, HTML, SQL...";
  };

  return (
    <>
      {/* Bouton flottant IA */}
      <button
        onClick={() => setIsOpen(true)}
        style={styles.fab}
        className="ai-fab"
      >
        <span style={styles.fabEmoji}>✨</span>
        <span style={styles.fabText}>IA</span>
      </button>

      {/* Modal IA */}
      {isOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitleContainer}>
                <span style={styles.modalIcon}>🧠</span>
                <h2 style={styles.modalTitle}>Assistant IA</h2>
              </div>
              <button style={styles.closeButton} onClick={() => setIsOpen(false)}>✕</button>
            </div>

            {/* Sélection du type */}
            <div style={styles.typeSelector}>
              <button
                style={{ ...styles.typeButton, ...(contentType === "summary" && styles.typeButtonActive) }}
                onClick={() => setContentType("summary")}
              >
                📝 Générer un résumé
              </button>
              <button
                style={{ ...styles.typeButton, ...(contentType === "questions" && styles.typeButtonActive) }}
                onClick={() => setContentType("questions")}
              >
                ❓ Générer des questions
              </button>
            </div>

            {/* Zone de saisie */}
            <div style={styles.inputArea}>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={getPlaceholder()}
                style={styles.input}
                onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
              />
              <button
                style={styles.generateButton}
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim()}
              >
                {isLoading ? (
                  <div style={styles.spinner} />
                ) : (
                  <>
                    <span>✨</span> Générer
                  </>
                )}
              </button>
            </div>

            {/* Résultat généré */}
            {generatedContent && (
              <div style={styles.resultArea}>
                <div style={styles.resultHeader}>
                  <span style={styles.resultIcon}>
                    {generatedContent.type === "summary" ? "📝" : "❓"}
                  </span>
                  <span style={styles.resultTitle}>
                    {generatedContent.type === "summary" ? "Résumé" : "Questions de révision"}
                  </span>
                  <button style={styles.copyButton} onClick={handleCopy} title="Copier">
                    {copySuccess ? "✅" : "📋"}
                  </button>
                </div>
                <div style={styles.resultContent}>
                  {generatedContent.type === "summary" ? (
                    <p style={styles.summaryText}>{generatedContent.content}</p>
                  ) : generatedContent.type === "questions" ? (
                    <div style={styles.questionsList}>
                      {generatedContent.content.map((q, index) => (
                        <div key={index} style={styles.questionItem}>
                          <span style={styles.questionNumber}>{index + 1}</span>
                          <span style={styles.questionText}>{q}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.errorText}>{generatedContent.content}</p>
                  )}
                </div>
              </div>
            )}

            {/* Message d'aide */}
            {!generatedContent && !isLoading && (
              <div style={styles.helpArea}>
                <span style={styles.helpIcon}>💡</span>
                <span style={styles.helpText}>
                  {contentType === "summary" 
                    ? "Entre un sujet (ex: JavaScript, React, CSS) et l'IA génère un résumé clair et concis pour t'aider à réviser."
                    : "Entre un sujet et l'IA génère des questions pour tester tes connaissances."}
                </span>
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
    bottom: "90px",
    right: "20px",
    width: "56px",
    height: "56px",
    borderRadius: "28px",
    background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
    zIndex: 998,
    transition: "all 0.3s ease",
  },
  fabEmoji: { fontSize: "20px" },
  fabText: { color: "white", fontSize: "12px", fontWeight: "600" },
  
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
    maxHeight: "80vh",
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
  modalTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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
  
  typeSelector: {
    display: "flex",
    padding: "16px 20px 0 20px",
    gap: "12px",
  },
  typeButton: {
    flex: 1,
    padding: "10px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "40px",
    color: "#94A3B8",
    fontSize: "13px",
    fontWeight: "480",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  typeButtonActive: {
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    color: "#8B5CF6",
  },
  
  inputArea: {
    padding: "20px",
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "40px",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    background: "rgba(255,255,255,0.06)",
    color: "#F8FAFC",
    fontSize: "14px",
    fontWeight: "450",
    outline: "none",
    fontFamily: "inherit",
  },
  generateButton: {
    padding: "14px 24px",
    borderRadius: "40px",
    border: "none",
    background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
    color: "white",
    fontSize: "14px",
    fontWeight: "480",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  
  resultArea: {
    margin: "0 20px 20px 20px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(139, 92, 246, 0.15)",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 18px",
    background: "rgba(139, 92, 246, 0.08)",
    borderBottom: "1px solid rgba(139, 92, 246, 0.15)",
  },
  resultIcon: { fontSize: "18px" },
  resultTitle: { flex: 1, fontSize: "14px", fontWeight: "590", color: "#8B5CF6" },
  copyButton: {
    background: "rgba(255,255,255,0.06)",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  resultContent: {
    padding: "18px",
    maxHeight: "300px",
    overflowY: "auto",
  },
  summaryText: {
    color: "#CBD5E1",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: 0,
  },
  questionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  questionItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  questionNumber: {
    width: "24px",
    height: "24px",
    background: "rgba(139, 92, 246, 0.15)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
    color: "#8B5CF6",
    flexShrink: 0,
  },
  questionText: {
    flex: 1,
    color: "#CBD5E1",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  errorText: { color: "#FB7185", fontSize: "14px", textAlign: "center" },
  
  helpArea: {
    display: "flex",
    gap: "12px",
    padding: "16px 20px 20px 20px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  helpIcon: { fontSize: "18px" },
  helpText: {
    flex: 1,
    color: "#64748B",
    fontSize: "12px",
    lineHeight: "1.4",
  },
};

// Injecter les animations
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default AIGenerator;