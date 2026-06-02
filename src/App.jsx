// App.jsx — Version avec redirection automatique vers auth et chargement amélioré
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTimer } from "./contexts/TimerContext";

import AuthPage from "./pages/AuthPage";
import Home from "./components/Home";
import SessionPlanner from "./components/SessionPlanner";
import StatsPage from "./pages/StatsPage";
import Timer from "./components/Timer";
import SplashScreen from "./components/SplashScreen";
import BottomNav from "./components/BottomNav";
import Profile from "./pages/Profile";
import About from "./pages/About";

// Composant pour protéger les routes
function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const { setUserId, resetStats, loadStatsFromServer, clearUserData } = useTimer();
  const hasCheckedAuth = useRef(false);

  // Fonction pour définir l'utilisateur après connexion
  const handleSetUser = (email, userId, username) => {
    setUser(email);
    setUserId(userId);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", username || email.split("@")[0]);
  };

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    
    const checkAuth = async () => {
      setIsLoading(true);
      const savedUserId = localStorage.getItem("userId");
      const savedUserEmail = localStorage.getItem("userEmail");
      
      if (savedUserId && savedUserEmail) {
        console.log("🔑 Restauration userId:", savedUserId);
        setUser(savedUserEmail);
        setUserId(parseInt(savedUserId));
        try {
          await loadStatsFromServer();
        } catch (error) {
          console.error("Erreur chargement stats:", error);
        }
      } else {
        resetStats();
        setUser(null);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [setUserId, resetStats, loadStatsFromServer]);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    clearUserData();
    setUser(null);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <Router>
      <div className="main-content" style={{ paddingBottom: "80px", minHeight: "100vh" }}>
        <Routes>
          {/* Page d'authentification - accessible uniquement si non connecté */}
          <Route 
            path="/auth" 
            element={
              !user ? (
                <AuthPage setUser={handleSetUser} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Redirection par défaut : si connecté → home, sinon → auth */}
          <Route 
            path="/" 
            element={
              user ? (
                <Home user={user} setUser={handleSetUser} />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
          
          {/* Routes protégées (nécessitent authentification) */}
          <Route 
            path="/sessions" 
            element={
              <ProtectedRoute user={user}>
                <SessionPlanner setUser={handleSetUser} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/stats" 
            element={
              <ProtectedRoute user={user}>
                <StatsPage setUser={handleSetUser} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/subjects" 
            element={
              <ProtectedRoute user={user}>
                <Timer />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute user={user}>
                <Profile setUser={handleSetUser} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/about" 
            element={
              <ProtectedRoute user={user}>
                <About setUser={handleSetUser} />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirection 404 */}
          <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
        </Routes>
      </div>
      {user && <BottomNav />}
    </Router>
  );
}

const styles = {
  loaderContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg, #0F172A 0%, #111827 100%)",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(52, 211, 153, 0.2)",
    borderTopColor: "#34D399",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

function App() {
  return <AppContent />;
}

export default App;