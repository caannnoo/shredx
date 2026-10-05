// Express erstellt den Server
const express = require("express");

// Cors erlaubt React Frontend, Anfragen an Backend zu schicken
const cors = require("cors");

// PostgreSQL-Verbindung für DB-Abfragen
const pool = require("./db");

// Bcrypt verschlüsselt Passwörter und prüft Passwörter beim Login
const bcrypt = require("bcrypt");

// Express Session verwaltet die Login-Session
const session = require("express-session");

// Erstellt die Express-Anwendung (Backend)
const app = express();

// Port des Backends
const PORT = 3000;

// JSON vom Frontend wird als req.body lesbar
app.use(express.json());

// Dieses Frontend darf dem Backend anfragen stellen
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Login-Sessions / req.session werden ermöglicht
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.post("/api/register", async (req, res) => {
  const { firstName, lastName, gender, email, password, confirmPassword } =
    req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users
      (first_name, last_name, gender, email, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, gender, email, created_at`,
    [firstName, lastName, gender, email, passwordHash],
  );

  res.status(201).json({
    message: "Account successfully created",
    user: result.rows[0],
  });
});

app.post("/api/login", async (req, res) => {
  // Email und Passwort aus dem Request holen
  const { email, password } = req.body;

  // User anhand der Email in der Datenbank suchen
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  // Ersten gefundenen User speichern deswegen [0]
  const user = result.rows[0];

  // Prüfen, ob der User existiert
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // Eingegebenes Passwort mit dem gespeicherten Hash vergleichen
  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  // Login abbrechen, wenn das Passwort falsch ist
  if (!passwordMatches) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // Eingeloggten User in der Session speichern
  req.session.userId = user.id;

  // Prüfen, ob dieser User bereits ein Profil hat
  const profileResult = await pool.query(
    "SELECT id FROM profiles WHERE user_id = $1",
    [user.id],
  );

  // Prüft, ob mindestens ein Profil für den User gefunden wurde
  const hasProfile = profileResult.rows.length > 0;

  // Erfolgreiche Login-Antwort mit Profilstatus an das Frontend senden
  res.json({
    message: "Login successful",
    hasProfile,
  });
});

app.patch("/api/password", async (req, res) => {
  // Prüfen, ob User eingeloggt ist
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  const { currentPassword, newPassword } = req.body;

  // User aus der Datenbank holen
  const result = await pool.query(
    "SELECT password_hash FROM users WHERE id = $1",
    [req.session.userId],
  );

  const user = result.rows[0];

  // Aktuelles Passwort überprüfen
  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.password_hash,
  );

  if (!passwordMatches) {
    return res.status(401).json({
      message: "Current password is incorrect",
    });
  }

  // Neues Passwort hashen
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Neues Passwort speichern
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
    newPasswordHash,
    req.session.userId,
  ]);

  res.json({
    message: "Password successfully changed",
  });
});

app.get("/api/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  const result = await pool.query(
    `SELECT id, first_name, last_name, gender, email, created_at
     FROM users
     WHERE id = $1`,
    [req.session.userId],
  );

  res.json({
    user: result.rows[0],
  });
});

app.post("/api/profile", async (req, res) => {
  // Prüfen, ob der User eingeloggt ist
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Profildaten aus dem Request holen
  const {
    dateOfBirth,
    height,
    currentWeight,
    goalWeight,
    activityLevel,
    primaryGoal,
    weeklyGoal,
    protein,
    carbs,
    fat,
    dailyCalories,
  } = req.body;

  // Profil in der Datenbank speichern
  const result = await pool.query(
    `INSERT INTO profiles (
    user_id,
    date_of_birth,
    height_cm,
    current_weight_kg,
    goal_weight_kg,
    activity_level,
    primary_goal,
    weekly_goal_kg,
    protein_percent,
    carbs_percent,
    fat_percent,
    daily_calorie_goal
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)

  ON CONFLICT (user_id)
  DO UPDATE SET
    date_of_birth = EXCLUDED.date_of_birth,
    height_cm = EXCLUDED.height_cm,
    current_weight_kg = EXCLUDED.current_weight_kg,
    goal_weight_kg = EXCLUDED.goal_weight_kg,
    activity_level = EXCLUDED.activity_level,
    primary_goal = EXCLUDED.primary_goal,
    weekly_goal_kg = EXCLUDED.weekly_goal_kg,
    protein_percent = EXCLUDED.protein_percent,
    carbs_percent = EXCLUDED.carbs_percent,
    fat_percent = EXCLUDED.fat_percent,
    daily_calorie_goal = EXCLUDED.daily_calorie_goal,
    updated_at = CURRENT_TIMESTAMP

  RETURNING *`,
    [
      req.session.userId,
      dateOfBirth,
      height,
      currentWeight,
      goalWeight,
      activityLevel,
      primaryGoal,
      weeklyGoal,
      protein,
      carbs,
      fat,
      dailyCalories,
    ],
  );

  res.status(201).json({
    message: "Profile successfully saved",
    profile: result.rows[0],
  });
});

app.get("/api/profile", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  const result = await pool.query(
    `SELECT
    id,
    user_id,
    TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
    height_cm,
    current_weight_kg,
    goal_weight_kg,
    activity_level,
    primary_goal,
    weekly_goal_kg,
    protein_percent,
    carbs_percent,
    fat_percent,
    created_at,
    updated_at
  FROM profiles
  WHERE user_id = $1`,
    [req.session.userId],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Profile not found",
    });
  }

  res.json({
    profile: result.rows[0],
  });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Logout failed",
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      message: "Logout successful",
    });
  });
});

app.listen(PORT, () => {
  console.log(`Läuft auf Port ${PORT}`);
});
