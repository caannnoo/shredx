import { useState } from "react";

import CalorieOverview from "./components/CalorieOverview";
import Meals from "./components/Meals";
import DailyHealth from "./components/DailyHealth";

function CalorieTracker() {
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();

    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");
  });

  return (
    <div>
      <CalorieOverview
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        totalCarbs={totalCarbs}
        totalFat={totalFat}
        burnedCalories={burnedCalories}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <Meals
        setTotalCalories={setTotalCalories}
        setTotalProtein={setTotalProtein}
        setTotalCarbs={setTotalCarbs}
        setTotalFat={setTotalFat}
        selectedDate={selectedDate}
      />
      <DailyHealth
        setBurnedCalories={setBurnedCalories}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default CalorieTracker;
