// src/pages/Inventory.jsx
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import InventoryForm from "../components/InventoryForm";
import InventoryList from "../components/InventoryList";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // 🔁 Realtime listener from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    });
    return () => unsubscribe(); // Cleanup
  }, []);

  const handleAddOrUpdate = async (item) => {
    try {
      if (item.id) {
        // 🔄 Update
        const docRef = doc(db, "inventory", item.id);
        await updateDoc(docRef, item);
      } else {
        // ➕ Add
        await addDoc(collection(db, "inventory"), {
          ...item,
          createdAt: serverTimestamp(),
        });
      }
      setSelectedItem(null);
    } catch (error) {
      alert("Error saving item: " + error.message);
    }
  };

  const handleEdit = (item) => setSelectedItem(item);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "inventory", id));
    } catch (error) {
      alert("Error deleting item: " + error.message);
    }
  };

  const clearEdit = () => setSelectedItem(null);

  const expiredItems = items.filter(
    (item) => new Date(item.expiryDate) < new Date()
  );

  const lowStockItems = items.filter((item) => Number(item.quantity) < 5);

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="inventory-page">
      <h2>Inventory Management</h2>

      {/* 🔔 Alerts */}
      {(expiredItems.length > 0 || lowStockItems.length > 0) && (
        <div className="alert-banner">
          {expiredItems.length > 0 && (
            <p>⛔ {expiredItems.length} expired item(s)!</p>
          )}
          {lowStockItems.length > 0 && (
            <p>⚠️ {lowStockItems.length} low stock item(s)!</p>
          )}
        </div>
      )}

      {/* 🔍 Search & Filter */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "200px", marginRight: "16px" }}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: "8px" }}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ➕ Form */}
      <InventoryForm
        onSubmit={handleAddOrUpdate}
        selectedItem={selectedItem}
        clearEdit={clearEdit}
      />

      {/* 📋 Filtered List */}
      <InventoryList
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Inventory;
