import "./dailyHealth.css";
import { useState, useEffect } from "react";

function DailyHealth({ setBurnedCalories, selectedDate }) {
  const [weight, setWeight] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [water, setWater] = useState(0);
  const [steps, setSteps] = useState(0);
  const [activities, setActivities] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [activityDuration, setActivityDuration] = useState("");
  const [previousWeight, setPreviousWeight] = useState(null);
  const [lastWeightDate, setLastWeightDate] = useState(null);
  const weightDifference =
    weight !== null && previousWeight !== null
      ? Number((weight - previousWeight).toFixed(1))
      : null;
  const today = new Date().toLocaleDateString("en-CA");

  const lastEntryDay = lastWeightDate
    ? new Date(lastWeightDate).toLocaleDateString("en-CA")
    : null;

  const weightArrow =
    lastEntryDay !== selectedDate || weightDifference === null
      ? "→"
      : weightDifference < 0
        ? "↓"
        : weightDifference > 0
          ? "↑"
          : "→";

  const burnedToday = activities.reduce(
    (total, activity) => total + Number(activity.calories_burned),
    0,
  );

  useEffect(() => {
    setBurnedCalories(burnedToday);
  }, [burnedToday, setBurnedCalories]);

  const waterGoal = 2500;
  const waterProgress = Math.min((water / waterGoal) * 100, 100);

  const stepsGoal = 10000;
  const stepsProgress = Math.min((steps / stepsGoal) * 100, 100);

  const activityMET = {
    Walking: 3.5,
    Running: 9.8,
    Cycling: 7.5,
    "Strength Training": 5.0,
    Swimming: 6.0,
    HIIT: 8.0,
    Yoga: 2.5,
    Other: 3.0,
  };

  const met = activityMET[activityName] || 0;

  const estimatedCalories =
    weight && Number(activityDuration) > 0
      ? Math.round(met * weight * (Number(activityDuration) / 60))
      : 0;

  useEffect(() => {
    async function loadWeight() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/daily-tracking/weight?date=${selectedDate}`,
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
        setPreviousWeight(
          data.previousWeight !== null ? Number(data.previousWeight) : null,
        );
        setLastWeightDate(data.lastWeightDate);
      } catch (error) {
        console.error("Error loading weight:", error);
      }
    }

    loadWeight();
  }, [selectedDate]);

  useEffect(() => {
    async function loadWater() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/daily-tracking/water?date=${selectedDate}`,
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
  }, [selectedDate]);

  useEffect(() => {
    async function loadSteps() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/daily-tracking/steps?date=${selectedDate}`,
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
  }, [selectedDate]);

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/activity-entries?date=${selectedDate}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          console.error("Failed to load activities");
          return;
        }

        const data = await response.json();
        setActivities(data.activities);
      } catch (error) {
        console.error("Error loading activities:", error);
      }
    }

    loadActivities();
  }, [selectedDate]);

  async function addWater(amount) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/daily-tracking/water",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount, selectedDate }),
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
          body: JSON.stringify({ amount, selectedDate }),
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

  const deleteActivity = async (activityId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/activity-entries/${activityId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.error("Failed to delete activity");
        return;
      }

      setActivities((previous) =>
        previous.filter((activity) => activity.id !== activityId),
      );
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

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
            {weightDifference !== null ? (
              <span>
                {weightArrow}{" "}
                {weightArrow === "→"
                  ? "Weight unchanged"
                  : `${Math.abs(weightDifference).toFixed(1)} kg from previous entry`}
              </span>
            ) : (
              <span>No previous weight entry</span>
            )}

            {showWeightModal && (
              <div
                className="weight-modal-overlay"
                onClick={() => setShowWeightModal(false)}
              >
                <div
                  className="weight-modal"
                  onClick={(e) => e.stopPropagation()}
                >
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
                      if (weightInput === "" || Number(weightInput) <= 0)
                        return;

                      const response = await fetch(
                        "http://localhost:3000/api/daily-tracking/weight",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({
                            weight: Number(weightInput),
                            selectedDate,
                          }),
                        },
                      );

                      if (!response.ok) {
                        console.error("Failed to save weight");
                        return;
                      }

                      const data = await response.json();

                      const weightResponse = await fetch(
                        `http://localhost:3000/api/daily-tracking/weight?date=${selectedDate}`,
                        {
                          credentials: "include",
                        },
                      );

                      if (!weightResponse.ok) {
                        console.error("Failed to reload weight");
                        return;
                      }

                      const weightData = await weightResponse.json();

                      setWeight(
                        weightData.weight !== null
                          ? Number(weightData.weight)
                          : null,
                      );

                      setPreviousWeight(
                        weightData.previousWeight !== null
                          ? Number(weightData.previousWeight)
                          : null,
                      );

                      setLastWeightDate(weightData.lastWeightDate);

                      setShowWeightModal(false);
                      setWeightInput("");
                    }}
                  >
                    Save Weight
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowWeightModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
              <button onClick={() => addWater(250)}>+ 250 ml</button>
              <button onClick={() => addWater(500)}>+ 500 ml</button>
              <button onClick={() => addWater(-250)}>− 250 ml</button>
              <button onClick={() => addWater(-500)}>− 500 ml</button>
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
              <button onClick={() => addSteps(1000)}>+ 1000</button>

              <button onClick={() => addSteps(500)}>+ 500</button>

              <button onClick={() => addSteps(-500)}>− 500</button>

              <button onClick={() => addSteps(-1000)}>− 1000</button>
            </div>
          </div>

          {/* Activities */}
          <div className="health-card">
            <div className="health-card-header">
              <h3>Activities</h3>
              <button onClick={() => setShowActivityModal(true)}>
                + Add Activity
              </button>
            </div>

            {activities.map((activity) => (
              <div className="activity" key={activity.id}>
                <div>
                  <strong>{activity.activity_name}</strong>
                  <span>{activity.duration_minutes} min</span>
                </div>

                <span>{activity.calories_burned} kcal</span>

                <button
                  type="button"
                  className="delete-activity-btn"
                  onClick={() => deleteActivity(activity.id)}
                >
                  🗑️
                </button>
              </div>
            ))}

            <div className="activity-total">
              <span>Burned today</span>
              <strong>{burnedToday} kcal</strong>
            </div>

            {showActivityModal && (
              <div
                className="activity-modal-overlay"
                onClick={() => setShowActivityModal(false)}
              >
                <div
                  className="activity-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>Add Activity</h3>
                  <p>Log your workout or daily activity.</p>

                  <select
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                  >
                    <option value="">Select Activity</option>
                    <option value="Walking">Walking</option>
                    <option value="Running">Running</option>
                    <option value="Cycling">Cycling</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Swimming">Swimming</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Other">Other</option>
                  </select>

                  <label htmlFor="activity-duration">Duration (minutes)</label>

                  <input
                    id="activity-duration"
                    type="number"
                    min="1"
                    placeholder="e.g. 45"
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(e.target.value)}
                  />

                  <div className="activity-calories-preview">
                    <span>Estimated Calories Burned</span>
                    <strong>{estimatedCalories} kcal</strong>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      if (
                        !activityName ||
                        !Number.isInteger(Number(activityDuration)) ||
                        Number(activityDuration) <= 0 ||
                        !weight
                      ) {
                        return;
                      }

                      const response = await fetch(
                        "http://localhost:3000/api/activity-entries",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({
                            activityName,
                            duration: Number(activityDuration),
                            caloriesBurned: estimatedCalories,
                            selectedDate,
                          }),
                        },
                      );

                      if (!response.ok) {
                        console.error("Failed to save activity");
                        return;
                      }

                      const data = await response.json();

                      setActivities((previous) => [data.activity, ...previous]);
                      setShowActivityModal(false);
                      setActivityName("");
                      setActivityDuration("");
                    }}
                  >
                    Save Activity
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowActivityModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyHealth;
