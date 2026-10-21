import "./workoutHeader.css";

function WorkoutHeader({ onCreateWorkout, onShowAllWorkouts }) {
  return (
    <div className="workoutheader">
      <div className="workoutheader-section">
        <div className="workoutheader-header">
          <div className="workout-header-text">
            <h4>Training Day</h4>
            <h1>Train with intention.</h1>
          </div>

          <div className="workout-header-actions">
            <button
              type="button"
              className="create-workout-btn"
              onClick={onCreateWorkout}
            >
              + Create Workout
            </button>

            <button
              type="button"
              className="all-workouts-btn"
              onClick={onShowAllWorkouts}
            >
              All Workouts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutHeader;
