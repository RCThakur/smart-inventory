// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import styles from "../styles/Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import Reports from "./Reports";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Aggregate stats
  const lowStockCount = items.filter((i) => i.quantity < 10).length;
  const expiredCount = items.filter((i) => new Date(i.expiryDate) < new Date()).length;

  // Group by category
  const categoryData = Object.values(
    items.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || { name: item.category, value: 0 };
      acc[item.category].value += 1;
      return acc;
    }, {})
  );

  // Recently added (latest 5)
  const recentItems = [...items]
    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
    .slice(0, 5);

  // Expiring soon (within 7 days)
  const expiringSoon = items
    .filter((item) => {
      const daysLeft = (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
      return daysLeft > 0 && daysLeft <= 7;
    })
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    .slice(0, 5);

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-IN");
    } catch {
      return "Invalid";
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>📦 SmartInventory</div>
        <nav className={styles.navLinks}>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/inventory")}>Inventory</button>
          <button onClick={() => navigate("/add")}>Add Item</button>
          <button onClick={() => navigate("/reports")}>Reports</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
          <button
            onClick={() => {
              signOut(auth);
              navigate("/login");
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className={styles.dashboardContent}>
        {/* Header */}
        <header className={styles.header}>
          <h1>📊 Dashboard</h1>
          <button onClick={() => navigate("/Inventory")} className={styles.addButton}>
            + Add Item
          </button>
        </header>

        {/* Overview */}
        <section className={styles.overview}>
          <div className={styles.card}>Total Items: {items.length}</div>
          <div className={styles.card}>Low Stock: {lowStockCount}</div>
          <div className={styles.card}>Expired: {expiredCount}</div>
          <div className={styles.card}>Categories: {categoryData.length}</div>
        </section>

        {/* Charts */}
        <section className={styles.charts}>
          <div className={styles.chartContainer}>
            <h3>Category Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartContainer}>
            <h3>Inventory Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Quick Lists */}
        <section className={styles.quickLists}>
          <div className={styles.quickBox}>
            <h3>Recently Added</h3>
            <ul>
              {recentItems.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.category}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.quickBox}>
            <h3>Expiring Soon</h3>
            <ul>
              {expiringSoon.map((item) => {
                const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <li key={item.id}>
                    {item.name} - {daysLeft} day(s)
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Inventory Table */}
        <section className={styles.inventoryList}>
          <h2>Inventory Items</h2>
          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p>No inventory found.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>{formatDate(item.expiryDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
