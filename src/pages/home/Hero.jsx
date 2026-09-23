import "./hero.css";
import { Link } from "react-router-dom";

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
          Track food, workouts and progress in one
          <br />
          calm, focused place — so the habits that
          <br />
          move you forward become easier to keep.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="hero-button-primary">
            Start Tracking
          </Link>

          <a href="#howitworks" className="hero-button-secondary">
            See How It Works
          </a>
        </div>
      </div>
      <div className="dashboard-preview">Dashboard Preview</div>
    </div>
  );
}

export default Hero;
