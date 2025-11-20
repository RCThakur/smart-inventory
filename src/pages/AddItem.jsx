// src/pages/InventoryPage.jsx
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import InventoryForm from "../components/InventoryForm";
import InventoryList from "../components/InventoryList";
import styles from "../styles/InventoryPage.module.css";

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // real-time listener: newest first
    const q = query(collection(db, "inventory"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(data);
        setLoading(false);
      },
      (err) => {
        console.error("snapshot error:", err);
        setToast({ type: "error", text: "Failed to load inventory." });
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async (payload) => {
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "inventory"), {
        ...payload,
        quantity: Number(payload.quantity || 0),
        expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
        createdAt: serverTimestamp(),
        userId: user?.uid || null,
      });
      showToast("success", "Item added");
    } catch (err) {
      console.error(err);
      showToast("error", "Error adding item");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      const docRef = doc(db, "inventory", payload.id);
      const updatePayload = {
        name: payload.name,
        category: payload.category,
        quantity: Number(payload.quantity || 0),
        expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
        updatedAt: serverTimestamp(),
      };
      // optimistic UI handled by Firestore snapshot
      await updateDoc(docRef, updatePayload);
      setSelectedItem(null);
      showToast("success", "Item updated");
    } catch (err) {
      console.error(err);
      showToast("error", "Error updating item");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this item?");
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "inventory", id));
      showToast("success", "Item deleted");
      // if deleting item that's selected for edit, clear selection
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete");
    }
  };

  const handleEdit = (item) => {
    // convert expiryDate to yyyy-mm-dd format for the date input
    const expiryIso = item.expiryDate
      ? new Date(item.expiryDate).toISOString().slice(0, 10)
      : "";
    setSelectedItem({ ...item, expiryDate: expiryIso });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearEdit = () => setSelectedItem(null);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1>Inventory</h1>
        <p className={styles.sub}>Real-time inventory management</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.formCard}>
          <InventoryForm
            selectedItem={selectedItem}
            onSubmit={(data) =>
              selectedItem
                ? handleUpdate({ ...selectedItem, ...data })
                : handleAdd(data)
            }
            clearEdit={clearEdit}
          />
        </div>

        <div className={styles.listCard}>
          <InventoryList
            items={items}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {toast && (
        <div
          className={`${styles.toast} ${
            toast.type === "error" ? styles.toastError : styles.toastSuccess
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
