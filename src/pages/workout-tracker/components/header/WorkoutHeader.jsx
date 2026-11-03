import "./workoutHeader.css";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

function WorkoutHeader({
  selectedDate,
  onChangeDate,
  onCreateWorkout,
  onShowAllWorkouts,
}) {
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

        <div className="workout-date-navigation">
          <button type="button" onClick={() => onChangeDate(-1)}>
            <CaretLeftIcon size={18} />
            Previous
          </button>
          <span>
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <button type="button" onClick={() => onChangeDate(1)}>
            Next
            <CaretRightIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutHeader;
