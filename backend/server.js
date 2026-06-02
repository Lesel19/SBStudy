// backend/server.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ========== CONNEXION POSTGRESQL ==========
// Render fournit automatiquement DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requis pour Render PostgreSQL
  }
});

// Tester la connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Erreur connexion PostgreSQL:", err.stack);
  } else {
    console.log("✅ Connecté à PostgreSQL");
    release();
  }
});

// ========== CRÉATION DES TABLES ==========
async function initTables() {
  try {
    // Table des utilisateurs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Table users créée/vérifiée");

    // Table des matières
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        name TEXT,
        color TEXT,
        sessions INTEGER DEFAULT 0,
        hours INTEGER DEFAULT 0,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Table subjects créée/vérifiée");

    // Table des sessions programmées
    await pool.query(`
      CREATE TABLE IF NOT EXISTS planned_sessions (
        id SERIAL PRIMARY KEY,
        subject TEXT,
        date TEXT,
        time TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Table planned_sessions créée/vérifiée");

    // Table des statistiques
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        total_sessions INTEGER DEFAULT 0,
        total_time INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Table stats créée/vérifiée");

    // Table des questions personnalisées
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_questions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subject TEXT,
        question TEXT,
        answer TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Table user_questions créée/vérifiée");

  } catch (err) {
    console.error("❌ Erreur création tables:", err);
  }
}

// Initialiser les tables au démarrage
initTables();

// ========== ROUTES DE TEST ==========
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API SBStudy fonctionne avec PostgreSQL !" });
});

app.get("/test", (req, res) => {
  res.json({ message: "Backend fonctionne !" });
});

// ========== ROUTE DEBUG ==========
app.get("/debug/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email, username, created_at FROM users");
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== ROUTES AUTHENTIFICATION ==========

// Inscription
app.post("/register", async (req, res) => {
  let { email, username, password } = req.body;

  email = email?.trim().toLowerCase();
  username = username?.trim() || email.split("@")[0];

  console.log("📝 Tentative d'inscription:", { email, username });

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id",
      [email, username, hashedPassword]
    );
    
    const userId = result.rows[0].id;
    console.log("✅ Utilisateur créé, ID:", userId);

    // Créer les stats par défaut
    await pool.query(
      "INSERT INTO stats (user_id, total_sessions, total_time, streak) VALUES ($1, $2, $3, $4)",
      [userId, 0, 0, 0]
    );

    res.json({
      success: true,
      message: "Utilisateur créé avec succès",
      userId: userId,
      email: email,
      username: username
    });
  } catch (err) {
    console.error("Erreur inscription:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Connexion
app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim().toLowerCase();

  console.log("📝 Tentative de connexion:", { email });

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

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
      success: true,
      message: "Connexion réussie",
      userId: user.id,
      email: user.email,
      username: user.username || user.email.split("@")[0],
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ========== ROUTES UTILISATEUR ==========

app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, email, username, created_at FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { username } = req.body;
  
  if (!username || username.trim() === "") {
    return res.status(400).json({ error: "Le pseudo ne peut pas être vide" });
  }
  
  try {
    await pool.query("UPDATE users SET username = $1 WHERE id = $2", [username.trim(), userId]);
    res.json({ success: true, message: "Profil mis à jour", username: username.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== ROUTES MATIÈRES ==========

app.get("/subjects/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM subjects WHERE user_id = $1 ORDER BY name",
      [userId]
    );
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/subjects", async (req, res) => {
  const { name, color, userId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO subjects (name, color, sessions, hours, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, color, 0, 0, userId]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/subjects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM subjects WHERE id = $1", [id]);
    res.json({ message: "Matière supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== ROUTES SESSIONS PROGRAMMÉES ==========

app.get("/planned-sessions/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM planned_sessions WHERE user_id = $1 ORDER BY date, time",
      [userId]
    );
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/planned-sessions", async (req, res) => {
  const { subject, date, time, userId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO planned_sessions (subject, date, time, completed, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [subject, date, time, false, userId]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/planned-sessions/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    await pool.query("UPDATE planned_sessions SET completed = $1 WHERE id = $2", [completed, id]);
    res.json({ message: "Session mise à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/planned-sessions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM planned_sessions WHERE id = $1", [id]);
    res.json({ message: "Session supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== ROUTES STATISTIQUES ==========

app.get("/stats/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT total_sessions, total_time, streak FROM stats WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows[0] || { total_sessions: 0, total_time: 0, streak: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/stats/:userId", async (req, res) => {
  const { userId } = req.params;
  const { total_sessions, total_time, streak } = req.body;
  try {
    await pool.query(
      `INSERT INTO stats (user_id, total_sessions, total_time, streak) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
       total_sessions = EXCLUDED.total_sessions,
       total_time = EXCLUDED.total_time,
       streak = EXCLUDED.streak`,
      [userId, total_sessions, total_time, streak]
    );
    res.json({ message: "Stats mises à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== ROUTES IA (résumé) ==========
app.post("/api/ai/summary", (req, res) => {
  const { topic } = req.body;
  
  const summaries = {
    "pomodoro": "🍅 La méthode Pomodoro est une technique de gestion du temps développée par Francesco Cirillo...",
    "react": "⚛️ React est une bibliothèque JavaScript pour créer des interfaces utilisateur...",
    "javascript": "📜 JavaScript est un langage de programmation...",
    "html": "🌐 HTML est le langage de balisage standard...",
    "css": "🎨 CSS est le langage utilisé pour styliser...",
    "python": "🐍 Python est un langage polyvalent...",
    "sql": "🗄️ SQL est le langage standard pour gérer les bases de données..."
  };
  
  const summary = summaries[topic?.toLowerCase()] || `📚 Résumé pour "${topic}" : Continue tes révisions ! 💪`;
  res.json({ success: true, summary });
});

// ========== ROUTES IA QUESTIONS ==========

app.post("/api/ai/save-questions", async (req, res) => {
  const { userId, subject, questions } = req.body;
  
  if (!userId || !subject || !questions || questions.length === 0) {
    return res.status(400).json({ error: "Données incomplètes" });
  }
  
  try {
    await pool.query("DELETE FROM user_questions WHERE user_id = $1 AND subject = $2", [userId, subject]);
    
    for (const q of questions) {
      await pool.query(
        "INSERT INTO user_questions (user_id, subject, question, answer) VALUES ($1, $2, $3, $4)",
        [userId, subject, q.question, q.answer]
      );
    }
    
    res.json({ success: true, message: `${questions.length} questions sauvegardées`, count: questions.length });
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/ai/get-questions/:userId/:subject", async (req, res) => {
  const { userId, subject } = req.params;
  const decodedSubject = decodeURIComponent(subject);
  
  try {
    const result = await pool.query(
      "SELECT id, question, answer FROM user_questions WHERE user_id = $1 AND subject = $2",
      [userId, decodedSubject]
    );
    res.json({ success: true, questions: result.rows || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/ai/random-questions/:userId/:subject", async (req, res) => {
  const { userId, subject } = req.params;
  const decodedSubject = decodeURIComponent(subject);
  
  try {
    const result = await pool.query(
      "SELECT id, question, answer FROM user_questions WHERE user_id = $1 AND subject = $2",
      [userId, decodedSubject]
    );
    
    // Mélanger les questions
    const shuffled = [...(result.rows || [])];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    res.json({ success: true, questions: shuffled, count: shuffled.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== LANCEMENT ==========
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`✅ PostgreSQL connecté`);
  console.log(`🔧 Route debug: GET /debug/users`);
});