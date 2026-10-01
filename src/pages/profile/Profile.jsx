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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

    const loadProfile = async () => {
      const response = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        const profile = data.profile;

        setDateOfBirth(profile.date_of_birth);
        setHeight(profile.height_cm);
        setCurrentWeight(profile.current_weight_kg);
        setGoalWeight(profile.goal_weight_kg);
        setActivityLevel(profile.activity_level);
        setPrimaryGoal(profile.primary_goal);
        setWeeklyGoal(profile.weekly_goal_kg);
        setProtein(profile.protein_percent);
        setCarbs(profile.carbs_percent);
        setFat(profile.fat_percent);
      }
    };

    loadUser();
    loadProfile();
  }, []);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const calculateBMR = () => {
    if (!dateOfBirth || !height || !currentWeight || !gender) {
      return 0;
    }

    const age = calculateAge(dateOfBirth);

    if (gender === "male") {
      return 10 * currentWeight + 6.25 * height - 5 * age + 5;
    }

    if (gender === "female") {
      return 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }

    return 0;
  };

  const calculateTDEE = () => {
    const bmr = calculateBMR();

    if (!bmr || !activityLevel) {
      return 0;
    }

    const activityFactors = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };

    return bmr * activityFactors[activityLevel];
  };

  const calculateDailyCalories = () => {
    const tdee = calculateTDEE();

    if (!tdee || !primaryGoal) {
      return 0;
    }

    if (primaryGoal === "maintain_weight") {
      return Math.round(tdee);
    }

    if (!weeklyGoal) {
      return 0;
    }

    const dailyAdjustment = (Number(weeklyGoal) * 7700) / 7;

    if (primaryGoal === "lose_weight") {
      return Math.round(tdee - dailyAdjustment);
    }

    if (primaryGoal === "gain_weight") {
      return Math.round(tdee + dailyAdjustment);
    }

    return Math.round(tdee);
  };

  const calculateBMI = () => {
    if (!height || !currentWeight) {
      return 0;
    }

    const heightInMeters = Number(height) / 100;

    const bmi = Number(currentWeight) / (heightInMeters * heightInMeters);

    return bmi.toFixed(1);
  };

  const getBMICategory = () => {
    const bmi = Number(calculateBMI());

    if (!bmi) {
      return "--";
    }

    if (bmi < 18.5) {
      return "Underweight";
    }

    if (bmi < 25) {
      return "Normal Weight";
    }

    if (bmi < 30) {
      return "Overweight";
    }

    return "Obesity";
  };

  const getBMIPosition = () => {
    const bmi = Number(calculateBMI());

    if (!bmi) {
      return 0;
    }

    const minBMI = 15;
    const maxBMI = 40;

    const position = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;

    return Math.min(Math.max(position, 0), 100);
  };

  const getBMIColor = () => {
    const bmi = Number(calculateBMI());

    if (!bmi) {
      return "#8a9191";
    }

    if (bmi < 18.5) {
      return "#7db7e8"; // blau
    }

    if (bmi < 25) {
      return "#22a96b"; // grün
    }

    if (bmi < 30) {
      return "#f5bd45"; // gelb
    }

    return "#e86868"; // rot
  };

  const handleSaveProfile = async () => {
    if (
      !dateOfBirth ||
      !height ||
      !currentWeight ||
      !goalWeight ||
      !activityLevel ||
      !primaryGoal ||
      !weeklyGoal
    ) {
      alert("Please fill in all profile fields.");
      return;
    }

    if (protein + carbs + fat !== 100) {
      alert("Macro goals must add up to 100%.");
      return;
    }

    const profileData = {
      dateOfBirth,
      height,
      currentWeight,
      goalWeight,
      activityLevel,
      primaryGoal,
      weeklyGoal,
      protein,
      carbs,
      fat,
      dailyCalories: calculateDailyCalories(),
    };

    const response = await fetch("http://localhost:3000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    const response = await fetch("http://localhost:3000/api/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

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
              <input id="firstName" type="text" value={firstName} readOnly />
            </div>
            <div className="personal-field">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" type="text" value={lastName} readOnly />
            </div>
            <div className="personal-field">
              <label htmlFor="gender">Gender</label>
              <input id="gender" type="text" value={gender} readOnly />
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
            <div className="fitness-field">
              <label htmlFor="dailyCalories">Daily Calorie Goal</label>
              <input
                id="dailyCalories"
                type="text"
                value={
                  calculateDailyCalories()
                    ? `${calculateDailyCalories()} kcal`
                    : ""
                }
                readOnly
              />
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
            <div
              className="macro-bar"
              style={{
                background: `linear-gradient(
      to right,
      #000 0% ${protein}%,
      #5d5959 ${protein}% ${protein + carbs}%,
      #cacaca ${protein + carbs}% 100%
    )`,
              }}
            />
            <p className="macro-total">Total: {protein + carbs + fat}%</p>
            <button className="save-profile-button" onClick={handleSaveProfile}>
              Save Profile
            </button>
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
                <p className="bmi-category" style={{ color: getBMIColor() }}>
                  Category: {getBMICategory()}
                </p>
              </div>
              <span className="bmi-value">{calculateBMI() || "--"}</span>
            </div>
            <div className="bmi-bar">
              <div
                className="bmi-indicator"
                style={{ left: `${getBMIPosition()}%` }}
              ></div>
            </div>
            <div className="bmi-scale">
              <span style={{ left: "0%" }}>15</span>
              <span style={{ left: "14%" }}>18.5</span>
              <span style={{ left: "40%" }}>25</span>
              <span style={{ left: "60%" }}>30</span>
              <span style={{ left: "100%" }}>40+</span>
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
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="security-field">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input">
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="security-field">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>

            <div className="password-input">
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="button"
            className="change-password-button"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </section>
  );
}

export default Profile;
