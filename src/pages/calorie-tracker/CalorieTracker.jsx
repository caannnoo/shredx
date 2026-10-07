import CalorieOverview from "./components/CalorieOverview";
import Meals from "./components/Meals";
import DailyHealth from "./components/DailyHealth";

function CalorieTracker() {
  return (
    <div>
      <CalorieOverview />
      <Meals />
      <DailyHealth />
    </div>
  );
}

export default CalorieTracker;
