import "./workoutCreate.css";
import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function WorkoutCreate({ onClose, onCreated }) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState("all");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  const muscleGroups = [
    { label: "All", value: "all" },
    { label: "Chest", value: "chest" },
    { label: "Back", value: "back" },
    { label: "Shoulders", value: "shoulders" },
    { label: "Biceps", value: "biceps" },
    { label: "Triceps", value: "triceps" },
    { label: "Forearms", value: "forearms" },
    { label: "Legs", value: "legs" },
    { label: "Abs", value: "abdominals" },
    { label: "Neck", value: "neck" },
  ];

  const weekDays = [
    { label: "Mon", value: "monday" },
    { label: "Tue", value: "tuesday" },
    { label: "Wed", value: "wednesday" },
    { label: "Thu", value: "thursday" },
    { label: "Fri", value: "friday" },
    { label: "Sat", value: "saturday" },
    { label: "Sun", value: "sunday" },
  ];

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await fetch("http://localhost:3000/api/exercises");

        if (!response.ok) {
          throw new Error("Übungen konnten nicht geladen werden");
        }

        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error("Fehler beim Laden der Übungen:", error);
      }
    }

    loadExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const muscleMap = {
      back: ["lats", "middle back", "lower back"],
      shoulders: ["shoulders", "traps"],
      legs: [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "adductors",
        "abductors",
      ],
    };

    const targetMuscles = muscleMap[selectedMuscle] || [selectedMuscle];

    const matchesMuscle =
      selectedMuscle === "all" ||
      exercise.primary_muscles?.some((muscle) =>
        targetMuscles.includes(muscle),
      );

    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(exerciseSearch.trim().toLowerCase());

    return matchesMuscle && matchesSearch;
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setSelectedExercises((prev) => {
      const oldIndex = prev.findIndex((exercise) => exercise.id === active.id);

      const newIndex = prev.findIndex((exercise) => exercise.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  async function handleSaveWorkout() {
    const workoutData = {
      name: workoutName,
      trainingDays: selectedDays,
      exercises: selectedExercises.map((exercise, index) => ({
        exerciseId: exercise.id,
        position: index + 1,
        targetSets: exercise.target_sets ?? 3,
        targetReps: exercise.target_reps ?? 10,
      })),
    };

    try {
      const response = await fetch("http://localhost:3000/api/workouts", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error("Workout konnte nicht gesendet werden");
      }

      const result = await response.json();
      console.log("Backend-Antwort:", result);

      await onCreated();

      alert("Workout successfully created! 💪");
      onClose();
    } catch (error) {
      console.error("Fehler beim Senden:", error);
    }
  }

  function SortableCreateExercise({
    exercise,
    onChangeSets,
    onChangeReps,
    onRemove,
    onShowDetails,
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: exercise.id,
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style} className="workout-selected-item">
        <div className="workout-selected-header">
          <span>{exercise.name}</span>

          <div className="workout-selected-header-actions">
            <button
              type="button"
              className="workout-edit-drag-handle"
              {...attributes}
              {...listeners}
              style={{ touchAction: "none" }}
              aria-label={`Move ${exercise.name}`}
            >
              ⠿
            </button>

            <button
              type="button"
              className="workout-edit-info"
              onClick={onShowDetails}
              aria-label={`Show details for ${exercise.name}`}
              title="Exercise details"
            >
              ⓘ
            </button>

            <button
              type="button"
              className="workout-selected-remove"
              onClick={onRemove}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="workout-selected-values">
          <div className="workout-selected-sets">
            <label>Sets</label>
            <input
              type="number"
              min="1"
              value={exercise.target_sets ?? 3}
              onChange={(e) => onChangeSets(Number(e.target.value))}
            />
          </div>

          <div className="workout-selected-sets">
            <label>Reps</label>
            <input
              type="number"
              min="1"
              value={exercise.target_reps ?? 10}
              onChange={(e) => onChangeReps(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-create">
      <div className="workout-create-content">
        <button
          type="button"
          className="workout-create-close"
          onClick={onClose}
        >
          ✕
        </button>
        <h2>Create Workout</h2>
        <p>Erstelle deinen eigenen Trainingsplan.</p>
        <div className="workout-create-field">
          <label htmlFor="workout-name">Workout Name</label>

          <input
            id="workout-name"
            type="text"
            placeholder="z. B. Push Day"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </div>
        <div className="workout-days">
          <h3>Training Days</h3>

          <div className="workout-days-buttons">
            {weekDays.map((day) => (
              <button
                key={day.value}
                type="button"
                className={
                  selectedDays.includes(day.value)
                    ? "workout-day-btn active"
                    : "workout-day-btn"
                }
                onClick={() => {
                  setSelectedDays((prev) =>
                    prev.includes(day.value)
                      ? prev.filter((item) => item !== day.value)
                      : [...prev, day.value],
                  );
                }}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
        <div className="workout-muscle-filters">
          <h3>Choose Exercises</h3>

          <div className="workout-exercise-search">
            <input
              type="text"
              placeholder="Search exercises..."
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
            />
          </div>

          <div className="workout-muscle-buttons">
            {muscleGroups.map((muscle) => (
              <button
                key={muscle.value}
                type="button"
                className={
                  selectedMuscle === muscle.value
                    ? "workout-muscle-btn active"
                    : "workout-muscle-btn"
                }
                onClick={() => setSelectedMuscle(muscle.value)}
              >
                {muscle.label}
              </button>
            ))}
          </div>
        </div>
        <div className="workout-exercise-list">
          {filteredExercises.map((exercise) => (
            <div className="workout-exercise-item" key={exercise.id}>
              <div className="workout-exercise-info">
                <span>{exercise.name}</span>
              </div>

              <div className="workout-exercise-actions">
                <button
                  type="button"
                  className="workout-exercise-details"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  Details
                </button>

                <button
                  type="button"
                  className="workout-exercise-add"
                  onClick={() => {
                    setSelectedExercises((prev) => {
                      const alreadyAdded = prev.some(
                        (item) => item.id === exercise.id,
                      );

                      if (alreadyAdded) {
                        return prev;
                      }

                      return [...prev, exercise];
                    });
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
        {selectedExercise && (
          <div className="workout-exercise-detail-overlay">
            <div className="workout-exercise-detail-content">
              <button
                type="button"
                className="workout-exercise-detail-close"
                onClick={() => setSelectedExercise(null)}
              >
                ✕
              </button>

              <h2>{selectedExercise.name}</h2>
              <div className="workout-exercise-detail-images">
                {selectedExercise.images?.map((image, index) => (
                  <img
                    key={index}
                    src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${image}`}
                    alt={`${selectedExercise.name} - Bild ${index + 1}`}
                    className="workout-exercise-detail-image"
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="workout-exercise-instructions">
                <h3>How to perform</h3>

                <ol>
                  {selectedExercise.instructions?.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
        {selectedExercises.length > 0 && (
          <div className="workout-selected-exercises">
            <h3>Selected Exercises ({selectedExercises.length})</h3>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedExercises.map((exercise) => exercise.id)}
                strategy={verticalListSortingStrategy}
              >
                {selectedExercises.map((exercise) => (
                  <SortableCreateExercise
                    key={exercise.id}
                    exercise={exercise}
                    onShowDetails={() => setSelectedExercise(exercise)}
                    onChangeSets={(sets) => {
                      setSelectedExercises((prev) =>
                        prev.map((item) =>
                          item.id === exercise.id
                            ? { ...item, target_sets: sets }
                            : item,
                        ),
                      );
                    }}
                    onChangeReps={(reps) => {
                      setSelectedExercises((prev) =>
                        prev.map((item) =>
                          item.id === exercise.id
                            ? { ...item, target_reps: reps }
                            : item,
                        ),
                      );
                    }}
                    onRemove={() => {
                      setSelectedExercises((prev) =>
                        prev.filter((item) => item.id !== exercise.id),
                      );
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
        <button
          type="button"
          className="workout-create-save"
          disabled={!workoutName.trim() || selectedExercises.length === 0}
          onClick={handleSaveWorkout}
        >
          Create Workout
        </button>
      </div>
    </div>
  );
}

export default WorkoutCreate;
