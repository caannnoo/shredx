import "./workoutToday.css";

function WorkoutToday({
  savedWorkouts = [],
  onStartWorkout,
  activeWorkout,
  onCancelWorkout,
  onFinishWorkout,
}) {
  const weekDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const today = weekDays[new Date().getDay()];

  const todaysWorkout = savedWorkouts.find((workout) =>
    workout.training_days?.includes(today),
  );

  return (
    <div className="workouttoday">
      <div className="workouttoday-section">
        <div className="workouttoday-info">
          <h4 style={{ color: activeWorkout ? "#4ade80" : "" }}>
            {activeWorkout ? "🟢 Active Workout" : "Today's Workout"}
          </h4>

          <h2>{todaysWorkout ? todaysWorkout.name : "Rest Day 💤"}</h2>

          <p>
            {todaysWorkout
              ? `${todaysWorkout.exercise_count} exercises`
              : "No workout scheduled for today"}
          </p>

          {todaysWorkout &&
            (activeWorkout ? (
              <div className="workouttoday-actions">
                <button
                  type="button"
                  className="cancel-workout-btn"
                  onClick={onCancelWorkout}
                >
                  Cancel Workout
                </button>

                <button
                  type="button"
                  className="finish-workout-btn"
                  onClick={onFinishWorkout}
                >
                  Finish Workout
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="start-workout-btn"
                onClick={() => onStartWorkout(todaysWorkout)}
              >
                Start Workout
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default WorkoutToday;
