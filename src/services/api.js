// frontend/src/services/api.js
// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
console.log("🔗 API URL:", API_URL); // Ajoute ce log temporaire
// Headers par défaut
const headers = {
  "Content-Type": "application/json",
};

// ========== AUTHENTIFICATION ==========
export const register = async (email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password }),
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