import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <img src={logo} alt="ShredX Logo" className="logo" />
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <a href="#features">Features</a>
        </li>

        <li>
          <a href="#howitworks">How it works</a>
        </li>
      </ul>

      <ul className="nav-links-auth">
        <li>
          <Link to="/login">Login</Link>
        </li>

        <li>
          <Link to="/register" className="start-tracking">
            Start Tracking
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
