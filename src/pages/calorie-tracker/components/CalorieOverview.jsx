import "./calorieOverview.css";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

function CalorieOverview() {
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
            <strong>2,400 kcal</strong>
          </div>

          <div className="calorie-stat">
            <span>Consumed</span>
            <strong>1,650 kcal</strong>
          </div>

          <div className="calorie-stat">
            <span>Burned</span>
            <strong>320 kcal</strong>
          </div>

          <div className="calorie-stat">
            <span>Net Calories</span>
            <strong>1,330 kcal</strong>
          </div>
        </div>
        <div className="calorieoverview-macros">
          <h2>Macro progress</h2>

          <div className="macro-cards">
            <div className="macro-card">
              <strong>Protein</strong>
              <p>128g / 160g · 80%</p>

              <div className="macro-progress">
                <div
                  className="macro-progress-fill"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>

            <div className="macro-card">
              <strong>Carbohydrates</strong>
              <p>186g / 240g · 78%</p>

              <div className="macro-progress">
                <div
                  className="macro-progress-fill"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>

            <div className="macro-card">
              <strong>Fat</strong>
              <p>46g / 65g · 71%</p>

              <div className="macro-progress">
                <div
                  className="macro-progress-fill"
                  style={{ width: "71%" }}
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
