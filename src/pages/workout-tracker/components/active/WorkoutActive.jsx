import "./workoutActive.css";

function WorkoutActive() {
  return (
    <div className="workoutactive">
      <div className="workoutactive-section">
        <div className="workoutactive-header">
          <h3>Active Workout</h3>
          <span>18:42 elapsed · 2 / 6 exercises</span>
        </div>

        <div className="workoutactive-exercise">
          <h4>Bench Press · Chest & Triceps</h4>
          <p>Previous: 80 kg × 8 reps</p>

          <div className="workoutactive-sets">
            <p>Set 1 · 80 kg × 8 · ✓ Complete</p>
            <p>Set 2 · 80 kg × 8 · ✓ Complete</p>
            <p>Set 3 · 82.5 kg × 6 · Complete Set</p>
          </div>

          <div className="workoutactive-actions">
            <button type="button">+ Add Set</button>
            <span>Rest timer: 01:15</span>
          </div>
        </div>

        <button type="button" className="finish-workout-btn">
          Finish Workout
        </button>
      </div>
    </div>
  );
}

export default WorkoutActive;
