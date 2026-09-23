import "./cta.css";
import { Link } from "react-router-dom";

function Cta() {
  return (
    <div className="cta">
      <div className="cta-section">
        <h2 className="cta-heading">Make today the first clear day.</h2>
        <p className="cta-paragraph">
          Start tracking what matters and build momentum one day at a time.
        </p>
        <Link to="/register" className="cta-button">
          Start Tracking
        </Link>
      </div>
    </div>
  );
}

export default Cta;
