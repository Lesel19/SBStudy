// contexts/TimerContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getStats, updateStats } from '../services/api';

const TimerContext = createContext();

export function TimerProvider({ children }) {
  const WORK_TIME = 1500; // 25 minutes en secondes
  const BREAK_TIME = 300;  // 5 minutes en secondes

  const [time, setTime] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [completedSessionsList, setCompletedSessionsList] = useState([]);
  
  const intervalRef = useRef(null);

  // Réinitialiser toutes les stats
  const resetStats = () => {
    setSessions(0);
    setTotalTime(0);
    setStreak(0);
    setTime(WORK_TIME);
    setIsRunning(false);
    setIsBreak(false);
    setSelectedSubject(null);
    setShowCompletion(false);
    setCompletedSessionsList([]);
    localStorage.removeItem("completedSessions");
  };

  const resetTimerState = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setTime(WORK_TIME);
    setIsBreak(false);
    setShowCompletion(false);
  };

  const clearUserData = () => {
    resetTimerState();
    setSessions(0);
    setTotalTime(0);
    setStreak(0);
    setUserId(null);
    setCompletedSessionsList([]);
  };

  // Modifier manuellement le nombre de sessions
  const setSessionsManually = (newSessions) => {
    setSessions(newSessions);
    const newTotalTime = newSessions * (WORK_TIME / 60);
    setTotalTime(newTotalTime);
    
    if (userId) {
      saveStatsToServer(newSessions, newTotalTime, streak);
    }
  };

  const loadStatsFromServer = async () => {
    if (!userId) return;
    
    setIsLoadingStats(true);
    try {
      const stats = await getStats(userId);
      setSessions(stats.total_sessions || 0);
      setTotalTime(stats.total_time || 0);
      setStreak(stats.streak || 0);
      
      // Charger les sessions complétées depuis localStorage
      const savedSessions = localStorage.getItem("completedSessions");
      if (savedSessions) {
        setCompletedSessionsList(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const saveStatsToServer = async (newSessions, newTotalTime, newStreak) => {
    if (!userId) return;
    try {
      await updateStats(userId, newSessions, newTotalTime, newStreak);
    } catch (error) {
      console.error("Erreur sauvegarde stats:", error);
    }
  };

  // Enregistrer une session complétée
  const saveCompletedSession = (subject, date) => {
    const newSession = {
      id: Date.now(),
      subject: subject,
      date: date,
      duration: WORK_TIME / 60,
    };
    
    const updatedList = [...completedSessionsList, newSession];
    setCompletedSessionsList(updatedList);
    localStorage.setItem("completedSessions", JSON.stringify(updatedList));
    
    console.log(`✅ Session enregistrée: ${subject} le ${date}`);
  };

  // Récupérer les sessions d'aujourd'hui
  const getTodaySessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return completedSessionsList.filter(s => s.date === today);
  };

  // Récupérer le temps d'étude d'aujourd'hui
  const getTodayTotalTime = () => {
    const todaySessions = getTodaySessions();
    return todaySessions.length * (WORK_TIME / 60);
  };

  // Récupérer le nombre de sessions d'aujourd'hui
  const getTodaySessionCount = () => {
    return getTodaySessions().length;
  };

  // Charger les stats quand userId change
  useEffect(() => {
    if (userId) {
      loadStatsFromServer();
    }
  }, [userId]);

  // Timer principal
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (!isRunning || time === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time]);

  // FIN DU TIMER - Enregistrement des sessions
  // contexts/TimerContext.jsx — Ajoute/modifie ces fonctions

// Dans le useEffect de fin du timer, remplace par :
  useEffect(() => {
    if (time === 0 && isRunning) {
      const audio = new Audio("https://www.soundjay.com/buttons/beep-07.mp3");
      audio.play().catch(e => console.log(e));
      
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 3000);

      if (!isBreak) {
        const newSessions = sessions + 1;
        const newTotalTime = totalTime + WORK_TIME;
        setSessions(newSessions);
        setTotalTime(newTotalTime);
        saveStatsToServer(newSessions, newTotalTime, streak);
        
        // ⭐ Sauvegarde dans localStorage pour les stats
        const today = new Date().toISOString().split('T')[0];
        const newCompletedSession = {
          id: Date.now(),
          subject: selectedSubject,
          date: today,
          duration: WORK_TIME / 60
        };
        
        const savedSessions = localStorage.getItem("completedSessions");
        let completedList = savedSessions ? JSON.parse(savedSessions) : [];
        completedList.push(newCompletedSession);
        localStorage.setItem("completedSessions", JSON.stringify(completedList));
        setCompletedSessionsList(completedList);
        
        setTime(BREAK_TIME);
        setIsBreak(true);
        setIsRunning(true);
      } else {
        setTime(WORK_TIME);
        setIsBreak(false);
        setIsRunning(true);
      }
    }
  }, [time, isRunning, isBreak]);

  const startTimer = () => {
    if (!selectedSubject) {
      const toastEvent = new CustomEvent('showToast', { 
        detail: { message: "Sélectionne une matière avant de commencer", type: "warning" }
      });
      window.dispatchEvent(toastEvent);
      return;
    }
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTime(WORK_TIME);
    setIsBreak(false);
    setShowCompletion(false);
  };

  const skipBreak = () => {
    if (isBreak) {
      setIsRunning(false);
      setTime(WORK_TIME);
      setIsBreak(false);
    }
  };

  const formatTime = () => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercent = () => {
    const total = isBreak ? BREAK_TIME : WORK_TIME;
    return ((total - time) / total) * 100;
  };

// contexts/TimerContext.jsx — Vérifie le return
return (
  <TimerContext.Provider value={{
    time, isRunning, isBreak, sessions, totalTime, streak, selectedSubject,
    showCompletion, userId, // ⚠️ Vérifie que userId est bien ici
    isLoadingStats, completedSessionsList,
    getTodaySessions, getTodayTotalTime, getTodaySessionCount,
    startTimer, pauseTimer, resetTimer, skipBreak, setSelectedSubject,
    setUserId, loadStatsFromServer, resetStats, resetTimerState, clearUserData,
    formatTime, getProgressPercent,
  }}>
    {children}
  </TimerContext.Provider>
);
}

export function useTimer() {
  return useContext(TimerContext);
}