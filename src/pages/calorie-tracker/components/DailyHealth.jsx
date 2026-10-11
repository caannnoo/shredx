import "./dailyHealth.css";
import { useState, useEffect } from "react";

function DailyHealth() {
  const [weight, setWeight] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [stepsInput, setStepsInput] = useState("");
  const [water, setWater] = useState(0);
  const [steps, setSteps] = useState(0);
  const waterGoal = 2500;
  const waterProgress = Math.min((water / waterGoal) * 100, 100);

  const stepsGoal = 10000;
  const stepsProgress = Math.min((steps / stepsGoal) * 100, 100);

  useEffect(() => {
    async function loadWeight() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/daily-tracking/weight",
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          console.error("Failed to load weight");
          return;
        }

        const data = await response.json();

        if (data.weight !== null) {
          setWeight(Number(data.weight));
        }
      } catch (error) {
        console.error("Error loading weight:", error);
      }
    }

    loadWeight();
  }, []);

  useEffect(() => {
    async function loadWater() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/daily-tracking/water",
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          console.error("Failed to load water");
          return;
        }

        const data = await response.json();
        setWater(Number(data.water));
      } catch (error) {
        console.error("Error loading water:", error);
      }
    }

    loadWater();
  }, []);

  async function addWater(amount) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/daily-tracking/water",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount }),
        },
      );

      if (!response.ok) {
        console.error("Failed to save water");
        return;
      }

      const data = await response.json();

      console.log("Water response:", data);

      setWater(Number(data.water));
    } catch (error) {
      console.error("Error saving water:", error);
    }
  }

  async function addSteps(amount) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/daily-tracking/steps",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount }),
        },
      );

      if (!response.ok) {
        console.error("Failed to save steps");
        return;
      }

      const data = await response.json();
      setSteps(Number(data.steps));
    } catch (error) {
      console.error("Error saving steps:", error);
    }
  }

  useEffect(() => {
    async function loadSteps() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/daily-tracking/steps",
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          console.error("Failed to load steps");
          return;
        }

        const data = await response.json();
        setSteps(Number(data.steps));
      } catch (error) {
        console.error("Error loading steps:", error);
      }
    }

    loadSteps();
  }, []);
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
              <button onClick={() => setShowWeightModal(true)}>
                Log Weight
              </button>
            </div>

            <strong className="health-value">
              {weight !== null ? `${weight} kg` : "No weight logged"}
            </strong>
            <span className="health-info">↓ 0.4 kg from previous entry</span>
          </div>

          {/* Water */}
          <div className="health-card">
            <div className="health-card-header">
              <h3>Water Intake</h3>
            </div>

            <strong className="health-value">{water} ml</strong>

            <div className="health-progress">
              <div
                className="health-progress-fill"
                style={{ width: `${waterProgress}%` }}
              ></div>
            </div>

            <div className="water-buttons">
              <button onClick={() => addWater(250)}>+250 ml</button>
              <button onClick={() => addWater(500)}>+500 ml</button>
              <button onClick={() => addWater(-250)}>−250 ml</button>
              <button onClick={() => addWater(-500)}>−500 ml</button>
            </div>
          </div>

          {/* Steps */}
          <div className="health-card">
            <div className="health-card-header">
              <h3>Steps</h3>
            </div>

            <strong className="health-value">
              {steps.toLocaleString("en-US")}
            </strong>
            <span className="health-info">
              of {stepsGoal.toLocaleString("en-US")} steps ·{" "}
              {Math.round(stepsProgress)}%
            </span>

            <div className="health-progress">
              <div
                className="health-progress-fill"
                style={{ width: `${stepsProgress}%` }}
              ></div>
            </div>

            <div className="steps-buttons">
              <button onClick={() => addSteps(1000)}>+1000</button>

              <button onClick={() => addSteps(500)}>+500</button>

              <button onClick={() => addSteps(-500)}>−500</button>

              <button onClick={() => addSteps(-1000)}>−1000</button>
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
      {showWeightModal && (
        <div className="weight-modal-overlay">
          <div className="weight-modal">
            <h3>Log Weight</h3>
            <p>Enter your current weight in kg.</p>

            <input
              type="number"
              step="0.1"
              placeholder="Weight in kg"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
            />

            <button
              type="button"
              onClick={async () => {
                if (weightInput === "" || Number(weightInput) <= 0) return;

                const response = await fetch(
                  "http://localhost:3000/api/daily-tracking/weight",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                      weight: Number(weightInput),
                    }),
                  },
                );

                if (!response.ok) {
                  console.error("Failed to save weight");
                  return;
                }

                const data = await response.json();

                setWeight(Number(data.tracking.weight_kg));
                setShowWeightModal(false);
                setWeightInput("");
              }}
            >
              Save Weight
            </button>

            <button type="button" onClick={() => setShowWeightModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyHealth;
