import "./benefits.css";
import {
  FireIcon,
  ChartPolarIcon,
  ScalesIcon,
  BarbellIcon,
} from "@phosphor-icons/react";

function Benefits() {
  return (
    <div className="benefits">
      <div className="benefits-section">
        <h4 className="benefitsheadingfour">ONE CLEAR PICTURE</h4>
        <h1 className="benefitsheadingone">
          The numbers matter. The <br />
          pattern matters more.
        </h1>
        <p className="benefitsparagraph">
          Everything you need to make better daily choices,
          <br /> without switching between apps or spreadsheets.
        </p>
      </div>
      <div className="benefits-preview">
        <div className="benefit-card">
          <FireIcon className="benefit-icon" size={32} weight="regular" />
          <h3 className="benefit-heading">Simple tracking</h3>
          <p className="benefit-paragraph">
            Log meals quickly, stay aware of your calorie target.
          </p>
        </div>
        <div className="benefit-card">
          <ChartPolarIcon className="benefit-icon" size={32} weight="regular" />
          <h3 className="benefit-heading">Macro clarity</h3>
          <p className="benefit-paragraph">
            See protein, carbs and fats at a glance.
          </p>
        </div>
        <div className="benefit-card">
          <ScalesIcon className="benefit-icon" size={32} weight="regular" />
          <h3 className="benefit-heading">Progress, clearly</h3>
          <p className="benefit-paragraph">
            See body weight and habits turn into a trend.
          </p>
        </div>
        <div className="benefit-card">
          <BarbellIcon className="benefit-icon" size={32} weight="regular" />
          <h3 className="benefit-heading">Stay consistent</h3>
          <p className="benefit-paragraph">
            Bring training and nutrition into one rhythm.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Benefits;
