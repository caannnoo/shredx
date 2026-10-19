import "./workoutShow.css";
import { useEffect, useState } from "react";

function WorkoutShow({ workout, onClose }) {
  const [workoutDetails, setWorkoutDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkoutDetails() {
      setLoading(true);
      setError("");
      setWorkoutDetails(null);

      try {
        const response = await fetch(
          `http://localhost:3000/api/workouts/${workout.id}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Workout konnte nicht geladen werden.");
        }

        const data = await response.json();
        setWorkoutDetails(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWorkoutDetails();

    return () => controller.abort();
  }, [workout.id]);
  return (
    <div className="workout-show-overlay">
      <div className="workout-show-popup">
        <button type="button" className="workout-show-close" onClick={onClose}>
          ✕
        </button>

        <div className="workout-show-header">
          <h2>{workout.name}</h2>
          <span>Workout Details</span>
        </div>

        <div className="workout-show-info">
          <div className="workout-show-info-card">
            <span>📅 Training Days</span>
            <strong>{workout.training_days?.join(" · ")}</strong>
          </div>

          <div className="workout-show-info-card">
            <span>🏋️ Exercises</span>
            <strong>{workout.exercise_count}</strong>
          </div>
        </div>

        {loading && <p>Loading exercises...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && workoutDetails && (
          <div className="workout-show-exercises">
            <h3>Exercises</h3>

            {workoutDetails.exercises.length === 0 ? (
              <p>No exercises found.</p>
            ) : (
              workoutDetails.exercises.map((exercise, index) => (
                <div key={exercise.id} className="workout-show-exercise">
                  <h4>
                    {index + 1}. {exercise.name}
                  </h4>

                  <p>Sets: {exercise.target_sets ?? "–"}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutShow;
