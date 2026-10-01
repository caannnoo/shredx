import { Link } from "react-router-dom";
import {
  HouseIcon,
  FireIcon,
  BarbellIcon,
  UserIcon,
} from "@phosphor-icons/react";
import "../styles/mobileNavbar.css";

function MobileNavbar({ isLoggedIn }) {
  return (
    <nav className="mobile-navbar">
      <Link to={isLoggedIn ? "/dashboard" : "/login"}>
        <HouseIcon size={24} />
        <span>Dashboard</span>
      </Link>

      <Link to={isLoggedIn ? "/calorietracker" : "/login"}>
        <FireIcon size={24} />
        <span>Calories</span>
      </Link>

      <Link to={isLoggedIn ? "/workouttracker" : "/login"}>
        <BarbellIcon size={24} />
        <span>Workouts</span>
      </Link>

      <Link to={isLoggedIn ? "/profile" : "/login"}>
        <UserIcon size={24} />
        <span>Profile</span>
      </Link>
    </nav>
  );
}

export default MobileNavbar;
