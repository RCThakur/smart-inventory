// src/components/InventoryList.jsx
const InventoryList = ({ items, onEdit, onDelete }) => {
  const isExpired = (expiryDate) => new Date(expiryDate) < new Date();
  const isLowStock = (qty) => Number(qty) < 5;

  if (items.length === 0) return <p>No items in inventory.</p>;

  return (
    <table className="inventory-table">
      <thead>
        <tr>
          <th>Name</th><th>Category</th><th>Quantity</th><th>Expiry</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{item.quantity}</td>
            <td>{item.expiryDate}</td>
            <td>
              {isLowStock(item.quantity) && (
                <span className="alert low-stock">⚠️ Low Stock</span>
              )}
              {isExpired(item.expiryDate) && (
                <span className="alert expired">⛔ Expired</span>
              )}
            </td>
            <td>
              <button onClick={() => onEdit(item)}>Edit</button>
              <button onClick={() => onDelete(item.id)}>Delete</button>
            </td>
          </tr>
          
        ))}
      </tbody>
    </table>
  );
};

export default InventoryList;
