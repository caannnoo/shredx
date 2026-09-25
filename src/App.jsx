import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
