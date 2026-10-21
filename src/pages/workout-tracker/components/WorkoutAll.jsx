import "./workoutAll.css";
import { useState } from "react";
import WorkoutShow from "./WorkoutShow";
import WorkoutEdit from "./WorkoutEdit";

function WorkoutAll({
  savedWorkouts,
  onClose,
  onWorkoutUpdated,
  onWorkoutDeleted,
}) {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const handleDeleteWorkout = async (workout) => {
    const confirmed = window.confirm(
      `Möchtest du "${workout.name}" wirklich löschen?`,
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/workouts/${workout.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Workout konnte nicht gelöscht werden");
      }

      onWorkoutDeleted(workout.id);
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("Fehler beim Löschen des Workouts");
    }
  };

  console.log("Anzahl geladener Workouts:", savedWorkouts.length);
  return (
    <div className="all-workouts-overlay">
      <div className="saved-workouts">
        <button type="button" className="all-workouts-close" onClick={onClose}>
          ✕
        </button>

        <h2>Meine Workouts</h2>

        {savedWorkouts.map((workout) => (
          <div key={workout.id} className="saved-workout-card">
            <h3>{workout.name}</h3>
            <p>Trainingstage: {workout.training_days.join(", ")}</p>
            <p>Exercises: {workout.exercise_count}</p>
            <div className="saved-workout-actions">
              <button
                type="button"
                className="saved-workout-show"
                onClick={() => setSelectedWorkout(workout)}
              >
                👁️ Show
              </button>

              <button
                type="button"
                className="saved-workout-edit"
                onClick={() => setEditingWorkout(workout)}
              >
                ✏️ Edit
              </button>

              <button
                type="button"
                className="saved-workout-delete"
                onClick={() => handleDeleteWorkout(workout)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedWorkout && (
        <WorkoutShow
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
      {editingWorkout && (
        <WorkoutEdit
          workout={editingWorkout}
          onClose={() => setEditingWorkout(null)}
          onSaved={onWorkoutUpdated}
        />
      )}
    </div>
  );
}

export default WorkoutAll;
