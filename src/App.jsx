// React Router für die Navigation zwischen den Seiten
import { Routes, Route } from "react-router-dom";

// React Hooks für State und Seiteneffekte
import { useEffect, useState } from "react";

// Seiten
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Profile from "./pages/profile/Profile";

// Wiederverwendbare Komponenten
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileNavbar from "./components/MobileNavbar";

function App() {
  // Login Status für die gesamte Anwendung
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Prüft beim Laden der App, ob eine aktive Session vorhanden ist (Ist der User eingeloggt?)
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("http://localhost:3000/api/me", {
        credentials: "include",
      });

      setIsLoggedIn(response.ok);
    };

    checkAuth();
  }, []);

  return (
    <>
      {/* Desktop-Navigation mit aktuellem Login-Status und Logout-Funktion */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {/* Hauptinhalt der Anwendung */}
      <main className="page-content">
        {/* Legt fest, welche Komponente bei welcher URL angezeigt wird */}
        <Routes>
          {/* Startseite */}
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          {/* Login und Registrierung, Auth bekommt von App die Funktion setIsLoggedIn */}
          <Route
            path="/login"
            element={<Auth setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/register"
            element={<Auth setIsLoggedIn={setIsLoggedIn} />}
          />
          {/* Profilseite mit Zugriff auf den Login-State für Logout */}
          <Route
            path="/profile"
            element={<Profile setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </main>
      {/* Footer der Anwendung */}
      <Footer />
      {/* Mobile Navigation mit aktuellem Login-Status */}
      <MobileNavbar isLoggedIn={isLoggedIn} />
    </>
  );
}

export default App;
