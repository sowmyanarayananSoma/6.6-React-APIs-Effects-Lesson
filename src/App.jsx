import { useState } from "react";
import Weather from "./pages/1-Weather";
import MealSearch from "./pages/2-MealSearch";
import CartUseState from "./pages/3-CartUseState";
import CartUseReducer from "./pages/4-CartUseReducer";

const TABS = [
  { label: "Weather",        component: <Weather /> },
  { label: "Meal Search",    component: <MealSearch /> },
  { label: "Cart — useState",    component: <CartUseState /> },
  { label: "Cart — useReducer",  component: <CartUseReducer /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", padding: "24px" }}>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {TABS.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: activeTab === idx ? "#111" : "transparent",
              color: activeTab === idx ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: activeTab === idx ? "500" : "400",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{TABS[activeTab].component}</div>

    </div>
  );
}