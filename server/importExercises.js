const pool = require("./db");

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/exercises.json");

const exercises = JSON.parse(fs.readFileSync(filePath, "utf8"));

async function importExercises() {
  try {
    console.log("Starte Übungsimport...");

    console.log("Anzahl der Übungen:", exercises.length);

    const dbCheck = await pool.query("SELECT current_database()");

    console.log("Verbundene Datenbank:", dbCheck.rows[0].current_database);

    if (dbCheck.rows[0].current_database !== "shredx") {
      throw new Error("Falsche Datenbank! Import gestoppt.");
    }

    console.log("Datenbankprüfung erfolgreich!");

    const result = await pool.query("SELECT COUNT(*) FROM public.exercises");

    if (Number(result.rows[0].count) > 0) {
      console.log("Übungen bereits vorhanden. Import abgebrochen.");
      return;
    }

    for (const exercise of exercises) {
      await pool.query(
        `INSERT INTO public.exercises
     (name, primary_muscles, secondary_muscles,
      equipment, category, instructions, images)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          exercise.name,
          exercise.primaryMuscles,
          exercise.secondaryMuscles,
          exercise.equipment,
          exercise.category,
          exercise.instructions,
          exercise.images,
        ],
      );
    }

    console.log("Alle Übungen erfolgreich importiert!");
  } catch (error) {
    console.error("Fehler beim Import:", error);
  } finally {
    await pool.end();
  }
}

importExercises();
