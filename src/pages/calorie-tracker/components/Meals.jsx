import "./meals.css";

function Meals() {
  return (
    <div className="meals">
      <div className="meals-section">
        <h2 className="meals-heading">Meals</h2>

        <div className="meals-grid">
          <div className="meal-card">
            <div className="meal-header">
              <div>
                <h3>Breakfast</h3>
                <span>420 kcal</span>
              </div>

              <button>+ Add Food</button>
            </div>

            <div className="meal-food">
              <strong>Greek Yogurt Bowl</strong>
              <span>420 kcal</span>
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-header">
              <div>
                <h3>Lunch</h3>
                <span>610 kcal</span>
              </div>

              <button>+ Add Food</button>
            </div>

            <div className="meal-food">
              <strong>Chicken & Grain Salad</strong>
              <span>610 kcal</span>
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-header">
              <div>
                <h3>Dinner</h3>
                <span>620 kcal</span>
              </div>

              <button>+ Add Food</button>
            </div>

            <p className="meal-empty">No foods added yet.</p>
          </div>

          <div className="meal-card">
            <div className="meal-header">
              <div>
                <h3>Snacks</h3>
                <span>0 kcal</span>
              </div>

              <button>+ Add Food</button>
            </div>

            <p className="meal-empty">No foods added yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meals;
