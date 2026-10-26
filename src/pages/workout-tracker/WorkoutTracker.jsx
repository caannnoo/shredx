import { useState, useEffect } from "react";
import "./workoutTracker.css";
import WorkoutHeader from "./components/header/WorkoutHeader";
import WorkoutToday from "./components/today/WorkoutToday";
import WorkoutActive from "./components/active/WorkoutActive";
import WorkoutFooter from "./components/footer/WorkoutFooter";
import WorkoutCreate from "./components/create/WorkoutCreate";
import WorkoutAll from "./components/all/WorkoutAll";

function WorkoutTracker() {
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [showAllWorkouts, setShowAllWorkouts] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedWorkout, setCompletedWorkout] = useState(null);
  const [isLoadingCompletedWorkout, setIsLoadingCompletedWorkout] =
    useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  function changeSelectedDate(days) {
    setSelectedDate((previousDate) => {
      const newDate = new Date(previousDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  }

  async function loadCompletedWorkout() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/workouts/completed/today",
        {
          credentials: "include",
        },
      );
      if (!response.ok)
        throw new Error("Workout-Status konnte nicht geladen werden");
      const data = await response.json();
      setCompletedWorkout(data.completedWorkout);
    } catch (error) {
      console.error("Fehler beim Laden des Workout-Status:", error);
    } finally {
      setIsLoadingCompletedWorkout(false);
    }
  }

  useEffect(() => {
    async function load() {
      await loadCompletedWorkout();
    }

    load();
  }, []);

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
        selectedDate={selectedDate}
        onChangeDate={changeSelectedDate}
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
      <WorkoutToday
        savedWorkouts={savedWorkouts}
        selectedDate={selectedDate}
        completedWorkout={completedWorkout}
        isLoadingCompletedWorkout={isLoadingCompletedWorkout}
        onStartWorkout={setActiveWorkout}
        activeWorkout={activeWorkout}
        onCancelWorkout={() => setActiveWorkout(null)}
        onFinishWorkout={() => {
          setCompletedWorkout(activeWorkout);
          setActiveWorkout(null);
        }}
      />
      {activeWorkout && (
        <WorkoutActive
          workout={activeWorkout}
          onFinishWorkout={() => setActiveWorkout(null)}
        />
      )}
      <WorkoutFooter />
    </div>
  );
}

export default WorkoutTracker;
