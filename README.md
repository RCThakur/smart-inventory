# 📦 SmartInventory

SmartInventory is a full-featured inventory management system built using **React**, **Firebase**, and **Recharts**. It allows businesses and individuals to easily track stock levels, manage categories, receive stock alerts, and view insightful reports — all from a modern dashboard.

---

## 🚀 Features

### 🔐 Authentication

- Firebase Email & Password Login/Signup
- Protected routes based on user state

### 📋 Inventory Management

- Add, update, delete items
- Store inventory in Firebase Firestore
- Live updates with `onSnapshot`
- Expired and low-stock detection

### 📊 Dynamic Dashboard

- Live overview: Total items, low stock, expired items
- Recharts Pie and Bar charts for visualization
- Recently added & expiring soon lists

### 📁 Reporting

- Visual reports by category and stock level
- PieChart and BarChart views
- Export-ready structure for future enhancements (PDF/CSV)

### 🧑‍💼 Role-Based Access (coming soon)

- Admin and Staff segregation for secure access

---

## 🛠️ Tech Stack

| Tech             | Usage              |
| ---------------- | ------------------ |
| **React**        | UI Components      |
| **Vite**         | Fast bundler setup |
| **Firebase**     | Auth & Firestore   |
| **Recharts**     | Data Visualization |
| **CSS Modules**  | Scoped styling     |
| **React Router** | Page navigation    |

---

---

## 📁 Project Structure

src/
├── components/
│ └── InventoryForm.jsx, InventoryList.jsx
├── contexts/
│ └── AuthContext.jsx
├── pages/
│ ├── Dashboard.jsx
│ ├── Inventory.jsx
│ ├── AddItem.jsx
│ ├── Reports.jsx
│ ├── Login.jsx
│ ├── Signup.jsx
│ └── Landing.jsx
├── styles/
│ ├── Dashboard.module.css
│ ├── Auth.css
│ └── landing.css
├── firebase.js
├── App.jsx
└── main.jsx
