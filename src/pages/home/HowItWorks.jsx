import "./howitworks.css";

function Howitworks() {
  return (
    <div className="howitworks">
      <div className="howitworks-section">
        <h1 className="howitworks-heading">A simple practice, repeated</h1>
        <div className="howitworks-grid">
          <div className="hiw-cards">
            <span className="hiw-card-nums">01</span>
            <h4 className="hiw-card-heads">Set your goal</h4>
            <p className="hiw-card-paragraphs">
              Choose calorie and macro targets that fit your next chapter.
            </p>
          </div>
          <div className="hiw-cards">
            <span className="hiw-card-nums">02</span>
            <h4 className="hiw-card-heads">Track your day</h4>
            <p className="hiw-card-paragraphs">
              Log food, activity and workouts as they happen.{" "}
            </p>
          </div>
          <div className="hiw-cards">
            <span className="hiw-card-nums">03</span>
            <h4 className="hiw-card-heads">See your progress</h4>
            <p className="hiw-card-paragraphs">
              Use the pattern to adjust, grow and keep moving.{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Howitworks;
