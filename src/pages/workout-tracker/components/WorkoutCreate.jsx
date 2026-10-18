import "./workoutCreate.css";
import { useState, useEffect } from "react";

function WorkoutCreate({ onClose }) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState("all");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  const muscleGroups = [
    { label: "All", value: "all" },
    { label: "Chest", value: "chest" },
    { label: "Back", value: "back" },
    { label: "Shoulders", value: "shoulders" },
    { label: "Biceps", value: "biceps" },
    { label: "Triceps", value: "triceps" },
    { label: "Forearms", value: "forearms" },
    { label: "Legs", value: "legs" },
    { label: "Abs", value: "abdominals" },
    { label: "Neck", value: "neck" },
  ];

  const weekDays = [
    { label: "Mon", value: "monday" },
    { label: "Tue", value: "tuesday" },
    { label: "Wed", value: "wednesday" },
    { label: "Thu", value: "thursday" },
    { label: "Fri", value: "friday" },
    { label: "Sat", value: "saturday" },
    { label: "Sun", value: "sunday" },
  ];

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await fetch("http://localhost:3000/api/exercises");

        if (!response.ok) {
          throw new Error("Übungen konnten nicht geladen werden");
        }

        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error("Fehler beim Laden der Übungen:", error);
      }
    }

    loadExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const muscleMap = {
      back: ["lats", "middle back", "lower back"],
      shoulders: ["shoulders", "traps"],
      legs: [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "adductors",
        "abductors",
      ],
    };

    const targetMuscles = muscleMap[selectedMuscle] || [selectedMuscle];

    const matchesMuscle =
      selectedMuscle === "all" ||
      exercise.primary_muscles?.some((muscle) =>
        targetMuscles.includes(muscle),
      );

    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(exerciseSearch.trim().toLowerCase());

    return matchesMuscle && matchesSearch;
  });

  async function handleSaveWorkout() {
    const workoutData = {
      name: workoutName,
      trainingDays: selectedDays,
      exercises: selectedExercises.map((exercise, index) => ({
        exerciseId: exercise.id,
        position: index + 1,
        targetSets: exercise.target_sets ?? 3,
      })),
    };

    try {
      const response = await fetch("http://localhost:3000/api/workouts", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error("Workout konnte nicht gesendet werden");
      }

      const result = await response.json();
      console.log("Backend-Antwort:", result);
    } catch (error) {
      console.error("Fehler beim Senden:", error);
    }
  }

  return (
    <div className="workout-create">
      <div className="workout-create-content">
        <button
          type="button"
          className="workout-create-close"
          onClick={onClose}
        >
          ✕
        </button>
        <h2>Create Workout</h2>
        <p>Erstelle deinen eigenen Trainingsplan.</p>
        <div className="workout-create-field">
          <label htmlFor="workout-name">Workout Name</label>

          <input
            id="workout-name"
            type="text"
            placeholder="z. B. Push Day"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </div>
        <div className="workout-days">
          <h3>Training Days</h3>

          <div className="workout-days-buttons">
            {weekDays.map((day) => (
              <button
                key={day.value}
                type="button"
                className={
                  selectedDays.includes(day.value)
                    ? "workout-day-btn active"
                    : "workout-day-btn"
                }
                onClick={() => {
                  setSelectedDays((prev) =>
                    prev.includes(day.value)
                      ? prev.filter((item) => item !== day.value)
                      : [...prev, day.value],
                  );
                }}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
        <div className="workout-muscle-filters">
          <h3>Choose Exercises</h3>

          <div className="workout-exercise-search">
            <input
              type="text"
              placeholder="Search exercises..."
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
            />
          </div>

          <div className="workout-muscle-buttons">
            {muscleGroups.map((muscle) => (
              <button
                key={muscle.value}
                type="button"
                className={
                  selectedMuscle === muscle.value
                    ? "workout-muscle-btn active"
                    : "workout-muscle-btn"
                }
                onClick={() => setSelectedMuscle(muscle.value)}
              >
                {muscle.label}
              </button>
            ))}
          </div>
        </div>
        <div className="workout-exercise-list">
          {filteredExercises.map((exercise) => (
            <div className="workout-exercise-item" key={exercise.id}>
              <div className="workout-exercise-info">
                <span>{exercise.name}</span>
              </div>

              <div className="workout-exercise-actions">
                <button
                  type="button"
                  className="workout-exercise-details"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  Details
                </button>

                <button
                  type="button"
                  className="workout-exercise-add"
                  onClick={() => {
                    setSelectedExercises((prev) => {
                      const alreadyAdded = prev.some(
                        (item) => item.id === exercise.id,
                      );

                      if (alreadyAdded) {
                        return prev;
                      }

                      return [...prev, exercise];
                    });
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
        {selectedExercise && (
          <div className="workout-exercise-detail-overlay">
            <div className="workout-exercise-detail-content">
              <button
                type="button"
                className="workout-exercise-detail-close"
                onClick={() => setSelectedExercise(null)}
              >
                ✕
              </button>

              <h2>{selectedExercise.name}</h2>
              <div className="workout-exercise-detail-images">
                {selectedExercise.images?.map((image, index) => (
                  <img
                    key={index}
                    src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${image}`}
                    alt={`${selectedExercise.name} - Bild ${index + 1}`}
                    className="workout-exercise-detail-image"
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="workout-exercise-instructions">
                <h3>How to perform</h3>

                <ol>
                  {selectedExercise.instructions?.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
        {selectedExercises.length > 0 && (
          <div className="workout-selected-exercises">
            <h3>Selected Exercises ({selectedExercises.length})</h3>

            {selectedExercises.map((exercise) => (
              <div className="workout-selected-item" key={exercise.id}>
                <span>{exercise.name}</span>
                <div className="workout-selected-sets">
                  <label>Sets</label>

                  <input
                    type="number"
                    min="1"
                    value={exercise.target_sets ?? 3}
                    onChange={(e) => {
                      const sets = Number(e.target.value);

                      setSelectedExercises((prev) =>
                        prev.map((item) =>
                          item.id === exercise.id
                            ? { ...item, target_sets: sets }
                            : item,
                        ),
                      );
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="workout-selected-remove"
                  onClick={() => {
                    setSelectedExercises((prev) =>
                      prev.filter((item) => item.id !== exercise.id),
                    );
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          className="workout-create-save"
          disabled={!workoutName.trim() || selectedExercises.length === 0}
          onClick={handleSaveWorkout}
        >
          Create Workout
        </button>
      </div>
    </div>
  );
}

export default WorkoutCreate;
