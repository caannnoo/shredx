import { useState, useEffect } from "react";
import "./profile.css";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [height, setHeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState("");

  const [protein, setProtein] = useState(30);
  const [carbs, setCarbs] = useState(40);
  const [fat, setFat] = useState(30);

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetch("http://localhost:3000/api/me", {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setFirstName(data.user.first_name);
        setLastName(data.user.last_name);
        setGender(data.user.gender);
      }
    };

    loadUser();
  }, []);

  return (
    <section className="profile">
      <div className="profile-header">
        <h4>Profile Setup</h4>
        <h1>Build a profile that fits your life.</h1>
        <p>
          A few details help personalize your targets, tracking and progess
          view.
        </p>
      </div>
      <div className="profile-container">
        <div className="profile-card">
          <h2>Personal Information</h2>
          <div className="personal-grid">
            <div className="personal-field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="personal-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="personal-field">
              <label htmlFor="gender">Gender</label>
              <input
                id="gender"
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
            <div className="personal-field">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="body-card">
          <h2>Body Information</h2>
          <div className="body-grid">
            <div className="body-field">
              <label htmlFor="height">Height (cm)</label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                placeholder="175"
              />
            </div>
            <div className="body-field">
              <label htmlFor="currentWeight">Current weight (kg)</label>
              <input
                id="currentWeight"
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                placeholder="72.5"
              />
            </div>
            <div className="body-field">
              <label htmlFor="goalWeight">Goal weight (kg)</label>
              <input
                id="goalWeight"
                type="number"
                value={goalWeight}
                onChange={(e) => setGoalWeight(Number(e.target.value))}
                placeholder="69.5"
              />
            </div>
          </div>
        </div>
        <div className="fitness-card">
          <h2>Fitness Goal</h2>
          <div className="fitness-grid">
            <div className="fitness-field">
              <label htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
              >
                <option value="" disabled>
                  Select Activity Level
                </option>
                <option value="sedentary">Sedentary</option>
                <option value="lightly_active">Lightly Active</option>
                <option value="moderately_active">Moderately Active</option>
                <option value="very_active">Very Active</option>
                <option value="extra_active">Extra Active</option>
              </select>
            </div>
            <div className="fitness-field">
              <label htmlFor="primaryGoal">Primary Goal</label>
              <select
                id="primaryGoal"
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
              >
                <option value="" disabled>
                  Select Primary Goal
                </option>
                <option value="lose_weight">Lose Weight</option>
                <option value="maintain_weight">Maintain Weight</option>
                <option value="gain_weight">Gain Weight</option>
              </select>
            </div>
            <div className="fitness-field">
              <label htmlFor="weeklyGoal">Weekly Goal</label>
              <select
                id="weeklyGoal"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(e.target.value)}
              >
                <option value="" disabled>
                  Select Weekly Goal
                </option>
                <option value="0.25">0.25 kg per week</option>
                <option value="0.50">0.50 kg per week</option>
                <option value="0.75">0.75 kg per week</option>
                <option value="1.00">1.00 kg per week</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-tools">
        <div className="macro-goals-card">
          <h2>Macro Goals</h2>
          <p>Set the balance that supports how you train, eat und recover.</p>
          <div className="macros">
            <div className="macro-row">
              <label htmlFor="protein">Protein</label>
              <div className="macro-input">
                <input
                  id="protein"
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                />
                <span>%</span>
              </div>
            </div>
            <div className="macro-row">
              <label htmlFor="carbs">Carbohydrates</label>
              <div className="macro-input">
                <input
                  id="carbs"
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                />
                <span>%</span>
              </div>
            </div>
            <div className="macro-row">
              <label htmlFor="fat">Fat</label>
              <div className="macro-input">
                <input
                  id="fat"
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                />
                <span>%</span>
              </div>
            </div>
            <div className="macro-bar" />
            <p className="macro-total">Total: {protein + carbs + fat}%</p>
            <button className="save-profile-button">Save Profile</button>
          </div>
        </div>
        <div className="bmi-calculator-card">
          <h2>BMI Calculator</h2>
          <p>
            Your BMI updates automatically from the height and current weight
            above.
          </p>
          <div className="bmi">
            <div className="bmi-header">
              <div>
                <h2>Body Mass Index</h2>
                <p className="bmi-category">Category: Normal Weight</p>
              </div>
              <span className="bmi-value">23.5</span>
            </div>
            <div className="bmi-bar">
              <div className="bmi-indicator"></div>
            </div>
            <div className="bmi-scale">
              <span>18.5</span>
              <span>25</span>
              <span>30+</span>
            </div>
            <p className="bmi-info">
              BMI is a general screening measure and is not intended to diagnose
              disease or illness.
            </p>
          </div>
        </div>
        <div className="security-card">
          <h2>Security</h2>
          <p>Update your password to keep your account protected.</p>
          <div className="security-field">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="password-input">
              <input id="currentPassword" type="password" />
            </div>
          </div>
          <div className="security-field">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input">
              <input id="newPassword" type="password" />
            </div>
            <div className="password-strength">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="password-strength-text">
              Strength: Enter a new password
            </p>
          </div>
          <div className="security-field">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>

            <div className="password-input">
              <input id="confirmNewPassword" type="password" />
            </div>
          </div>
          <button type="button" className="change-password-button">
            Change Password
          </button>
        </div>
      </div>
    </section>
  );
}

export default Profile;
