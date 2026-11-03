import { useState, useEffect } from "react";
import "./workoutActive.css";

function WorkoutActive({ workout, onFinishWorkout }) {
  const [exercises, setExercises] = useState([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);
  const [setWeights, setSetWeights] = useState({});
  const [setReps, setSetReps] = useState({});
  const [completedExercises, setCompletedExercises] = useState({});
  const [isFinishing, setIsFinishing] = useState(false);

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
      } finally {
        setIsLoadingExercises(false);
      }
    }

    loadExercises();
  }, [workout.id]);

  function areAllSetsComplete() {
    return (
      exercises.length > 0 &&
      exercises.every((exercise) => {
        const numberOfSets = exercise.target_sets ?? 3;

        return Array.from({ length: numberOfSets }, (_, index) => {
          const key = `${exercise.id}-${index}`;

          return (
            setWeights[key] !== undefined &&
            setWeights[key] !== "" &&
            setReps[key] !== undefined &&
            setReps[key] !== ""
          );
        }).every(Boolean);
      })
    );
  }

  function prepareWorkoutSets() {
    const sets = [];

    exercises.forEach((exercise) => {
      const numberOfSets = exercise.target_sets ?? 3;

      for (let index = 0; index < numberOfSets; index++) {
        const key = `${exercise.id}-${index}`;

        const weight = setWeights[key];
        const reps = setReps[key];

        // Nur Sätze mit tatsächlichen Eingaben übernehmen
        if (
          (weight === undefined || weight === "") &&
          (reps === undefined || reps === "")
        ) {
          continue;
        }

        sets.push({
          workout_exercise_id: exercise.id,
          set_number: index + 1,
          weight_kg:
            weight === undefined || weight === "" ? null : Number(weight),
          reps: reps === undefined || reps === "" ? null : Number(reps),
        });
      }
    });

    return sets;
  }

  async function handleFinishWorkout() {
    if (isFinishing || isLoadingExercises || !areAllSetsComplete()) return;

    setIsFinishing(true);

    try {
      const sets = prepareWorkoutSets();

      if (exercises.length === 0 || sets.length === 0) {
        alert(
          "Bitte warte, bis die Übungen geladen sind, und trage mindestens einen Trainingssatz ein.",
        );
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/workouts/${workout.id}/finish`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sets }),
        },
      );

      if (!response.ok) {
        throw new Error("Workout konnte nicht gespeichert werden");
      }

      onFinishWorkout();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Workout konnte nicht gespeichert werden. Bitte erneut versuchen.");
    } finally {
      setIsFinishing(false);
    }
  }

  return (
    <div className="workoutactive">
      <div className="workoutactive-section">
        <div className="workoutactive-header">
          <h3>Active Workout</h3>
          <span>
            {
              exercises.filter((exercise) => completedExercises[exercise.id])
                .length
            }
            {" / "}
            {exercises.length} exercises completed
          </span>
        </div>

        <div className="workoutactive-exercise">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.id ?? index}
              className={`workoutactive-exercise-item ${
                completedExercises[exercise.id] ? "completed" : ""
              }`}
            >
              <div className="workoutactive-exercise-header-row">
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

                <button
                  type="button"
                  className="workoutactive-complete-btn"
                  onClick={() => {
                    const isCompleted = completedExercises[exercise.id];

                    setCompletedExercises((prev) => ({
                      ...prev,
                      [exercise.id]: !prev[exercise.id],
                    }));

                    if (!isCompleted && expandedExerciseId === exercise.id) {
                      setExpandedExerciseId(null);
                    }
                  }}
                  aria-label={
                    completedExercises[exercise.id]
                      ? "Mark exercise as incomplete"
                      : "Mark exercise as completed"
                  }
                >
                  {completedExercises[exercise.id] ? "✅" : "○"}
                </button>
              </div>

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
                            value={setReps[`${exercise.id}-${index}`] ?? ""}
                            placeholder={String(exercise.target_reps ?? 10)}
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

        <button
          type="button"
          className="finish-workout-btn"
          onClick={handleFinishWorkout}
          disabled={isFinishing || isLoadingExercises || !areAllSetsComplete()}
        >
          {isFinishing ? "Saving Workout..." : "Finish Workout"}
        </button>
      </div>
    </div>
  );
}

export default WorkoutActive;
