import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import InventoryForm from "../components/InventoryForm";
import styles from "../styles/AddInventory.module.css";

const AddInventory = () => {
  const navigate = useNavigate();

  const handleAddItem = async (item) => {
    try {
      await addDoc(collection(db, "inventory"), {
        ...item,
        createdAt: serverTimestamp(),
      });
      alert("Item added successfully");
      navigate("/inventory");
    } catch (err) {
      alert("Error adding item: " + err.message);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Optionally, add sidebar/navigation here again */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>➕ Add New Inventory Item</h1>
        </header>
        <div className="formCard">
          <InventoryForm onSubmit={handleAddItem} />
        </div>
      </main>
    </div>
  );
};

export default AddInventory;
