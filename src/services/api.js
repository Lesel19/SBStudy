// frontend/src/services/api.js

// Récupération de l'URL de l'API depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

console.log("🔗 API URL:", API_URL);

// Headers par défaut
const headers = {
  "Content-Type": "application/json",
};

// ========== AUTHENTIFICATION ==========
export const register = async (email, password, username = null) => {
  const body = username 
    ? JSON.stringify({ email, username, password })
    : JSON.stringify({ email, password });
  
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers,
    body,
  });
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// ========== UTILISATEUR ==========
export const getUser = async (userId) => {
  const response = await fetch(`${API_URL}/user/${userId}`);
  return response.json();
};

export const updateUser = async (userId, username) => {
  const response = await fetch(`${API_URL}/user/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ username }),
  });
  return response.json();
};

// ========== MATIÈRES ==========
export const getSubjects = async (userId) => {
  const response = await fetch(`${API_URL}/subjects/${userId}`);
  return response.json();
};

export const addSubject = async (name, color, userId) => {
  const response = await fetch(`${API_URL}/subjects`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, color, userId }),
  });
  return response.json();
};

export const updateSubject = async (id, sessions, hours) => {
  const response = await fetch(`${API_URL}/subjects/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ sessions, hours }),
  });
  return response.json();
};

export const deleteSubject = async (id) => {
  const response = await fetch(`${API_URL}/subjects/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

// ========== SESSIONS PROGRAMMÉES ==========
export const getPlannedSessions = async (userId) => {
  const response = await fetch(`${API_URL}/planned-sessions/${userId}`);
  return response.json();
};

export const addPlannedSession = async (subject, date, time, userId) => {
  const response = await fetch(`${API_URL}/planned-sessions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ subject, date, time, userId }),
  });
  return response.json();
};

export const updatePlannedSession = async (id, completed) => {
  const response = await fetch(`${API_URL}/planned-sessions/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ completed }),
  });
  return response.json();
};

export const deletePlannedSession = async (id) => {
  const response = await fetch(`${API_URL}/planned-sessions/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

// ========== STATISTIQUES ==========
export const getStats = async (userId) => {
  const response = await fetch(`${API_URL}/stats/${userId}`);
  return response.json();
};

export const updateStats = async (userId, total_sessions, total_time, streak) => {
  const response = await fetch(`${API_URL}/stats/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ total_sessions, total_time, streak }),
  });
  return response.json();
};

// Export de l'URL pour utilisation dans d'autres fichiers si besoin
export { API_URL };