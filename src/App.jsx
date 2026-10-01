import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Profile from "./pages/profile/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileNavbar from "./components/MobileNavbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("http://localhost:3000/api/me", {
        credentials: "include",
      });

      setIsLoggedIn(response.ok);
    };

    checkAuth();

    window.addEventListener("authChanged", checkAuth);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route
            path="/profile"
            element={<Profile setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </main>
      <Footer />
      <MobileNavbar isLoggedIn={isLoggedIn} />
    </>
  );
}

export default App;
