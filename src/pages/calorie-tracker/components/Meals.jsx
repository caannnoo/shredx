import "./meals.css";
import { useState, useEffect } from "react";
import { ForkKnifeIcon } from "@phosphor-icons/react";
import FoodSearch from "./FoodSearch";
import ManualFoodEntry from "./ManualFoodEntry";

function Meals({
  setTotalCalories,
  setTotalProtein,
  setTotalCarbs,
  setTotalFat,
}) {
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [foodMode, setFoodMode] = useState("search");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [foodEntries, setFoodEntries] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

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
        // Heutiges Datum ermitteln
        const today = new Date();
        const trackingDate = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, "0"),
          String(today.getDate()).padStart(2, "0"),
        ].join("-");

        const response = await fetch(
          `http://localhost:3000/api/food-entries?date=${trackingDate}`,
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
  }, [refreshKey]);

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
                    </div>
                  ))
              )}
            </div>
          </div>

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
                    onFoodAdded={() => {
                      setRefreshKey((previous) => previous + 1);
                      setShowFoodSearch(false);
                    }}
                  />
                ) : (
                  <ManualFoodEntry
                    mealType={selectedMeal}
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
