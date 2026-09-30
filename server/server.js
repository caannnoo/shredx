const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
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

  // Gefundenen User speichern
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

  const hasProfile = profileResult.rows.length > 0;

  res.json({
    message: "Login successful",
    hasProfile,
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

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
