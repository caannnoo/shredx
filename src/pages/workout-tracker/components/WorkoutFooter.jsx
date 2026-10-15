import "./workoutFooter.css";

function WorkoutFooter() {
  return (
    <div className="workoutfooter">
      <div className="workoutfooter-section">
        {/* Workout History */}
        <div className="workoutfooter-card workout-history">
          <h3>Workout History</h3>

          <p>Aug 16 · Full Body · 54 min</p>
          <p>Aug 14 · Running · 32 min</p>
          <p>Aug 12 · Upper Body · 48 min</p>
        </div>

        {/* Personal Records */}
        <div className="workoutfooter-card workout-records">
          <h3>Personal Records</h3>

          <p>Bench Press · 100 kg</p>
          <p>Squat · 130 kg</p>
          <p>Deadlift · 160 kg</p>
        </div>

        {/* Training Calendar */}
        <div className="workoutfooter-card workout-calendar">
          <h3>Training Calendar</h3>

          <div className="workout-calendar-days">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          <div className="workout-calendar-status">
            <span>✓</span>
            <span>✓</span>
            <span>✓</span>
            <span>✓</span>
            <span>✓</span>
            <span>–</span>
            <span>–</span>
          </div>

          <p>Completed · Planned · Rest</p>
        </div>
      </div>
    </div>
  );
}

export default WorkoutFooter;
