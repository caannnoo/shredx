import "./workoutEdit.css";
import "./workoutCreate.css";
import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableExercise({
  exercise,
  index,
  changeSets,
  removeExercise,
  onShowDetails,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: exercise.exercise_id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="workout-edit-exercise">
      <div className="workout-edit-exercise-header">
        <h4>
          {index + 1}. {exercise.name}
        </h4>

        <div className="workout-edit-header-actions">
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
            onClick={() => onShowDetails(exercise)}
            aria-label={`Show details for ${exercise.name}`}
            title="Exercise details"
          >
            ⓘ
          </button>

          <button
            type="button"
            className="workout-edit-remove"
            onClick={() => removeExercise(exercise.exercise_id)}
            aria-label={`Remove ${exercise.name}`}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="workout-edit-sets">
        <label htmlFor={`edit-sets-${exercise.exercise_id}`}>Sets</label>

        <input
          id={`edit-sets-${exercise.exercise_id}`}
          type="number"
          min="1"
          value={exercise.target_sets}
          onChange={(e) => {
            const sets = Number(e.target.value);

            if (Number.isInteger(sets) && sets >= 1) {
              changeSets(exercise.exercise_id, sets, true);
            }
          }}
        />
      </div>
    </div>
  );
}

function WorkoutEdit({ workout, onClose, onSaved }) {
  const [workoutName, setWorkoutName] = useState(workout.name);
  const [trainingDays, setTrainingDays] = useState(workout.training_days || []);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [exerciseError, setExerciseError] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState("all");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");

  const days = [
    { value: "monday", label: "Mon" },
    { value: "tuesday", label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday", label: "Thu" },
    { value: "friday", label: "Fri" },
    { value: "saturday", label: "Sat" },
    { value: "sunday", label: "Sun" },
  ];

  const changeSets = (exerciseId, value, isAbsolute = false) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) =>
        exercise.exercise_id === exerciseId
          ? {
              ...exercise,
              target_sets: isAbsolute
                ? value
                : Math.max(1, Number(exercise.target_sets) + value),
            }
          : exercise,
      ),
    );
  };

  const removeExercise = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.filter((exercise) => exercise.exercise_id !== exerciseId),
    );
  };

  const toggleTrainingDay = (day) => {
    setTrainingDays((previousDays) =>
      previousDays.includes(day)
        ? previousDays.filter((d) => d !== day)
        : [...previousDays, day],
    );
  };

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

  useEffect(() => {
    const controller = new AbortController();

    async function loadExercises() {
      setLoadingExercises(true);
      setExerciseError("");

      try {
        const response = await fetch(
          `http://localhost:3000/api/workouts/${workout.id}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Exercises could not be loaded.");
        }

        const data = await response.json();

        setSelectedExercises(data.exercises || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setExerciseError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingExercises(false);
        }
      }
    }

    loadExercises();

    return () => controller.abort();
  }, [workout.id]);

  useEffect(() => {
    async function loadAvailableExercises() {
      try {
        const response = await fetch("http://localhost:3000/api/exercises");

        if (!response.ok) {
          throw new Error("Exercises could not be loaded");
        }

        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error("Error loading available exercises:", error);
      }
    }

    loadAvailableExercises();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setSelectedExercises((prev) => {
      const oldIndex = prev.findIndex(
        (exercise) => exercise.exercise_id === active.id,
      );

      const newIndex = prev.findIndex(
        (exercise) => exercise.exercise_id === over.id,
      );

      if (oldIndex === -1 || newIndex === -1) return prev;

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/workouts/${workout.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: workoutName,
            trainingDays: trainingDays,
            exercises: selectedExercises.map((exercise) => ({
              id: exercise.id ?? null,
              exercise_id: exercise.exercise_id,
              target_sets: Number(exercise.target_sets),
            })),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save workout");
      }

      onSaved(data.workout);
      onClose();
    } catch (error) {
      console.error("Error saving workout:", error);
      alert(error.message);
    }
  };

  return (
    <div className="workout-edit-overlay">
      <div className="workout-edit-popup">
        <button type="button" className="workout-edit-close" onClick={onClose}>
          ✕
        </button>

        <h2>Edit Workout</h2>

        <div className="workout-edit-field">
          <label htmlFor="edit-workout-name">Workout Name</label>

          <input
            id="edit-workout-name"
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Enter workout name"
          />
        </div>

        <div className="workout-edit-field">
          <label>Training Days</label>

          <div className="workout-edit-days">
            {days.map((day) => (
              <button
                key={day.value}
                type="button"
                className={`workout-edit-day ${
                  trainingDays.includes(day.value) ? "active" : ""
                }`}
                onClick={() => toggleTrainingDay(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div className="workout-edit-exercises">
          <h3>Exercises</h3>

          <button
            type="button"
            className="workout-edit-add"
            onClick={() => setShowExerciseSearch((prev) => !prev)}
          >
            {showExerciseSearch ? "✕ Close Search" : "+ Add Exercise"}
          </button>

          {showExerciseSearch && (
            <div className="workout-edit-search">
              <input
                type="text"
                placeholder="Search exercises..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
              />

              <div className="workout-edit-muscle-buttons">
                {muscleGroups.map((muscle) => (
                  <button
                    key={muscle.value}
                    type="button"
                    className={
                      selectedMuscle === muscle.value
                        ? "workout-edit-muscle-btn active"
                        : "workout-edit-muscle-btn"
                    }
                    onClick={() => setSelectedMuscle(muscle.value)}
                  >
                    {muscle.label}
                  </button>
                ))}
              </div>

              <div className="workout-edit-available-list">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="workout-edit-available-item"
                  >
                    <span>{exercise.name}</span>

                    <div className="workout-edit-available-actions">
                      <button
                        type="button"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExercises((prev) => {
                            const alreadyAdded = prev.some(
                              (item) => item.exercise_id === exercise.id,
                            );

                            if (alreadyAdded) return prev;

                            return [
                              ...prev,
                              {
                                exercise_id: exercise.id,
                                name: exercise.name,
                                target_sets: 3,
                              },
                            ];
                          });
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingExercises && <p>Loading exercises...</p>}

          {exerciseError && <p>{exerciseError}</p>}

          {!loadingExercises && !exerciseError && (
            <>
              {selectedExercises.length === 0 ? (
                <p>No exercises found.</p>
              ) : (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={selectedExercises.map(
                      (exercise) => exercise.exercise_id,
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    {selectedExercises.map((exercise, index) => (
                      <SortableExercise
                        key={exercise.exercise_id}
                        exercise={exercise}
                        index={index}
                        changeSets={changeSets}
                        removeExercise={removeExercise}
                        onShowDetails={(exercise) => {
                          const fullExercise = exercises.find(
                            (item) => item.id === exercise.exercise_id,
                          );

                          setSelectedExercise(fullExercise || exercise);
                        }}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </>
          )}
        </div>

        <div className="workout-edit-actions">
          <button
            type="button"
            className="workout-edit-save"
            onClick={handleSaveChanges}
            disabled={loadingExercises || Boolean(exerciseError)}
          >
            💾 Save Changes
          </button>
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
      </div>
    </div>
  );
}

export default WorkoutEdit;
