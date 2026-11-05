import "./workoutFooter.css";
import { useEffect, useState } from "react";
import { API_URL } from "../../../../api";

function WorkoutFooter({ savedWorkouts = [] }) {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [calendarWeek, setCalendarWeek] = useState(new Date());
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showAllWorkouts, setShowAllWorkouts] = useState(false);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [showAllRecords, setShowAllRecords] = useState(false);

  const weekStart = new Date(calendarWeek);
  const dayOfWeek = weekStart.getDay();

  weekStart.setDate(weekStart.getDate() - ((dayOfWeek + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const calendarDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    return {
      date,
      dayName: ["M", "T", "W", "T", "F", "S", "S"][index],
      dayNumber: date.getDate(),
    };
  });

  const completedWorkoutDates = new Set(
    workoutHistory.map((workout) =>
      new Date(workout.finished_at).toLocaleDateString("sv-SE", {
        timeZone: "Europe/Berlin",
      }),
    ),
  );

  const weekDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const plannedWorkoutDays = new Set(
    savedWorkouts.flatMap((workout) => workout.training_days || []),
  );

  const handleWorkoutDetails = async (workout) => {
    setSelectedWorkout(workout);
    setWorkoutDetails([]);
    setDetailsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/workouts/history/${workout.session_id}`,
        { credentials: "include" },
      );

      if (!response.ok) {
        throw new Error("Workout details could not be loaded");
      }

      const data = await response.json();
      setWorkoutDetails(data);
    } catch (error) {
      console.error("Error loading workout details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    const loadWorkoutHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workouts/history`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Workout History konnte nicht geladen werden");
        }

        const data = await response.json();
        setWorkoutHistory(data);
      } catch (error) {
        console.error("Fehler beim Laden der Workout History:", error);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadWorkoutHistory();
  }, []);

  useEffect(() => {
    const loadPersonalRecords = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workouts/records`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Personal Records could not be loaded");
        }

        const data = await response.json();
        setPersonalRecords(data);
      } catch (error) {
        console.error("Error loading Personal Records:", error);
      } finally {
        setRecordsLoading(false);
      }
    };

    loadPersonalRecords();
  }, []);

  return (
    <div className="workoutfooter">
      <div className="workoutfooter-section">
        {/* Workout History */}
        <div className="workoutfooter-card workout-history">
          <h3>Workout History</h3>

          {historyLoading ? (
            <p>Loading workouts...</p>
          ) : workoutHistory.length === 0 ? (
            <p>No completed workouts yet.</p>
          ) : (
            workoutHistory.slice(0, 3).map((workout) => (
              <div key={workout.session_id} className="workout-history-entry">
                <span>
                  {new Date(workout.finished_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "Europe/Berlin",
                  })}
                  {" · "}
                  {workout.workout_name}
                </span>

                <button
                  type="button"
                  className="workout-history-info"
                  onClick={() => handleWorkoutDetails(workout)}
                  aria-label={`Show details for ${workout.workout_name}`}
                  title="Workout details"
                >
                  ⓘ
                </button>
              </div>
            ))
          )}

          {!historyLoading && workoutHistory.length > 0 && (
            <button
              type="button"
              className="view-all-records-btn"
              onClick={() => setShowAllWorkouts(true)}
            >
              View All Workouts
            </button>
          )}
        </div>

        {/* Personal Records */}
        <div className="workoutfooter-card workout-records">
          <h3>Personal Records</h3>

          {recordsLoading ? (
            <p>Loading records...</p>
          ) : personalRecords.length === 0 ? (
            <p>No personal records yet.</p>
          ) : (
            personalRecords.slice(0, 3).map((record) => (
              <p key={record.exercise_id}>
                {record.exercise_name} · {record.max_weight_kg} kg
              </p>
            ))
          )}
          {!recordsLoading && personalRecords.length > 3 && (
            <button
              type="button"
              className="view-all-records-btn"
              onClick={() => setShowAllRecords(true)}
            >
              View All Records
            </button>
          )}
        </div>

        {/* Training Calendar */}
        <div className="workoutfooter-card workout-calendar">
          <div className="workout-calendar-header">
            <h3>Training Calendar</h3>

            <div className="workout-calendar-navigation">
              <button
                type="button"
                onClick={() => {
                  const previousWeek = new Date(calendarWeek);
                  previousWeek.setDate(previousWeek.getDate() - 7);
                  setCalendarWeek(previousWeek);
                }}
                aria-label="Previous week"
              >
                ‹
              </button>

              <span>
                {weekStart.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
                {" – "}
                {weekEnd.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>

              <button
                type="button"
                onClick={() => {
                  const nextWeek = new Date(calendarWeek);
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  setCalendarWeek(nextWeek);
                }}
                aria-label="Next week"
              >
                ›
              </button>
            </div>
          </div>

          <div className="workout-calendar-days">
            {calendarDays.map((day) => (
              <span key={day.date.toISOString()}>
                {day.dayName}
                <small>{day.dayNumber}</small>
              </span>
            ))}
          </div>

          <div className="workout-calendar-status">
            {calendarDays.map((day) => {
              const dateKey = day.date.toLocaleDateString("sv-SE");

              const isCompleted = completedWorkoutDates.has(dateKey);

              const dayName = weekDays[day.date.getDay()];
              const isPlanned = plannedWorkoutDays.has(dayName);

              const status = isCompleted
                ? "completed"
                : isPlanned
                  ? "planned"
                  : "rest";

              return (
                <span key={dateKey} className={`calendar-${status}`}>
                  {status === "completed"
                    ? "✓"
                    : status === "planned"
                      ? "◷"
                      : "–"}
                </span>
              );
            })}
          </div>

          <div className="workout-calendar-legend">
            <span>
              <i className="legend-completed">✓</i>
              Completed
            </span>

            <span>
              <i className="legend-planned">◷</i>
              Planned
            </span>

            <span>
              <i className="legend-rest">–</i>
              Rest
            </span>
          </div>
        </div>

        {selectedWorkout && (
          <div className="workout-history-detail-overlay">
            <div className="workout-history-detail-content">
              <button
                type="button"
                className="workout-history-detail-close"
                onClick={() => setSelectedWorkout(null)}
              >
                ✕
              </button>

              <h2>{selectedWorkout.workout_name}</h2>

              <p>
                {new Date(selectedWorkout.finished_at).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "Europe/Berlin",
                  },
                )}
              </p>

              {detailsLoading ? (
                <p>Loading workout details...</p>
              ) : workoutDetails.length === 0 ? (
                <p>No workout details found.</p>
              ) : (
                Object.entries(
                  Object.groupBy(workoutDetails, (set) => set.exercise_name),
                ).map(([exerciseName, sets]) => (
                  <div key={exerciseName}>
                    <h3>{exerciseName}</h3>

                    {sets.map((set) => (
                      <p key={set.set_number}>
                        Set {set.set_number} · {set.weight_kg} kg · {set.reps}{" "}
                        reps
                      </p>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showAllWorkouts && (
          <div className="workout-history-detail-overlay">
            <div className="workout-history-detail-content">
              <button
                type="button"
                className="workout-history-detail-close"
                onClick={() => setShowAllWorkouts(false)}
              >
                ✕
              </button>

              <h2>All Workouts</h2>

              {workoutHistory.map((workout) => (
                <div key={workout.session_id} className="workout-history-entry">
                  <span>
                    {new Date(workout.finished_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "Europe/Berlin",
                    })}
                    {" · "}
                    {workout.workout_name}
                  </span>

                  <button
                    type="button"
                    className="workout-history-info"
                    onClick={() => {
                      setShowAllWorkouts(false);
                      handleWorkoutDetails(workout);
                    }}
                  >
                    ⓘ
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAllRecords && (
          <div className="workout-history-detail-overlay">
            <div className="workout-history-detail-content">
              <button
                type="button"
                className="workout-history-detail-close"
                onClick={() => setShowAllRecords(false)}
              >
                ✕
              </button>

              <h2>All Personal Records</h2>

              {personalRecords.map((record) => (
                <p key={record.exercise_id}>
                  {record.exercise_name} · {record.max_weight_kg} kg
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutFooter;
