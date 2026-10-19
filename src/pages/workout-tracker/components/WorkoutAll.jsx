import "./workoutAll.css";
import { useState } from "react";
import WorkoutShow from "./WorkoutShow";
import WorkoutEdit from "./WorkoutEdit";

function WorkoutAll({ savedWorkouts, onClose, onWorkoutUpdated }) {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
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

              <button type="button" className="saved-workout-delete">
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
