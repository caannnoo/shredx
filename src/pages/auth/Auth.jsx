import "../auth/auth.css";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Auth({ setIsLoggedIn }) {
  // Prüft anhand der aktuellen URL, ob die Login-Seite angezeigt wird
  const location = useLocation();
  // Bin ich auf /login?
  const isLogin = location.pathname === "/login";

  // Ermöglicht die Weiterleitung zu einer anderen Seite
  const navigate = useNavigate();

  // Use States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nur beim Registrieren prüfen
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      // Funktion wird hier beendet, wenn Passwort falsch
      return;
    }

    // Hier werden Objekte erstellt
    const user = {
      firstName,
      lastName,
      gender,
      email,
      password,
      confirmPassword,
    };

    // Bestimmt, ob die Daten an Login oder Registrierung gesendet werden
    const endpoint = isLogin ? "/api/login" : "/api/register";

    // Anfrage an das Backend
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    // Liest die JSON-Daten aus der Backend-Antwort aus
    const data = await response.json();

    if (isLogin) {
      setIsLoggedIn(true);

      // Je nach vorhandenem Profil zur passenden Seite weiterleiten
      if (data.hasProfile) {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    }

    // Nachricht aus der Backend-Antwort anzeigen
    alert(data.message);
  };

  return (
    <div className="auth">
      <div className="auth-section">
        <div className={`auth-container ${isLogin ? "login" : "register"}`}>
          <h1>{isLogin ? "Welcome back." : "Start your rhythm"}</h1>
          <p>
            {isLogin
              ? "Pick up where your progress left off."
              : "Create an account and make your daily progress visible."}
          </p>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />

                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />

                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </>
            )}

            <label htmlFor="email">E-Mail</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {!isLogin && (
              <>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </>
            )}

            <button type="submit">
              {isLogin ? "Log in" : "Create account"}
            </button>
          </form>

          <div className="switch">
            <p className="switch-paragraph">
              {isLogin ? "New to ShredX?" : "Already have an account?"}
            </p>
            <Link
              to={isLogin ? "/register" : "/login"}
              className="switch-button"
            >
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
