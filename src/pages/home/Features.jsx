import "./features.css";

function Features() {
  return (
    <div id="features" className="features">
      <div className="features-section">
        <h1 className="featureheadingone">
          Built for every part of the journey.
        </h1>
      </div>
      <div className="features-grid">
        <div className="feature-card1">
          <h4 className="featureheadingfour1">Calorie & Macro Tracking</h4>
          <h2 className="featureheadingtwo1">Know what fuels you.</h2>
          <p className="featureparagraph1">
            A better view of daily intake and macro balance, without the noise
          </p>
          <div className="feature-card1-card">
            <div className="protein-info">
              <span className="protein-value">128g</span>
              <strong className="protein-label">Protein</strong>
            </div>

            <div className="protein-dots">
              <span className="dot dot-1"></span>
              <span className="dot dot-2"></span>
              <span className="dot dot-3"></span>
              <span className="dot dot-4"></span>
              <span className="dot dot-5"></span>
              <span className="dot dot-6"></span>
            </div>
          </div>
        </div>
        <div className="feature-card2">
          <h4 className="featureheadingfour2">Meal Tracking</h4>
          <h2 className="featureheadingtwo2">Meals, without friction.</h2>
          <p className="featureparagraph2">
            Build meals and create a routine that actually works on weekdays.
          </p>
          <div className="feature-card2-card">
            <div className="meal-row">
              <span className="meal-name">Breakfast</span>
              <span>·</span>
              <span className="meal-value">420 kcal</span>
            </div>

            <div className="meal-row">
              <span className="meal-name">Lunch</span>
              <span>·</span>
              <span className="meal-value">610 kcal</span>
            </div>

            <div className="meal-row meal-row-muted">
              <span className="meal-name">Dinner</span>
              <span>·</span>
              <span>Plan ahead</span>
            </div>
          </div>
        </div>
        <div className="feature-card3">
          <h4 className="featureheadingfour3">Workout Tracking</h4>
          <h2 className="featureheadingtwo3">Training in context.</h2>
          <p className="featureparagraph3">
            Connect the work you put in with the fuel and recovery that supports
            it.
          </p>
        </div>
        <div className="feature-card4">
          <h4 className="featureheadingfour4">Weight & Progress</h4>
          <h2 className="featureheadingtwo4">See the trend, not the blip.</h2>
          <p className="featureparagraph4">
            Keep perspective with clear progress views built around consistency.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
