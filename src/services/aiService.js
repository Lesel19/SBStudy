// services/aiService.js
const API_URL = "http://localhost:3001/api/ai";

// Générer un résumé
export const generateSummary = async (topic) => {
  try {
    const response = await fetch(`${API_URL}/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur generateSummary:", error);
    return { success: false, error: error.message };
  }
};

// Sauvegarder les questions personnalisées
export const saveUserQuestions = async (userId, subject, questions) => {
  console.log("📤 Envoi des données à save-questions:", { userId, subject, questionsCount: questions.length });
  
  try {
    const response = await fetch(`${API_URL}/save-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subject, questions }),
    });
    
    const data = await response.json();
    console.log("📥 Réponse de save-questions:", data);
    return data;
  } catch (error) {
    console.error("Erreur saveUserQuestions:", error);
    return { success: false, error: error.message };
  }
};

// Récupérer les questions d'un utilisateur pour un sujet (GET avec encodage)
export const getUserQuestions = async (userId, subject) => {
  try {
    const encodedSubject = encodeURIComponent(subject);
    const response = await fetch(`${API_URL}/get-questions/${userId}/${encodedSubject}`);
    const data = await response.json();
    console.log("📥 Réponse get-questions:", data);
    return data;
  } catch (error) {
    console.error("Erreur getUserQuestions:", error);
    return { success: false, questions: [] };
  }
};

// Récupérer les questions mélangées pour la révision (GET avec encodage)
export const getRandomQuestions = async (userId, subject) => {
  try {
    const encodedSubject = encodeURIComponent(subject);
    const response = await fetch(`${API_URL}/random-questions/${userId}/${encodedSubject}`);
    const data = await response.json();
    console.log("📥 Réponse random-questions:", data);
    return data;
  } catch (error) {
    console.error("Erreur getRandomQuestions:", error);
    return { success: false, questions: [] };
  }
};