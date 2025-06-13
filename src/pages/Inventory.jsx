// src/pages/Inventory.jsx
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import InventoryForm from "../components/InventoryForm";
import InventoryList from "../components/InventoryList";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddOrUpdate = (item) => {
    if (item.id) {
      // Update
      setItems(items.map((i) => (i.id === item.id ? item : i)));
    } else {
      // Add
      setItems([...items, { ...item, id: uuidv4() }]);
    }
    setSelectedItem(null);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const clearEdit = () => setSelectedItem(null);

  const expiredItems = items.filter((item) => new Date(item.expiryDate) < new Date());
  const lowStockItems = items.filter((item) => Number(item.quantity) < 5);


  return (
    <div className="inventory-page">
      <h2>Inventory Management</h2>
            {(expiredItems.length > 0 || lowStockItems.length > 0) && (
        <div className="alert-banner">
            {expiredItems.length > 0 && <p>⛔ {expiredItems.length} expired item(s)!</p>}
            {lowStockItems.length > 0 && <p>⚠️ {lowStockItems.length} low stock item(s)!</p>}
        </div>
        )}
      <InventoryForm onSubmit={handleAddOrUpdate} selectedItem={selectedItem} clearEdit={clearEdit} />
      <InventoryList items={items} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Inventory;
