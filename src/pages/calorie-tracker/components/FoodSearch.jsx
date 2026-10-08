import "./foodSearch.css";
import { useState } from "react";
import { PlusIcon, XIcon } from "@phosphor-icons/react";

function FoodSearch({ selectedMeal, onFoodAdded }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState(100);

  async function searchFoods() {
    if (!searchTerm.trim()) return;

    const response = await fetch(
      `http://localhost:3000/api/foods/search?q=${encodeURIComponent(searchTerm)}`,
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Food search failed:", data);
      setFoods([]);
      return;
    }

    setFoods(Array.isArray(data) ? data : []);
  }

  async function addFood() {
    if (!selectedFood || Number(amount) <= 0) return;

    const response = await fetch("http://localhost:3000/api/foods/manual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: selectedFood.name,
        calories: Number(selectedFood.calories_per_100g),
        protein: Number(selectedFood.protein_per_100g),
        carbs: Number(selectedFood.carbs_per_100g),
        fat: Number(selectedFood.fat_per_100g),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error saving food:", data);
      return;
    }

    console.log("Saved food:", data);

    const trackingDate = new Date().toLocaleDateString("en-CA");

    const entryResponse = await fetch(
      "http://localhost:3000/api/food-entries",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          foodId: data.id,
          trackingDate: trackingDate,
          mealType: selectedMeal,
          amount: Number(amount),
        }),
      },
    );

    if (!entryResponse.ok) {
      console.error("Error saving food entry:", await entryResponse.text());
      return;
    }

    setSelectedFood(null);
    onFoodAdded();
  }

  return (
    <div>
      <div className="food-search-bar">
        <input
          type="text"
          placeholder="Search for a food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchFoods();
          }}
        />

        <button onClick={searchFoods}>Search</button>
      </div>

      <div className="food-search-results">
        {foods.map((food, index) => (
          <div
            className="food-search-item"
            key={`${food.barcode ?? food.name}-${index}`}
          >
            <div className="food-search-item-header">
              <h3>{food.name}</h3>

              <div className="food-search-item-actions">
                <strong>{food.calories_per_100g ?? "–"} kcal</strong>

                <button
                  type="button"
                  className="food-search-add-button"
                  onClick={() => setSelectedFood(food)}
                >
                  <PlusIcon size={18} weight="bold" />
                </button>
              </div>
            </div>

            <p>Per 100 g</p>

            <div className="food-search-macros">
              <span>Protein: {food.protein_per_100g ?? "–"} g</span>
              <span>Carbs: {food.carbs_per_100g ?? "–"} g</span>
              <span>Fat: {food.fat_per_100g ?? "–"} g</span>
            </div>
          </div>
        ))}
      </div>

      {selectedFood && (
        <div className="food-amount-overlay">
          <div className="food-amount-popup">
            <button
              type="button"
              className="food-amount-close"
              onClick={() => setSelectedFood(null)}
            >
              <XIcon size={20} />
            </button>
            <h3>{selectedFood.name}</h3>
            <p>How much did you eat?</p>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <span>grams</span>

            <button
              type="button"
              disabled={!Number.isFinite(Number(amount)) || Number(amount) <= 0}
              onClick={addFood}
            >
              Add Food
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodSearch;
