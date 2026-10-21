import { useState, useEffect } from "react";
import "./workoutActive.css";

function WorkoutActive({ workout }) {
  const [exercises, setExercises] = useState([]);
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);
  const [setWeights, setSetWeights] = useState({});
  const [setReps, setSetReps] = useState({});

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/workouts/${workout.id}`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error("Exercises konnten nicht geladen werden");
        }

        const data = await response.json();
        console.log("Active Workout Exercises:", data.exercises);
        setExercises(data.exercises || []);
      } catch (error) {
        console.error("Fehler beim Laden der Exercises:", error);
      }
    }

    loadExercises();
  }, [workout.id]);

  return (
    <div className="workoutactive">
      <div className="workoutactive-section">
        <div className="workoutactive-header">
          <h3>Active Workout</h3>
          <span>{exercises.length} exercises</span>
        </div>

        <div className="workoutactive-exercise">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.id ?? index}
              className="workoutactive-exercise-item"
            >
              <button
                type="button"
                className="workoutactive-exercise-toggle"
                onClick={() =>
                  setExpandedExerciseId((prev) =>
                    prev === exercise.id ? null : exercise.id,
                  )
                }
              >
                <span>
                  {index + 1}. {exercise.name}
                </span>
                <span>{expandedExerciseId === exercise.id ? "▲" : "▼"}</span>
              </button>

              {expandedExerciseId === exercise.id && (
                <div className="workoutactive-exercise-details">
                  {Array.from(
                    { length: exercise.target_sets ?? 3 },
                    (_, index) => (
                      <div key={index} className="workoutactive-set-row">
                        <span>Set {index + 1}</span>
                        <div className="workoutactive-set-values">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            placeholder="kg"
                            aria-label={`Gewicht für Satz ${index + 1}`}
                            value={setWeights[`${exercise.id}-${index}`] ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              const key = `${exercise.id}-${index}`;

                              setSetWeights((prev) => ({
                                ...prev,
                                [key]: value,
                              }));
                            }}
                          />
                          <span>kg</span>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            aria-label={`Reps für Satz ${index + 1}`}
                            value={
                              setReps[`${exercise.id}-${index}`] ??
                              exercise.target_reps ??
                              10
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              const key = `${exercise.id}-${index}`;

                              setSetReps((prev) => ({
                                ...prev,
                                [key]: value,
                              }));
                            }}
                          />
                          <span>Reps</span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button type="button" className="finish-workout-btn">
          Finish Workout
        </button>
      </div>
    </div>
  );
}

export default WorkoutActive;
