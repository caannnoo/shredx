import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

function Navbar() {
  const isLoggedIn = false;
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="ShredX Logo" className="logo" />
      </Link>

      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li>
              <Link to="/kalorien">Kalorientracker</Link>
            </li>

            <li>
              <Link to="/workout">Workouttracker</Link>
            </li>

            <li className="profile">
              <div className="dropdown-profile">Mein Profil</div>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/profile">Meine Daten</Link>
                </li>
              </ul>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="#features">Features</Link>
            </li>

            <li>
              <Link to="#howitworks">How it works</Link>
            </li>

            <li>
              <Link to="/login">Login</Link>
            </li>

            <li>
              <Link to="/register">Start Tracking</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
