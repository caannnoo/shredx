import { useState, useEffect } from "react";
import WorkoutHeader from "./components/WorkoutHeader";
import WorkoutToday from "./components/WorkoutToday";
import WorkoutActive from "./components/WorkoutActive";
import WorkoutFooter from "./components/WorkoutFooter";
import WorkoutCreate from "./components/WorkoutCreate";
import WorkoutAll from "./components/WorkoutAll";

function WorkoutTracker() {
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [showAllWorkouts, setShowAllWorkouts] = useState(false);

  function handleCreateWorkout() {
    setIsCreatingWorkout(true);
  }

  function handleCloseWorkout() {
    setIsCreatingWorkout(false);
  }

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const response = await fetch("http://localhost:3000/api/workouts", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Workouts konnten nicht geladen werden");
        }

        const data = await response.json();

        setSavedWorkouts(data);

        console.log("Geladene Workouts:", data);
      } catch (error) {
        console.error("Fehler beim Laden der Workouts:", error);
      }
    }

    loadWorkouts();
  }, []);

  return (
    <div>
      <WorkoutHeader
        onCreateWorkout={handleCreateWorkout}
        onShowAllWorkouts={() => setShowAllWorkouts((prev) => !prev)}
      />
      {isCreatingWorkout && (
        <WorkoutCreate
          onClose={handleCloseWorkout}
          onCreated={async () => {
            try {
              const response = await fetch(
                "http://localhost:3000/api/workouts",
                {
                  credentials: "include",
                },
              );

              if (!response.ok) {
                throw new Error("Workouts konnten nicht aktualisiert werden");
              }

              const data = await response.json();
              setSavedWorkouts(data);
            } catch (error) {
              console.error("Fehler beim Aktualisieren der Workouts:", error);
            }
          }}
        />
      )}
      {showAllWorkouts && (
        <WorkoutAll
          savedWorkouts={savedWorkouts}
          onClose={() => setShowAllWorkouts(false)}
          onWorkoutUpdated={(updatedWorkout) => {
            setSavedWorkouts((previousWorkouts) =>
              previousWorkouts.map((workout) =>
                workout.id === updatedWorkout.id
                  ? { ...workout, ...updatedWorkout }
                  : workout,
              ),
            );
          }}
          onWorkoutDeleted={(deletedWorkoutId) => {
            setSavedWorkouts((previousWorkouts) =>
              previousWorkouts.filter(
                (workout) => workout.id !== deletedWorkoutId,
              ),
            );
          }}
        />
      )}
      <WorkoutToday />
      <WorkoutActive />
      <WorkoutFooter />
    </div>
  );
}

export default WorkoutTracker;
