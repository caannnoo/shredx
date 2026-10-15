import "./workoutHeader.css";

function WorkoutHeader() {
  return (
    <div className="workoutheader">
      <div className="workoutheader-section">
        <div className="workoutheader-header">
          <div className="workout-header-text">
            <h4>Training Day</h4>
            <h1>Train with intention.</h1>
          </div>

          <div className="workout-header-actions">
            <button type="button" className="create-workout-btn">
              + Create Workout
            </button>

            <button type="button" className="all-workouts-btn">
              All Workouts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutHeader;
