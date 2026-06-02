// backend/server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Base de données
const db = new sqlite3.Database(path.join(__dirname, "studyplanner.db"));

// ========== CRÉATION DES TABLES ==========
db.serialize(() => {
  // Table des utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      username TEXT,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Force l'ID à commencer à 1000
  db.run("DELETE FROM sqlite_sequence WHERE name='users'");
  db.run("INSERT INTO sqlite_sequence (name, seq) VALUES ('users', 999)");
  
  // Ajouter la colonne username si elle n'existe pas
  db.all("PRAGMA table_info(users)", (err, columns) => {
    if (err) return;
    const hasUsername = columns.some(col => col.name === "username");
    if (!hasUsername) {
      db.run("ALTER TABLE users ADD COLUMN username TEXT");
      console.log("✅ Colonne username ajoutée");
    }
  });

  // Table des matières
  db.run(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      color TEXT,
      sessions INTEGER DEFAULT 0,
      hours INTEGER DEFAULT 0,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Table des sessions programmées
  db.run(`
    CREATE TABLE IF NOT EXISTS planned_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT,
      date TEXT,
      time TEXT,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Table des statistiques
  db.run(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_sessions INTEGER DEFAULT 0,
      total_time INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      user_id INTEGER UNIQUE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Table des questions personnalisées pour l'IA
  db.run(`
    CREATE TABLE IF NOT EXISTS user_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      subject TEXT,
      question TEXT,
      answer TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log("✅ Tables créées/vérifiées");
  console.log("📌 Les IDs utilisateur commenceront à 1000");
});

// ========== ROUTES DE TEST ==========
app.get("/test", (req, res) => {
  res.json({ message: "Backend fonctionne !" });
});

// ========== ROUTES AUTHENTIFICATION ==========

// Inscription
app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  console.log("📝 Tentative d'inscription:", { email, username });

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [email, username || email.split("@")[0], hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
          }
          console.error("Erreur DB inscription:", err);
          return res.status(500).json({ error: "Erreur serveur" });
        }

        const userId = this.lastID;
        console.log("✅ Utilisateur créé, ID:", userId);

        db.run(
          "INSERT INTO stats (user_id, total_sessions, total_time, streak) VALUES (?, ?, ?, ?)",
          [userId, 0, 0, 0]
        );

        res.json({
          message: "Utilisateur créé avec succès",
          userId: userId,
        });
      }
    );
  } catch (err) {
    console.error("Erreur inscription:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Connexion
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("📝 Tentative de connexion:", { email });

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error("Erreur DB:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (!user) {
      console.log("❌ Utilisateur non trouvé:", email);
      return res.status(400).json({ error: "Email ou mot de passe incorrect" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("❌ Mot de passe incorrect pour:", email);
      return res.status(400).json({ error: "Email ou mot de passe incorrect" });
    }

    console.log("✅ Connexion réussie pour:", email, "ID:", user.id);
    res.json({
      message: "Connexion réussie",
      userId: user.id,
      email: user.email,
      username: user.username || user.email.split("@")[0],
    });
  });
});

// Ajoute après app.use(express.json())
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API SBStudy fonctionne" });
});
// ========== ROUTES UTILISATEUR ==========

app.get("/user/:userId", (req, res) => {
  const { userId } = req.params;
  db.get(
    "SELECT id, email, username, created_at FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err || !user) return res.status(404).json({ error: "Utilisateur non trouvé" });
      res.json(user);
    }
  );
});

app.put("/user/:userId", (req, res) => {
  const { userId } = req.params;
  const { username } = req.body;
  if (!username || username.trim() === "") {
    return res.status(400).json({ error: "Le pseudo ne peut pas être vide" });
  }
  db.run("UPDATE users SET username = ? WHERE id = ?", [username.trim(), userId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Profil mis à jour", username });
  });
});

// ========== ROUTES MATIÈRES ==========

app.get("/subjects/:userId", (req, res) => {
  const { userId } = req.params;
  db.all("SELECT * FROM subjects WHERE user_id = ? ORDER BY name", [userId], (err, subjects) => {
    res.json(subjects || []);
  });
});

app.post("/subjects", (req, res) => {
  const { name, color, userId } = req.body;
  db.run(
    "INSERT INTO subjects (name, color, sessions, hours, user_id) VALUES (?, ?, ?, ?, ?)",
    [name, color, 0, 0, userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.delete("/subjects/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM subjects WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Matière supprimée" });
  });
});

// ========== ROUTES SESSIONS PROGRAMMÉES ==========

app.get("/planned-sessions/:userId", (req, res) => {
  const { userId } = req.params;
  db.all("SELECT * FROM planned_sessions WHERE user_id = ? ORDER BY date, time", [userId], (err, sessions) => {
    res.json(sessions || []);
  });
});

app.post("/planned-sessions", (req, res) => {
  const { subject, date, time, userId } = req.body;
  db.run(
    "INSERT INTO planned_sessions (subject, date, time, completed, user_id) VALUES (?, ?, ?, ?, ?)",
    [subject, date, time, 0, userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put("/planned-sessions/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.run("UPDATE planned_sessions SET completed = ? WHERE id = ?", [completed ? 1 : 0, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Session mise à jour" });
  });
});

app.delete("/planned-sessions/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM planned_sessions WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Session supprimée" });
  });
});

// ========== ROUTES STATISTIQUES ==========

app.get("/stats/:userId", (req, res) => {
  const { userId } = req.params;
  db.get("SELECT total_sessions, total_time, streak FROM stats WHERE user_id = ?", [userId], (err, stats) => {
    res.json(stats || { total_sessions: 0, total_time: 0, streak: 0 });
  });
});

// backend/server.js — Remplace les routes POST par GET

// Récupérer les questions (GET)
app.get("/api/ai/get-questions/:userId/:subject", (req, res) => {
  const { userId, subject } = req.params;
  const decodedSubject = decodeURIComponent(subject);
  
  console.log("📖 Récupération questions GET pour:", { userId, subject: decodedSubject });
  
  db.all(
    "SELECT id, question, answer FROM user_questions WHERE user_id = ? AND subject = ?",
    [userId, decodedSubject],
    (err, questions) => {
      if (err) {
        console.error("Erreur DB:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log(`✅ ${questions?.length || 0} questions trouvées`);
      res.json({ success: true, questions: questions || [] });
    }
  );
});

// Récupérer les questions mélangées (GET)
app.get("/api/ai/random-questions/:userId/:subject", (req, res) => {
  const { userId, subject } = req.params;
  const decodedSubject = decodeURIComponent(subject);
  
  console.log("🎲 Récupération questions aléatoires GET pour:", { userId, subject: decodedSubject });
  
  db.all(
    "SELECT id, question, answer FROM user_questions WHERE user_id = ? AND subject = ?",
    [userId, decodedSubject],
    (err, questions) => {
      if (err) {
        console.error("Erreur DB:", err);
        return res.status(500).json({ error: err.message });
      }
      
      const shuffled = [...(questions || [])];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      res.json({ success: true, questions: shuffled, count: shuffled.length });
    }
  );
});

app.put("/stats/:userId", (req, res) => {
  const { userId } = req.params;
  const { total_sessions, total_time, streak } = req.body;
  db.run(
    `INSERT INTO stats (user_id, total_sessions, total_time, streak) 
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
     total_sessions = excluded.total_sessions,
     total_time = excluded.total_time,
     streak = excluded.streak`,
    [userId, total_sessions, total_time, streak],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Stats mises à jour" });
    }
  );
});

// ========== ROUTES IA ==========

// Générer un résumé
app.post("/api/ai/summary", (req, res) => {
  const { topic } = req.body;
  
  console.log("🤖 Génération de résumé pour:", topic);
  
  const summaries = {
    "pomodoro": "🍅 La méthode Pomodoro est une technique de gestion du temps développée par Francesco Cirillo. Elle consiste à travailler par intervalles de 25 minutes, séparés par des pauses de 5 minutes.",
    "react": "⚛️ React est une bibliothèque JavaScript pour créer des interfaces utilisateur. Elle utilise un DOM virtuel et des composants réutilisables.",
    "javascript": "📜 JavaScript est un langage de programmation qui rend les pages web interactives.",
    "html": "🌐 HTML est le langage de balisage standard pour créer des pages web.",
    "css": "🎨 CSS est le langage utilisé pour styliser les pages web.",
    "python": "🐍 Python est un langage polyvalent, facile à apprendre.",
    "sql": "🗄️ SQL est le langage standard pour gérer les bases de données."
  };
  
  const lowerTopic = topic?.toLowerCase() || "";
  const summary = summaries[lowerTopic] || `📚 Résumé pour "${topic}" : Continue tes révisions ! 💪`;
  
  res.json({ success: true, summary });
});

// Sauvegarder les questions personnalisées
app.post("/api/ai/save-questions", (req, res) => {
  const { userId, subject, questions } = req.body;
  
  console.log("📝 Sauvegarde des questions pour:", subject, "par user:", userId);
  console.log("📝 Nombre de questions:", questions?.length);
  
  if (!userId || !subject || !questions || questions.length === 0) {
    return res.status(400).json({ error: "Données incomplètes" });
  }
  
  db.run("DELETE FROM user_questions WHERE user_id = ? AND subject = ?", [userId, subject]);
  
  let inserted = 0;
  questions.forEach(q => {
    db.run(
      "INSERT INTO user_questions (user_id, subject, question, answer) VALUES (?, ?, ?, ?)",
      [userId, subject, q.question, q.answer],
      (err) => {
        if (err) console.error("Erreur insertion:", err);
        else inserted++;
      }
    );
  });
  
  setTimeout(() => {
    res.json({ 
      success: true, 
      message: `${inserted} questions sauvegardées pour "${subject}"`,
      count: inserted
    });
  }, 100);
});

// Récupérer les questions (POST)
app.post("/api/ai/get-questions", (req, res) => {
  const { userId, subject } = req.body;
  
  console.log("📖 Récupération questions pour:", { userId, subject });
  
  if (!userId || !subject) {
    return res.status(400).json({ error: "userId et subject requis" });
  }
  
  db.all(
    "SELECT id, question, answer FROM user_questions WHERE user_id = ? AND subject = ?",
    [userId, subject],
    (err, questions) => {
      if (err) {
        console.error("Erreur DB:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log(`✅ ${questions?.length || 0} questions trouvées`);
      res.json({ success: true, questions: questions || [] });
    }
  );
});

// Récupérer les questions mélangées (POST)
app.post("/api/ai/random-questions", (req, res) => {
  const { userId, subject } = req.body;
  
  console.log("🎲 Récupération questions aléatoires pour:", { userId, subject });
  
  if (!userId || !subject) {
    return res.status(400).json({ error: "userId et subject requis" });
  }
  
  db.all(
    "SELECT id, question, answer FROM user_questions WHERE user_id = ? AND subject = ?",
    [userId, subject],
    (err, questions) => {
      if (err) {
        console.error("Erreur DB:", err);
        return res.status(500).json({ error: err.message });
      }
      
      // Mélanger les questions
      const shuffled = [...(questions || [])];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      res.json({ success: true, questions: shuffled, count: shuffled.length });
    }
  );
});

// ========== LANCEMENT ==========
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📁 Base de données: ${path.join(__dirname, "studyplanner.db")}`);
  console.log(`✅ Tables créées/vérifiées`);
  console.log(`📌 Les IDs utilisateur commenceront à 1000`);
  console.log(`🤖 Routes IA activées :`);
  console.log(`   - POST /api/ai/summary`);
  console.log(`   - POST /api/ai/save-questions`);
  console.log(`   - POST /api/ai/get-questions`);
  console.log(`   - POST /api/ai/random-questions\n`);
});