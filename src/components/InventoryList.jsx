// src/components/InventoryList.jsx
const InventoryList = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) return <p>No items in inventory.</p>;

  return (
    <table className="inventory-table">
      <thead>
        <tr>
          <th>Name</th><th>Category</th><th>Quantity</th><th>Expiry</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{item.quantity}</td>
            <td>{item.expiryDate}</td>
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
