import { useReducer } from "react";

const menuItems = [
  { id: 1, name: "Latte", price: 5.5 },
  { id: 2, name: "Croissant", price: 3.75 },
  { id: 3, name: "Espresso", price: 3.0 },
  { id: 4, name: "Muffin", price: 2.5 },
];

// Styles are identical to CartUseState.jsx
// The UI does not change — only the state management approach does
const styles = {
  page:        { fontFamily: "sans-serif", maxWidth: "700px", margin: "0 auto", padding: "24px" },
  heading:     { fontSize: "22px", fontWeight: "600", marginBottom: "4px" },
  subheading:  { fontSize: "13px", color: "#888", marginBottom: "24px" },
  layout:      { display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" },
  sectionTitle:{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#888", marginBottom: "12px" },
  menuCard:    { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", border: "1px solid #eee", borderRadius: "8px", marginBottom: "8px", background: "#fff" },
  itemName:    { fontSize: "15px", fontWeight: "500", margin: 0 },
  itemPrice:   { fontSize: "14px", color: "#888", margin: 0 },
  btnGroup:    { display: "flex", gap: "8px" },
  btnAdd:      { padding: "6px 14px", borderRadius: "6px", border: "none", background: "#111", color: "#fff", cursor: "pointer", fontSize: "13px" },
  btnRemove:   { padding: "6px 14px", borderRadius: "6px", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: "13px" },
  sidebar:     { background: "#f9f9f9", borderRadius: "12px", padding: "20px", alignSelf: "start" },
  cartRow:     { display: "flex", justifyContent: "space-between", fontSize: "14px", padding: "6px 0", borderBottom: "1px solid #eee" },
  statRow:     { display: "flex", justifyContent: "space-between", fontSize: "14px", padding: "6px 0" },
  totalRow:    { display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "600", padding: "10px 0 0" },
  emptyCart:   { fontSize: "13px", color: "#aaa", padding: "12px 0" },
  actionBtn:   { width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "#111", color: "#fff", cursor: "pointer", fontSize: "14px", marginTop: "8px" },
  discountBtn: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: "14px", marginTop: "8px" },
  resetBtn:    { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: "14px", marginTop: "8px", color: "#888" },
  success:     { textAlign: "center", padding: "48px 24px" },
};

// 1. All related state lives together in one object
const initialState = {
  items: [],
  totalPrice: 0,
  itemCount: 0,
  discount: 0,
  isCheckingOut: false,
};

// 2. Write the reducer function
//    - Receives current state and an action object
//    - Returns new state using spread: { ...state, fieldToChange: newValue }
//    - Never mutates state directly


export default function CartUseReducer() {
  // 3. Wire up useReducer



  // 4. Each handler dispatches one action — the reducer handles the rest
  //    Compare these to CartUseState.jsx where each handler called multiple setters
  function handleAddItem(item)          {
    
  }
  function handleRemoveItem(item)       {

  }
  function handleApplyDiscount(amount)  {

  }
  function handleCheckout()             {

  }
  function handleReset()                {

  }

  if (state.isCheckingOut) {
    return (
      <div style={styles.success}>
        <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Order placed!</h2>
        <p style={{ color: "#888", marginBottom: "24px" }}>Total paid: ${state.totalPrice.toFixed(2)}</p>
        <button style={styles.actionBtn} onClick={handleReset}>Start over</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>The Daily Grind</h1>
      <p style={styles.subheading}>useReducer — one state object, one dispatch per action</p>

      <div style={styles.layout}>

        {/* Menu */}
        <div>
          <p style={styles.sectionTitle}>Menu</p>
          {menuItems.map((item) => (
            <div key={item.id} style={styles.menuCard}>
              <div>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
              </div>
              <div style={styles.btnGroup}>
                <button style={styles.btnAdd} onClick={() => handleAddItem(item)}>Add</button>
                <button style={styles.btnRemove} onClick={() => handleRemoveItem(item)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart sidebar — identical JSX to CartUseState, only state references changed */}
        <div style={styles.sidebar}>
          <p style={styles.sectionTitle}>Your order</p>

          {state.items.length === 0 ? (
            <p style={styles.emptyCart}>No items yet</p>
          ) : (
            state.items.map((item, idx) => (
              <div key={idx} style={styles.cartRow}>
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))
          )}

          <div style={{ marginTop: "12px" }}>
            <div style={styles.statRow}>
              <span style={{ color: "#888" }}>Items</span>
              <span>{state.itemCount}</span>
            </div>
            <div style={styles.statRow}>
              <span style={{ color: "#888" }}>Discount</span>
              <span>{state.discount}%</span>
            </div>
            <div style={{ borderTop: "1px solid #ddd", ...styles.totalRow }}>
              <span>Total</span>
              <span>${state.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button style={styles.discountBtn} onClick={() => handleApplyDiscount(10)}>Apply 10% discount</button>
          <button style={styles.actionBtn} onClick={handleCheckout}>Checkout</button>
          <button style={styles.resetBtn} onClick={handleReset}>Reset</button>
        </div>

      </div>
    </div>
  );
}