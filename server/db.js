// PostgreSQL-Verbindungspool importieren
const { Pool } = require("pg");

// Pfad-Modul von Node.js importieren
const path = require("node:path");

// .env-Datei zuverlässig aus dem server-Ordner laden
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

// PostgreSQL-Verbindungspool mit den Daten aus der .env erstellen
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// PostgreSQL-Verbindungspool für andere Dateien exportieren
module.exports = pool;
