// Lädt Umgebungsvariablen aus der .env-Datei im Server-Ordner
const path = require("node:path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

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

// Express-Information aus den HTTP-Headern entfernen
app.disable("x-powered-by");

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
  // Registrierungsdaten aus dem Request-Body auslesen
  const { firstName, lastName, gender, email, password, confirmPassword } =
    req.body;

  // Registrierung abbrechen, wenn die Passwörter nicht übereinstimmen
  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  // Passwort hashen, bevor es in der Datenbank gespeichert wird
  const passwordHash = await bcrypt.hash(password, 10);

  // Neuen User in der PostgreSQL-Datenbank speichern
  const result = await pool.query(
    `INSERT INTO users
      (first_name, last_name, gender, email, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, gender, email, created_at`,
    [firstName, lastName, gender, email, passwordHash],
  );

  // Erfolgreiche Registrierung mit dem erstellten User an das Frontend zurückgeben
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

  console.log("Login-E-Mail:", email);
  console.log("User gefunden:", !!user);

  // Prüfen, ob der User existiert
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // Eingegebenes Passwort mit dem gespeicherten Hash vergleichen
  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  console.log("Passwort stimmt:", passwordMatches);

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

  // Aktuelles und neues Passwort aus dem Request-Body auslesen
  const { currentPassword, newPassword } = req.body;

  // Passwort-Hash des eingeloggten Users aus der Datenbank abrufen
  const result = await pool.query(
    "SELECT password_hash FROM users WHERE id = $1",
    [req.session.userId],
  );

  // Gefundenen User aus dem Datenbankergebnis speichern
  const user = result.rows[0];

  // Eingegebenes aktuelles Passwort mit dem gespeicherten Hash vergleichen
  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.password_hash,
  );

  // Passwortänderung abbrechen, wenn das aktuelle Passwort falsch ist
  if (!passwordMatches) {
    return res.status(401).json({
      message: "Current password is incorrect",
    });
  }

  // Neues Passwort hashen
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Neuen Passwort-Hash beim eingeloggten User in der Datenbank speichern
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
    newPasswordHash,
    req.session.userId,
  ]);

  res.json({
    message: "Password successfully changed",
  });
});

app.get("/api/me", async (req, res) => {
  // Anfrage abbrechen, wenn kein User eingeloggt ist
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Daten des eingeloggten Users aus der Datenbank abrufen
  const result = await pool.query(
    `SELECT id, first_name, last_name, gender, email, created_at
     FROM users
     WHERE id = $1`,
    [req.session.userId],
  );

  // Daten des eingeloggten Users an das Frontend senden
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

  // Profildaten aus dem Request-Body auslesen
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

  // Profildaten des eingeloggten Users in der Datenbank speichern +
  // Neues Profil erstellen oder bestehendes Profil des Users aktualisieren +
  // Gespeichertes bzw. aktualisiertes Profil vollständig zurückgeben
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
  // Anfrage abbrechen, wenn kein User eingeloggt ist
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Profildaten des eingeloggten Users aus der Datenbank abrufen
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
    daily_calorie_goal,
    created_at,
    updated_at
  FROM profiles
  WHERE user_id = $1`,
    [req.session.userId],
  );

  // Anfrage abbrechen, wenn für den User noch kein Profil existiert
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
    // Fehler beim Löschen der Session abfangen
    if (error) {
      return res.status(500).json({
        message: "Logout failed",
      });
    }

    // Session-Cookie im Browser löschen
    res.clearCookie("connect.sid");

    // Erfolgreichen Logout an das Frontend melden
    res.json({
      message: "Logout successful",
    });
  });
});

app.get("/api/foods", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM foods ORDER BY name");

    res.json(result.rows);
  } catch (error) {
    console.error("Fehler beim Laden der Lebensmittel:", error);
    res.status(500).json({
      message: "Lebensmittel konnten nicht geladen werden.",
    });
  }
});

app.get("/api/foods/search", async (req, res) => {
  try {
    // Suchbegriff aus der URL holen
    const searchTerm = req.query.q?.trim();

    if (!searchTerm) {
      return res.status(400).json({
        message: "Bitte einen Suchbegriff eingeben.",
      });
    }

    // Suchbegriff sicher für die URL kodieren
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&json=1&page_size=20`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "ShredX/1.0 (Node.js; learning-project)",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.log("Open Food Facts Status:", response.status);

      return res.status(502).json({
        message: "Open Food Facts ist nicht erreichbar.",
        status: response.status,
      });
    }

    const data = await response.json();

    const foods = (data.products ?? []).map((product) => ({
      name: product.product_name || "Unbekanntes Lebensmittel",
      barcode: product.code,
      calories_per_100g: product.nutriments?.["energy-kcal_100g"] ?? null,
      protein_per_100g: product.nutriments?.proteins_100g ?? null,
      carbs_per_100g: product.nutriments?.carbohydrates_100g ?? null,
      fat_per_100g: product.nutriments?.fat_100g ?? null,
    }));

    res.json(foods);
  } catch (error) {
    console.error("Fehler bei Open Food Facts:", error);

    res.status(500).json({
      message: "Lebensmittelsuche fehlgeschlagen.",
    });
  }
});

app.post("/api/foods/manual", async (req, res) => {
  const { name, calories, protein, carbs, fat } = req.body;

  if (
    !name?.trim() ||
    [calories, protein, carbs, fat].some(
      (value) =>
        value === "" ||
        value == null ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0,
    )
  ) {
    return res.status(400).json({
      message: "Bitte gültige Nährwerte eingeben.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO foods (
        name,
        calories_per_100g,
        protein_per_100g,
        carbs_per_100g,
        fat_per_100g
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name.trim(), calories, protein, carbs, fat],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Fehler beim Speichern:", error);

    res.status(500).json({
      message: "Lebensmittel konnte nicht gespeichert werden.",
    });
  }
});

app.post("/api/food-entries", async (req, res) => {
  // Nur eingeloggte User dürfen Essen eintragen
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Bitte zuerst einloggen.",
    });
  }

  const { foodId, trackingDate, mealType, amount } = req.body;

  if (
    !Number.isInteger(Number(foodId)) ||
    Number(foodId) <= 0 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(trackingDate ?? "") ||
    !["breakfast", "lunch", "dinner", "snacks"].includes(mealType) ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0
  ) {
    return res.status(400).json({
      message: "Ungültige Lebensmitteldaten.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO food_entries
        (user_id, food_id, tracking_date, meal_type, amount_g)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, foodId, trackingDate, mealType, amount],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Fehler beim Speichern der Mahlzeit:", error);

    res.status(500).json({
      message: "Mahlzeit konnte nicht gespeichert werden.",
    });
  }
});

app.get("/api/food-entries", async (req, res) => {
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Bitte zuerst einloggen.",
    });
  }

  const { date } = req.query;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
    return res.status(400).json({
      message: "Bitte ein gültiges Datum angeben.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT
         fe.id,
         fe.meal_type,
         fe.amount_g,
         f.name,
         ROUND(f.calories_per_100g * fe.amount_g / 100, 1) AS calories,
         ROUND(f.protein_per_100g * fe.amount_g / 100, 1) AS protein_g,
         ROUND(f.carbs_per_100g * fe.amount_g / 100, 1) AS carbs_g,
         ROUND(f.fat_per_100g * fe.amount_g / 100, 1) AS fat_g
       FROM food_entries fe
       JOIN foods f ON fe.food_id = f.id
       WHERE fe.user_id = $1
         AND fe.tracking_date = $2
       ORDER BY fe.id`,
      [userId, date],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fehler beim Laden der Mahlzeiten:", error);

    res.status(500).json({
      message: "Mahlzeiten konnten nicht geladen werden.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Läuft auf Port ${PORT}`);
});
