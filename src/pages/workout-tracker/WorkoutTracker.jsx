import { useState } from "react";

import WorkoutHeader from "./components/WorkoutHeader";
import WorkoutToday from "./components/WorkoutToday";
import WorkoutActive from "./components/WorkoutActive";
import WorkoutFooter from "./components/WorkoutFooter";
import WorkoutCreate from "./components/WorkoutCreate";

function WorkoutTracker() {
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);

  function handleCreateWorkout() {
    setIsCreatingWorkout(true);
    console.log("Create Workout wurde geklickt!");
  }

  function handleCloseWorkout() {
    setIsCreatingWorkout(false);
  }

  return (
    <div>
      <WorkoutHeader onCreateWorkout={handleCreateWorkout} />
      {isCreatingWorkout && <WorkoutCreate onClose={handleCloseWorkout} />}
      <WorkoutToday />
      <WorkoutActive />
      <WorkoutFooter />
    </div>
  );
}

export default WorkoutTracker;
