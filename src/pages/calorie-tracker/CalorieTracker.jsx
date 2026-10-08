import { useState } from "react";

import CalorieOverview from "./components/CalorieOverview";
import Meals from "./components/Meals";
import DailyHealth from "./components/DailyHealth";

function CalorieTracker() {
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFat, setTotalFat] = useState(0);

  return (
    <div>
      <CalorieOverview
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        totalCarbs={totalCarbs}
        totalFat={totalFat}
      />
      <Meals
        setTotalCalories={setTotalCalories}
        setTotalProtein={setTotalProtein}
        setTotalCarbs={setTotalCarbs}
        setTotalFat={setTotalFat}
      />
      <DailyHealth />
    </div>
  );
}

export default CalorieTracker;
