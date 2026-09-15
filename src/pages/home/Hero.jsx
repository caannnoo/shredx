import "./hero.css";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-section">
        <h4 className="heroheadingfour">FITNESS, CLARIFIED</h4>
        <h1 className="heroheadingone">
          Your daily rhythm, <br />
          made visible.
        </h1>
        <p className="heroparagraph">
          Track food, workouts and progress in one calm, focused place
          <br /> - so the habits that move you forward become easier to keep.
        </p>
        <div className="hero-buttons">
          <button className="hero-button-primary">Start Tracking</button>

          <button className="hero-button-secondary">See How It Works</button>
        </div>
      </div>
      <div className="dashboard-preview">Dashboard Preview</div>
    </div>
  );
}

export default Hero;
