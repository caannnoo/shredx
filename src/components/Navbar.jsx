import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <img src={logo} alt="ShredX Logo" className="logo" />
      </Link>

      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li>
              <Link to="/calorietracker">Calorietracker</Link>
            </li>

            <li>
              <Link to="/workouttracker">Workouttracker</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <a href="#features">Features</a>
            </li>

            <li>
              <a href="#howitworks">How it works</a>
            </li>
          </>
        )}
      </ul>

      <ul className="nav-links-auth">
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>

            <li>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>

            <li>
              <Link to="/register" className="start-tracking">
                Start Tracking
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
