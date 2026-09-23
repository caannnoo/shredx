import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/footer.css";

function Footer() {
  return (
    <div className="footer">
      <Link to="/" className="logo-link">
        <img src={logo} alt="ShredX Logo" className="logo" />
      </Link>

      <div className="footer-links">
        <a href="#features">Product</a>
        <span>•</span>
        <Link to="/privacy">Privacy</Link>
        <span>•</span>
        <Link to="/terms">Terms</Link>
        <span>•</span>
        <Link to="/instagram">Instagram</Link>
      </div>
    </div>
  );
}

export default Footer;
