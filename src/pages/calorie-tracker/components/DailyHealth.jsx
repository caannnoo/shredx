import "./dailyHealth.css";

function DailyHealth() {
  return (
    <div className="daily-health">
      <div className="daily-health-section">
        <h2 className="daily-health-heading">Daily Health & Activity</h2>
        <p className="daily-health-paragraph">
          Keep your movement and recovery in the same daily rhythm as you
          nutrition.
        </p>

        <div className="daily-health-grid">
          {/* Weight */}
          <div className="health-card">
            <div className="health-card-header">
              <h3>Weight</h3>
              <button>Log Weight</button>
            </div>

            <strong className="health-value">72.4 kg</strong>
            <span className="health-info">↓ 0.4 kg from previous entry</span>
          </div>

          {/* Water */}
          <div className="health-card">
            <div className="health-card-header">
              <h3>Water Intake</h3>
            </div>

            <strong className="health-value">1,750 ml</strong>

            <div className="health-progress">
              <div
                className="health-progress-fill"
                style={{ width: "70%" }}
              ></div>
            </div>

            <div className="water-buttons">
              <button>+250 ml</button>
              <button>+500 ml</button>
              <button>Custom</button>
            </div>
          </div>

          {/* Steps */}
          <div className="health-card">
            <div className="health-card-header">
              <h3>Steps</h3>
            </div>

            <strong className="health-value">7,450</strong>
            <span className="health-info">of 10,000 steps · 76%</span>

            <div className="health-progress">
              <div
                className="health-progress-fill"
                style={{ width: "76%" }}
              ></div>
            </div>
          </div>

          {/* Activities */}
          <div className="health-card">
            <div className="health-card-header">
              <h3>Activities</h3>
              <button>+ Add Activity</button>
            </div>

            <div className="activity">
              <div>
                <strong>Walking</strong>
                <span>42 min</span>
              </div>

              <span>180 kcal</span>
            </div>

            <div className="activity">
              <div>
                <strong>Strength Training</strong>
                <span>35 min</span>
              </div>

              <span>140 kcal</span>
            </div>

            <div className="activity-total">
              <span>Burned today</span>
              <strong>320 kcal</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyHealth;
