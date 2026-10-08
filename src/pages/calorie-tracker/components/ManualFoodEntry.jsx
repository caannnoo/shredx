import "./manualFoodEntry.css";
import { useState } from "react";

function ManualFoodEntry({ mealType, onFoodAdded }) {
  async function saveFood() {
    if (
      !food.name.trim() ||
      !food.amount ||
      [food.calories, food.protein, food.carbs, food.fat].some(
        (value) => value === "",
      )
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/foods/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: food.name,
          calories: Number(food.calories),
          protein: Number(food.protein),
          carbs: Number(food.carbs),
          fat: Number(food.fat),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // PostgreSQL hat dem Lebensmittel eine ID gegeben
      const foodId = data.id;

      console.log("Saved food ID:", foodId);
      console.log("Selected meal:", mealType);
      console.log("Amount:", food.amount);

      // Heutiges Datum im lokalen Format
      const today = new Date();
      const trackingDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
      ].join("-");

      // Lebensmittel zur Mahlzeit hinzufügen
      const entryResponse = await fetch(
        "http://localhost:3000/api/food-entries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            foodId,
            trackingDate,
            mealType,
            amount: Number(food.amount),
          }),
        },
      );

      const entryData = await entryResponse.json();

      if (!entryResponse.ok) {
        alert(entryData.message);
        return;
      }

      onFoodAdded();
      alert("Food added to your meal!");
    } catch (error) {
      console.error("Error saving food:", error);
      alert("Could not save food.");
    }
  }
  const [food, setFood] = useState({
    name: "",
    amount: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFood((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Nährwerte für die eingegebene Menge berechnen
  function calculate(value) {
    const result = (Number(value) * Number(food.amount)) / 100;
    return Math.round(result * 10) / 10;
  }

  return (
    <form className="manual-food-form">
      <input
        name="name"
        placeholder="Food name"
        value={food.name}
        onChange={handleChange}
        required
      />

      <input
        name="amount"
        type="number"
        placeholder="Amount (g)"
        value={food.amount}
        onChange={handleChange}
        min="0.1"
        step="0.1"
        required
      />

      <p>Nutritional values per 100 g</p>

      {[
        ["calories", "Calories (kcal)"],
        ["protein", "Protein (g)"],
        ["carbs", "Carbs (g)"],
        ["fat", "Fat (g)"],
      ].map(([name, placeholder]) => (
        <input
          key={name}
          name={name}
          type="number"
          placeholder={placeholder}
          value={food[name]}
          onChange={handleChange}
          min="0"
          step="any"
          required
        />
      ))}

      <div className="food-calculated-values">
        <h3>Calculated for {food.amount || 0} g</h3>

        <p>Calories: {calculate(food.calories)} kcal</p>
        <p>Protein: {calculate(food.protein)} g</p>
        <p>Carbs: {calculate(food.carbs)} g</p>
        <p>Fat: {calculate(food.fat)} g</p>
      </div>

      <button type="button" onClick={saveFood}>
        Add Food
      </button>
    </form>
  );
}

export default ManualFoodEntry;
