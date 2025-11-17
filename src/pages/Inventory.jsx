// src/pages/Inventory.jsx
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import InventoryForm from "../components/InventoryForm";
import InventoryList from "../components/InventoryList";

import styles from "../styles/Inventory.module.css";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const navigate = useNavigate();
  const user = auth.currentUser;

  // 🔁 Realtime listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    });
    return () => unsubscribe();
  }, []);

  const handleAddOrUpdate = async (item) => {
    try {
      if (item.id) {
        const docRef = doc(db, "inventory", item.id);
        await updateDoc(docRef, item);
      } else {
        await addDoc(collection(db, "inventory"), {
          ...item,
          createdAt: serverTimestamp(),
        });
      }
      setSelectedItem(null);
    } catch (err) {
      alert("Error saving item: " + err.message);
    }
  };

  const handleEdit = (item) => setSelectedItem(item);
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "inventory", id));
    } catch (err) {
      alert("Error deleting item: " + err.message);
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
    <div className={styles.pageWrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>📦 SmartInventory</div>
        <nav className={styles.navLinks}>
          <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
          <button
            onClick={() => navigate("/inventory")}
            className={styles.active}
          >
            📋 Inventory
          </button>
          <button onClick={() => navigate("/add")}>➕ Add Item</button>
          <button onClick={() => navigate("/reports")}>📈 Reports</button>
          <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
          <button
            onClick={() => {
              signOut(auth);
              navigate("/login");
            }}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      {/* In main inside Inventory.jsx */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1>📋 Inventory Management</h1>
            <p>
              Welcome back, <strong>{user?.email || "User"}</strong> 👋
            </p>
          </div>
        </header>

        {(expiredItems.length > 0 || lowStockItems.length > 0) && (
          <div className={styles.alertBanner}>
            {expiredItems.length > 0 && (
              <p>⛔ {expiredItems.length} expired item(s)!</p>
            )}
            {lowStockItems.length > 0 && (
              <p>⚠️ {lowStockItems.length} low stock item(s)!</p>
            )}
          </div>
        )}

        <div className={styles.searchFilter}>
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <InventoryList
            items={filteredItems}
            onEdit={(item) => navigate(`/edit/${item.id}`)} // direct to edit page (if implemented)
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
};

export default Inventory;
