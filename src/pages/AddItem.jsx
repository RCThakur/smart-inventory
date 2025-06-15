// src/pages/AddItem.jsx
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/AddItem.css";

const AddItem = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState("");
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "inventory"), {
        name,
        category,
        quantity: parseInt(quantity),
        expiryDate: new Date(expiryDate),
        createdAt: Timestamp.now(),
      });
      alert("Item added!");
      navigate("/dashboard");
    } catch (err) {
      alert("Error adding item: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Add Inventory Item</h2>
      <form onSubmit={handleAdd}>
        <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
