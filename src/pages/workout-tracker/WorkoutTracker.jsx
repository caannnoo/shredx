import WorkoutHeader from "./components/WorkoutHeader";
import WorkoutToday from "./components/WorkoutToday";
import WorkoutActive from "./components/WorkoutActive";
import WorkoutFooter from "./components/WorkoutFooter";

function CalorieTracker() {
  return (
    <div>
      <WorkoutHeader />
      <WorkoutToday />
      <WorkoutActive />
      <WorkoutFooter />
    </div>
  );
}

export default CalorieTracker;
