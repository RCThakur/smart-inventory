// src/components/InventoryForm.jsx
import { useState, useEffect } from "react";
import styles from "../styles/InventoryForm.module.css";

const InventoryForm = ({ onSubmit, selectedItem, clearEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 1,
    expiryDate: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name || "",
        category: selectedItem.category || "",
        quantity: selectedItem.quantity ?? 1,
        expiryDate: selectedItem.expiryDate || "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const valid =
    formData.name.trim() &&
    formData.category.trim() &&
    Number(formData.quantity) >= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    try {
      await onSubmit(formData);
      if (!selectedItem)
        setFormData({ name: "", category: "", quantity: "", expiryDate: "" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>
          {selectedItem ? "Edit Item" : "Add New Item"}
        </h2>

        <label className={styles.field}>
          <input
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.field}>
          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.field}>
          <input
            name="quantity"
            type="number"
            min="0"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.field}>
          <input
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
          />
          <small className={styles.hint}>Leave empty if not applicable</small>
        </label>

        <div className={styles.formActions}>
          <button
            className={styles.primary}
            type="submit"
            disabled={!valid || saving}
          >
            {saving
              ? selectedItem
                ? "Updating..."
                : "Adding..."
              : selectedItem
              ? "Update Item"
              : "Add Item"}
          </button>

          {selectedItem ? (
            <button
              type="button"
              className={styles.ghost}
              onClick={clearEdit}
              disabled={saving}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              className={styles.ghost}
              onClick={() =>
                setFormData({
                  name: "",
                  category: "",
                  quantity: 1,
                  expiryDate: "",
                })
              }
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;
