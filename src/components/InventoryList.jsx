// src/components/InventoryList.jsx
import styles from "../styles/InventoryList.module.css";

const InventoryList = ({ items, onEdit, onDelete, loading }) => {
  const isExpired = (expiryDate) =>
    expiryDate && new Date(expiryDate) < new Date();
  const isLowStock = (qty) => Number(qty) > 0 && Number(qty) < 5;

  const fmtDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  if (loading) {
    return (
      <div className={styles.skeletonList}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div className={styles.skeletonRow} key={i} />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0)
    return <p className={styles.empty}>No items in inventory.</p>;

  return (
    <div className={styles.listCard}>
      <h2 className={styles.title}>Inventory Items</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry</th>
              <th>Status</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const expired = isExpired(it.expiryDate);
              const low = isLowStock(it.quantity);
              return (
                <tr
                  key={it.id}
                  className={expired ? styles.expiredRow : undefined}
                >
                  <td>{it.name}</td>
                  <td>{it.category}</td>
                  <td>{it.quantity}</td>
                  <td>{fmtDate(it.expiryDate)}</td>
                  <td>
                    {expired ? (
                      <span className={`${styles.badge} ${styles.badgeDanger}`}>
                        ⛔ Expired
                      </span>
                    ) : low ? (
                      <span className={`${styles.badge} ${styles.badgeWarn}`}>
                        ⚠️ Low
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeOk}`}>
                        ✅ In stock
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className={styles.iconBtn}
                      onClick={() => onEdit(it)}
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={() => onDelete(it.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;
