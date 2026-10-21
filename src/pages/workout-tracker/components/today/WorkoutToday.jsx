import "./workoutToday.css";

function WorkoutToday() {
  return (
    <div className="workouttoday">
      <div className="workouttoday-section">
        <div className="workouttoday-info">
          <h4>Today's Workout</h4>
          <h2>Upper Body Strength</h2>
          <p>Strength Training · 52 min · 6 exercises · Est. 380 kcal</p>

          <button type="button" className="start-workout-btn">
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutToday;
