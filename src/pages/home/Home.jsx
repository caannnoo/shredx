import Hero from "./Hero";
import Benefits from "./Benefits";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Cta from "./Cta";

function Home({ isLoggedIn }) {
  return (
    <div>
      <Hero isLoggedIn={isLoggedIn} />
      <Benefits />
      <Features />
      <HowItWorks />
      <Cta isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default Home;
