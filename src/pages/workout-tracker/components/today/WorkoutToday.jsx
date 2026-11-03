import "./workoutToday.css";

function WorkoutToday({
  savedWorkouts = [],
  selectedDate,
  completedWorkout,
  isLoadingCompletedWorkout,
  onStartWorkout,
  activeWorkout,
  onCancelWorkout,
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

  const today = weekDays[selectedDate.getDay()];

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const completedWorkoutForDate = completedWorkout;

  const todaysWorkout = savedWorkouts.find((workout) =>
    workout.training_days?.includes(today),
  );

  return (
    <div className="workouttoday">
      <div className="workouttoday-section">
        <div className="workouttoday-info">
          <h4
            style={{
              color:
                (isToday && activeWorkout) || completedWorkoutForDate
                  ? "#4ade80"
                  : "",
            }}
          >
            {isLoadingCompletedWorkout
              ? "⏳ Loading..."
              : isToday && activeWorkout
                ? "🟢 Active Workout"
                : completedWorkoutForDate
                  ? isToday
                    ? "✅ Today's Workout Completed!"
                    : "✅ Workout Completed!"
                  : isToday
                    ? "Today's Workout"
                    : "Planned Workout"}
          </h4>

          <h2>{todaysWorkout ? todaysWorkout.name : "Rest Day 💤"}</h2>

          <p>
            {todaysWorkout
              ? `${todaysWorkout.exercise_count} exercises`
              : isToday
                ? "No workout scheduled for today"
                : "No workout scheduled for this day"}
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
              </div>
            ) : (
              isToday &&
              !completedWorkoutForDate && (
                <button
                  type="button"
                  className="start-workout-btn"
                  onClick={() => onStartWorkout(todaysWorkout)}
                >
                  Start Workout
                </button>
              )
            ))}
        </div>
      </div>
    </div>
  );
}

export default WorkoutToday;
