import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/Reports.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#a28fd0",
];

const Reports = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const inventoryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(inventoryData);
    });
    return () => unsub();
  }, []);

  // Calculate category counts for pie chart
  const categoryData = items.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryData).map((cat) => ({
    name: cat,
    value: categoryData[cat],
  }));

  // Inventory status counts for KPI cards
  const expiredCount = items.filter(
    (item) => new Date(item.expiryDate) < new Date()
  ).length;
  const today = new Date();
  const soonToExpireCount = items.filter((item) => {
    const diffDays =
      (new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 7;
  }).length;
  const lowStockCount = items.filter(
    (item) => Number(item.quantity) < 10
  ).length;

  // Tooltip formatter for Pie chart
  const pieTooltipFormatter = (value, name) => [`${value} items`, name];

  return (
    <div className={styles.reportPage}>
      <header className={styles.header}>
        <h1>📊 Inventory Reports</h1>
        <p>Real-time overview of inventory categories and stock levels</p>
      </header>

      {/* KPI Overview */}
      <section className={styles.kpiOverview}>
        <div className={styles.kpiCard}>
          <h3>Expired Items</h3>
          <p>{expiredCount}</p>
        </div>
        <div className={styles.kpiCard}>
          <h3>Expiring Soon (7 days)</h3>
          <p>{soonToExpireCount}</p>
        </div>
        <div className={styles.kpiCard}>
          <h3>Low Stock</h3>
          <p>{lowStockCount}</p>
        </div>
        <div className={styles.kpiCard}>
          <h3>Total Items</h3>
          <p>{items.length}</p>
        </div>
      </section>

      <div className={styles.grid}>
        {/* Category Pie Chart */}
        <div className={styles.chartCard}>
          <h2>📦 Category Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(1)}%`
                }
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={pieTooltipFormatter} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Levels Bar Chart */}
        <div className={styles.chartCard}>
          <h2>📊 Stock Levels by Item</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={items}>
              <XAxis dataKey="name" hide={items.length > 10} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
