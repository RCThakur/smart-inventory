// src/components/InventoryForm.jsx
import { useState, useEffect } from "react";

const InventoryForm = ({ onSubmit, selectedItem, clearEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData(selectedItem);
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", category: "", quantity: "", expiryDate: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
      <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
      <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} required />
      <button type="submit">{selectedItem ? "Update" : "Add"} Item</button>
      {selectedItem && <button type="button" onClick={clearEdit}>Cancel</button>}
    </form>
  );
};

export default InventoryForm;
