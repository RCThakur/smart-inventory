import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import styles from "../styles/Dashboard.module.css";
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
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#9C27B0",
  "#F44336",
];

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Fetch inventory in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Calculations ---
  const totalItems = items.length;
  const totalQuantity = items.reduce(
    (sum, i) => sum + (parseInt(i.quantity) || 0),
    0
  );

  const lowStockCount = items.filter((i) => i.quantity < 10).length;
  const expiredCount = items.filter(
    (i) => new Date(i.expiryDate) < new Date()
  ).length;
  const soonToExpireCount = items.filter((i) => {
    const daysLeft =
      (new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return daysLeft > 0 && daysLeft <= 7;
  }).length;

  // --- Category Chart Data ---
  const categoryData = Object.values(
    items.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      acc[category] = acc[category] || { name: category, value: 0 };
      acc[category].value += 1;
      return acc;
    }, {})
  );

  // --- Recently Added ---
  const recentItems = [...items]
    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
    .slice(0, 5);

  // --- Expiring Soon ---
  const expiringSoon = items
    .filter((item) => {
      const daysLeft =
        (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
      return daysLeft > 0 && daysLeft <= 7;
    })
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    .slice(0, 5);

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
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
          <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
          <button onClick={() => navigate("/inventory")}>📋 Inventory</button>
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

      {/* Main content */}
      <main className={styles.dashboardContent}>
        <header className={styles.header}>
          <div>
            <h1>📊 Dashboard</h1>
            <p>
              Welcome back, <strong>{user?.email || "User"}</strong> 👋
            </p>
          </div>
          <button onClick={() => navigate("/add")} className={styles.addButton}>
            + Add New Item
          </button>
        </header>

        {/* Overview Cards */}
        <section className={styles.overview}>
          <div className={`${styles.card} ${styles.primary}`}>
            <h3>Total Items</h3>
            <p>{totalItems}</p>
          </div>
          <div className={`${styles.card} ${styles.info}`}>
            <h3>Total Quantity</h3>
            <p>{totalQuantity}</p>
          </div>
          <div className={`${styles.card} ${styles.warning}`}>
            <h3>Low Stock</h3>
            <p>{lowStockCount}</p>
          </div>
          <div className={`${styles.card} ${styles.danger}`}>
            <h3>Expired</h3>
            <p>{expiredCount}</p>
          </div>
          <div className={`${styles.card} ${styles.alert}`}>
            <h3>Expiring Soon</h3>
            <p>{soonToExpireCount}</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className={styles.charts}>
          <div className={styles.chartContainer}>
            <h3>📦 Category Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartContainer}>
            <h3>📊 Inventory Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#00C49F" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Quick Lists */}
        <section className={styles.quickLists}>
          <div className={styles.quickBox}>
            <h3>🆕 Recently Added</h3>
            <ul>
              {recentItems.length === 0 ? (
                <p>No recent items.</p>
              ) : (
                recentItems.map((item) => (
                  <li key={item.id}>
                    <span>{item.name}</span>
                    <span className={styles.badge}>{item.category}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className={styles.quickBox}>
            <h3>⏳ Expiring Soon</h3>
            <ul>
              {expiringSoon.length === 0 ? (
                <p>No expiring items.</p>
              ) : (
                expiringSoon.map((item) => {
                  const daysLeft = Math.ceil(
                    (new Date(item.expiryDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return (
                    <li key={item.id}>
                      <span>{item.name}</span>
                      <span
                        className={`${styles.badge} ${styles.warningBadge}`}
                      >
                        {daysLeft} day(s)
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </section>

        {/* Inventory Table */}
        <section className={styles.inventoryList}>
          <h2>📋 Inventory Items</h2>
          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p>No inventory found.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const isExpired = new Date(item.expiryDate) < new Date();
                    const isLow = item.quantity < 10;
                    return (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>{formatDate(item.expiryDate)}</td>
                        <td>
                          {isExpired ? (
                            <span className={styles.badgeDanger}>Expired</span>
                          ) : isLow ? (
                            <span className={styles.badgeWarning}>
                              Low Stock
                            </span>
                          ) : (
                            <span className={styles.badgeSuccess}>
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
