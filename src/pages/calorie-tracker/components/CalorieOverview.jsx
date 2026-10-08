import "./calorieOverview.css";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

function CalorieOverview({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
}) {
  const [dailyGoal, setDailyGoal] = useState(null);
  const [proteinPercent, setProteinPercent] = useState(null);
  const [carbsPercent, setCarbsPercent] = useState(null);
  const [fatPercent, setFatPercent] = useState(null);

  const burnedCalories = 350; // Vorläufiger Wert

  const netCalories = Number(totalCalories) - burnedCalories;

  const proteinGoal =
    dailyGoal !== null && proteinPercent !== null
      ? (Number(dailyGoal) * Number(proteinPercent)) / 100 / 4
      : null;

  const proteinProgress =
    proteinGoal !== null && proteinGoal > 0
      ? (Number(totalProtein) / proteinGoal) * 100
      : 0;

  const carbsGoal =
    dailyGoal !== null && carbsPercent !== null
      ? (Number(dailyGoal) * Number(carbsPercent)) / 100 / 4
      : null;

  const carbsProgress =
    carbsGoal !== null && carbsGoal > 0
      ? (Number(totalCarbs) / carbsGoal) * 100
      : 0;

  const fatGoal =
    dailyGoal !== null && fatPercent !== null
      ? (Number(dailyGoal) * Number(fatPercent)) / 100 / 9
      : null;

  const fatProgress =
    fatGoal !== null && fatGoal > 0 ? (Number(totalFat) / fatGoal) * 100 : 0;

  useEffect(() => {
    async function loadDailyGoal() {
      try {
        const response = await fetch("http://localhost:3000/api/profile", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Could not load daily goal");
        }

        const data = await response.json();

        setDailyGoal(data.profile.daily_calorie_goal);
        setProteinPercent(data.profile.protein_percent);
        setCarbsPercent(data.profile.carbs_percent);
        setFatPercent(data.profile.fat_percent);
      } catch (error) {
        console.error("Error loading daily goal:", error);
      }
    }

    loadDailyGoal();
  }, []);

  return (
    <div className="calorieoverview">
      <div className="calorieoverview-section">
        <div className="calorieoverview-header">
          <h4>Daily Nutrition</h4>
          <h1>Your day, in balance.</h1>
        </div>
        <div className="calorieoverview-date">
          <button>
            <CaretLeftIcon size={16} weight="bold" />
            Previous
          </button>
          <p>Today · August 17</p>
          <button>
            Next
            <CaretRightIcon size={16} weight="bold" />
          </button>
        </div>
        <div className="calorieoverview-calories">
          <div className="calorie-circle">
            <strong>750</strong>
            <span>remaining</span>
          </div>

          <div className="calorie-stat">
            <span>Daily Goal</span>
            <strong>{dailyGoal !== null ? `${dailyGoal} kcal` : "—"}</strong>
          </div>

          <div className="calorie-stat">
            <span>Consumed</span>
            <strong>{Number(totalCalories).toFixed(1)} kcal</strong>
          </div>

          <div className="calorie-stat">
            <span>Burned</span>
            <strong>{burnedCalories} kcal</strong>
          </div>

          <div className="calorie-stat">
            <span>Net Calories</span>
            <strong>{netCalories.toFixed(1)} kcal</strong>
          </div>
        </div>
        <div className="calorieoverview-macros">
          <h2>Macro progress</h2>

          <div className="macro-cards">
            <div className="macro-card">
              <strong>Protein</strong>
              <p>
                {Number(totalProtein).toFixed(1)}g /{" "}
                {proteinGoal !== null ? `${proteinGoal.toFixed(1)}g` : "—"} ·{" "}
                {proteinProgress.toFixed(0)}%
              </p>

              <div className="macro-progress">
                <div
                  className="macro-progress-fill"
                  style={{
                    width: `${Math.min(Math.max(proteinProgress, 0), 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="macro-card">
              <strong>Carbohydrates</strong>
              <p>
                {Number(totalCarbs).toFixed(1)}g /{" "}
                {carbsGoal !== null ? `${carbsGoal.toFixed(1)}g` : "—"} ·{" "}
                {carbsProgress.toFixed(0)}%
              </p>

              <div className="macro-progress">
                <div
                  className="macro-progress-fill"
                  style={{
                    width: `${Math.min(Math.max(carbsProgress, 0), 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="macro-card">
              <strong>Fat</strong>
              <p>
                {Number(totalFat).toFixed(1)}g /{" "}
                {fatGoal !== null ? `${fatGoal.toFixed(1)}g` : "—"} ·{" "}
                {fatProgress.toFixed(0)}%
              </p>

              <div className="macro-progress">
                <div
                  className="macro-progress-fill"
                  style={{
                    width: `${Math.min(Math.max(fatProgress, 0), 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalorieOverview;
