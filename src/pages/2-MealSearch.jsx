import { useState, useEffect } from "react";

// API endpoint — search meals by name
// https://www.themealdb.com/api/json/v1/1/search.php?s=SEARCH_TERM
//
// Each meal in response.meals has:
//   strMeal         — meal name
//   strMealThumb    — image URL
//   strInstructions — cooking instructions
//   idMeal          — unique ID
//
// Note: response.meals is null when no results are found — handle this case

// ─── MealCard component ───────────────────────────────────────────────────────
function MealCard({ name, image, instructions }) {
  return (
    <div style={{
      width: "220px",
      border: "1px solid #eee",
      borderRadius: "10px",
      overflow: "hidden",
      background: "#fff",
    }}>
      <img
        src={image}
        alt={name}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <div style={{ padding: "12px" }}>
        <p style={{ fontWeight: "500", fontSize: "14px", margin: "0 0 6px" }}>{name}</p>
        <p style={{
          fontSize: "12px",
          color: "#888",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {instructions}
        </p>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// Sample data — hardcoded so cards render before the API is wired up
// In class: replace this with data fetched from the API
const sampleMeals = [
  {
    idMeal: "1",
    strMeal: "Grilled Salmon",
    strMealThumb: "https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg",
    strInstructions: "Season the salmon with salt and pepper. Grill on medium heat for 4-5 minutes each side until cooked through. Serve with lemon wedges.",
  },
  {
    idMeal: "2",
    strMeal: "Fish Pie",
    strMealThumb: "https://www.themealdb.com/images/media/meals/ysxwuq1487323065.jpg",
    strInstructions: "Poach the fish in milk, then flake into a baking dish. Top with mashed potato and bake at 200°C for 25 minutes until golden.",
  },
];

export default function MealFetchOnChange() {
  const [searchTerm, setSearchTerm] = useState("salmon");

  // 1. Declare state variables for meals, loading, and error
  const [meals, setMeals] = useState(sampleMeals);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Write a useEffect that re-runs whenever searchTerm changes
  //    - Build the URL using the searchTerm value
  //    - Define an async function inside the effect
  //    - Use try / catch / finally
  //    - response.meals can be null if no results found — handle that case
  //    - On success: call setMeals with the meals array from the response
  useEffect(() => {
    // TODO: write your async fetch function here

    // TODO: call it
  }, []); // TODO: what belongs in this dependency array?

  if (loading) return <p>Loading meals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "780px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "4px" }}>Meal Search</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Search for a dish to see results</p>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a dish..."
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "14px",
          width: "100%",
          marginBottom: "24px",
        }}
      />

      {/* TODO in class: replace the two hardcoded MealCards below with a .map() over meals */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <MealCard
          name={meals[0].strMeal}
          image={meals[0].strMealThumb}
          instructions={meals[0].strInstructions}
        />
        <MealCard
          name={meals[1].strMeal}
          image={meals[1].strMealThumb}
          instructions={meals[1].strInstructions}
        />
      </div>

    </div>
  );
}