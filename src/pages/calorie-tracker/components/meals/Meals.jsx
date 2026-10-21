import "./meals.css";
import { useState, useEffect } from "react";
import {
  ForkKnifeIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import FoodSearch from "../foodsearch/FoodSearch";
import ManualFoodEntry from "../manualfoodentry/ManualFoodEntry";

function Meals({
  setTotalCalories,
  setTotalProtein,
  setTotalCarbs,
  setTotalFat,
  selectedDate,
}) {
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [foodMode, setFoodMode] = useState("search");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [foodEntries, setFoodEntries] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingFood, setEditingFood] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const breakfastCalories = foodEntries
    .filter((entry) => entry.meal_type === "breakfast")
    .reduce((total, entry) => total + Number(entry.calories), 0);

  const lunchCalories = foodEntries
    .filter((entry) => entry.meal_type === "lunch")
    .reduce((total, entry) => total + Number(entry.calories), 0);

  const dinnerCalories = foodEntries
    .filter((entry) => entry.meal_type === "dinner")
    .reduce((total, entry) => total + Number(entry.calories), 0);

  const snacksCalories = foodEntries
    .filter((entry) => entry.meal_type === "snacks")
    .reduce((total, entry) => total + Number(entry.calories), 0);

  const totalCalories =
    breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;

  const totalProtein = foodEntries.reduce(
    (total, entry) => total + Number(entry.protein_g),
    0,
  );

  const totalCarbs = foodEntries.reduce(
    (total, entry) => total + Number(entry.carbs_g),
    0,
  );

  const totalFat = foodEntries.reduce(
    (total, entry) => total + Number(entry.fat_g),
    0,
  );

  const handleDeleteFood = async (entryId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/food-entries/${entryId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Lebensmittel konnte nicht gelöscht werden.");
      }

      setRefreshKey((previous) => previous + 1);
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  const handleSaveFood = async () => {
    const amount = Number(editAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Bitte eine gültige Grammmenge eingeben.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/food-entries/${editingFood.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        },
      );

      if (!response.ok) {
        throw new Error("Lebensmittel konnte nicht aktualisiert werden.");
      }

      setEditingFood(null);
      setRefreshKey((previous) => previous + 1);
    } catch (error) {
      console.error("Fehler beim Bearbeiten:", error);
      alert("Die Änderung konnte nicht gespeichert werden.");
    }
  };

  const editFactor =
    editingFood && Number(editingFood.amount_g) > 0
      ? Number(editAmount) / Number(editingFood.amount_g)
      : 0;

  useEffect(() => {
    setTotalCalories(totalCalories);
  }, [totalCalories, setTotalCalories]);

  useEffect(() => {
    setTotalProtein(totalProtein);
  }, [totalProtein, setTotalProtein]);

  useEffect(() => {
    setTotalCarbs(totalCarbs);
  }, [totalCarbs, setTotalCarbs]);

  useEffect(() => {
    setTotalFat(totalFat);
  }, [totalFat, setTotalFat]);

  useEffect(() => {
    async function loadFoodEntries() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/food-entries?date=${selectedDate}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Mahlzeiten konnten nicht geladen werden.");
        }

        const data = await response.json();
        setFoodEntries(data);
      } catch (error) {
        console.error("Fehler beim Laden:", error);
      }
    }

    loadFoodEntries();
  }, [refreshKey, selectedDate]);

  return (
    <div className="meals">
      <div className="meals-section">
        <h2 className="meals-heading">Meals</h2>

        <div className="meals-grid">
          <div className="meal-card">
            <div className="meal-header">
              <div>
                <h3>Breakfast</h3>
                <span>{breakfastCalories} kcal</span>
              </div>

              <button
                onClick={() => {
                  setSelectedMeal("breakfast");
                  setShowFoodSearch(true);
                }}
              >
                + Add Food
              </button>
            </div>

            <div className="meal-food-list">
              {foodEntries.filter((entry) => entry.meal_type === "breakfast")
                .length === 0 ? (
                <div className="meal-empty-state">
                  <ForkKnifeIcon size={28} weight="light" />
                  <p>No food added yet</p>
                  <span>Start by adding your first food.</span>
                </div>
              ) : (
                foodEntries
                  .filter((entry) => entry.meal_type === "breakfast")
                  .map((entry) => (
                    <div key={entry.id} className="meal-food-entry">
                      <p>{entry.name}</p>
                      <p>{entry.amount_g} g</p>
                      <p>{entry.calories} kcal</p>

                      <div className="meal-food-actions">
                        <button
                          type="button"
                          aria-label={`Edit ${entry.name}`}
                          onClick={() => {
                            setEditingFood(entry);
                            setEditAmount(String(entry.amount_g));
                          }}
                        >
                          <PencilSimpleIcon size={20} />
                        </button>

                        <button
                          type="button"
                          aria-label={`Delete ${entry.name}`}
                          onClick={() => handleDeleteFood(entry.id)}
                        >
                          <TrashIcon size={20} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-header">
              <div>
                <h3>Lunch</h3>
                <span>{lunchCalories} kcal</span>
              </div>

              <button
                onClick={() => {
                  setSelectedMeal("lunch");
                  setShowFoodSearch(true);
                }}
              >
                + Add Food
              </button>
            </div>

            <div className="meal-food-list">
              {foodEntries.filter((entry) => entry.meal_type === "lunch")
                .length === 0 ? (
                <div className="meal-empty-state">
                  <ForkKnifeIcon size={28} weight="light" />
                  <p>No food added yet</p>
                  <span>Start by adding your first food.</span>
                </div>
              ) : (
                foodEntries
                  .filter((entry) => entry.meal_type === "lunch")
                  .map((entry) => (
                    <div key={entry.id} className="meal-food-entry">
                      <p>{entry.name}</p>
                      <p>{entry.amount_g} g</p>
                      <p>{entry.calories} kcal</p>

                      <div className="meal-food-actions">
                        <button
                          type="button"
                          aria-label={`Edit ${entry.name}`}
                          onClick={() => {
                            setEditingFood(entry);
                            setEditAmount(String(entry.amount_g));
                          }}
                        >
                          <PencilSimpleIcon size={20} />
                        </button>

                        <button
                          type="button"
                          aria-label={`Delete ${entry.name}`}
                          onClick={() => handleDeleteFood(entry.id)}
                        >
                          <TrashIcon size={20} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-header">
              <div>
                <h3>Dinner</h3>
                <span>{dinnerCalories} kcal</span>
              </div>

              <button
                onClick={() => {
                  setSelectedMeal("dinner");
                  setShowFoodSearch(true);
                }}
              >
                + Add Food
              </button>
            </div>

            <div className="meal-food-list">
              {foodEntries.filter((entry) => entry.meal_type === "dinner")
                .length === 0 ? (
                <div className="meal-empty-state">
                  <ForkKnifeIcon size={28} weight="light" />
                  <p>No food added yet</p>
                  <span>Start by adding your first food.</span>
                </div>
              ) : (
                foodEntries
                  .filter((entry) => entry.meal_type === "dinner")
                  .map((entry) => (
                    <div key={entry.id} className="meal-food-entry">
                      <p>{entry.name}</p>
                      <p>{entry.amount_g} g</p>
                      <p>{entry.calories} kcal</p>

                      <div className="meal-food-actions">
                        <button
                          type="button"
                          aria-label={`Edit ${entry.name}`}
                          onClick={() => {
                            setEditingFood(entry);
                            setEditAmount(String(entry.amount_g));
                          }}
                        >
                          <PencilSimpleIcon size={20} />
                        </button>

                        <button
                          type="button"
                          aria-label={`Delete ${entry.name}`}
                          onClick={() => handleDeleteFood(entry.id)}
                        >
                          <TrashIcon size={20} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-header">
              <div>
                <h3>Snacks</h3>
                <span>{snacksCalories} kcal</span>
              </div>

              <button
                onClick={() => {
                  setSelectedMeal("snacks");
                  setShowFoodSearch(true);
                }}
              >
                + Add Food
              </button>
            </div>

            <div className="meal-food-list">
              {foodEntries.filter((entry) => entry.meal_type === "snacks")
                .length === 0 ? (
                <div className="meal-empty-state">
                  <ForkKnifeIcon size={28} weight="light" />
                  <p>No food added yet</p>
                  <span>Start by adding your first food.</span>
                </div>
              ) : (
                foodEntries
                  .filter((entry) => entry.meal_type === "snacks")
                  .map((entry) => (
                    <div key={entry.id} className="meal-food-entry">
                      <p>{entry.name}</p>
                      <p>{entry.amount_g} g</p>
                      <p>{entry.calories} kcal</p>

                      <div className="meal-food-actions">
                        <button
                          type="button"
                          aria-label={`Edit ${entry.name}`}
                          onClick={() => {
                            setEditingFood(entry);
                            setEditAmount(String(entry.amount_g));
                          }}
                        >
                          <PencilSimpleIcon size={20} />
                        </button>

                        <button
                          type="button"
                          aria-label={`Delete ${entry.name}`}
                          onClick={() => handleDeleteFood(entry.id)}
                        >
                          <TrashIcon size={20} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {editingFood && (
            <div className="food-modal-overlay">
              <div className="food-modal">
                <div className="food-modal-header">
                  <h2>Edit Food</h2>

                  <button type="button" onClick={() => setEditingFood(null)}>
                    ✕
                  </button>
                </div>

                <h3>{editingFood.name}</h3>

                <label htmlFor="edit-food-amount">Amount (g)</label>

                <input
                  id="edit-food-amount"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />

                <div className="edit-food-nutrition">
                  <p>
                    Calories:{" "}
                    {(Number(editingFood.calories) * editFactor).toFixed(1)}{" "}
                    kcal
                  </p>

                  <p>
                    Protein:{" "}
                    {(Number(editingFood.protein_g) * editFactor).toFixed(1)} g
                  </p>

                  <p>
                    Carbs:{" "}
                    {(Number(editingFood.carbs_g) * editFactor).toFixed(1)} g
                  </p>

                  <p>
                    Fat: {(Number(editingFood.fat_g) * editFactor).toFixed(1)} g
                  </p>
                </div>

                <button
                  type="button"
                  className="edit-food-save"
                  onClick={handleSaveFood}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {showFoodSearch && (
            <div className="food-modal-overlay">
              <div className="food-modal">
                <div className="food-modal-header">
                  <h2>Add Food</h2>

                  <button onClick={() => setShowFoodSearch(false)}>✕</button>
                </div>

                <div className="food-modal-tabs">
                  <button
                    className={`food-modal-tab ${foodMode === "search" ? "active" : ""}`}
                    onClick={() => setFoodMode("search")}
                  >
                    Search
                  </button>

                  <button
                    className={`food-modal-tab ${foodMode === "manual" ? "active" : ""}`}
                    onClick={() => setFoodMode("manual")}
                  >
                    Add Manually
                  </button>
                </div>

                {foodMode === "search" ? (
                  <FoodSearch
                    selectedMeal={selectedMeal}
                    selectedDate={selectedDate}
                    onFoodAdded={() => {
                      setRefreshKey((previous) => previous + 1);
                      setShowFoodSearch(false);
                    }}
                  />
                ) : (
                  <ManualFoodEntry
                    mealType={selectedMeal}
                    selectedDate={selectedDate}
                    onFoodAdded={() => {
                      setRefreshKey((previous) => previous + 1);
                      setShowFoodSearch(false);
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Meals;
