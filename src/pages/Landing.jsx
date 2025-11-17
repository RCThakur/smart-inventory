// src/pages/Landing.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Landing.css";

const features = [
  {
    title: "📦 Track Items",
    desc: "Maintain accurate item records with expiry, quantity, and categories.",
    img: "/assets/feature1.png",
  },
  {
    title: "🔔 Alerts",
    desc: "Get notified for low-stock and expired items in real-time.",
    img: "/assets/feature2.png",
  },
  {
    title: "📊 Smart Reports",
    desc: "Generate insightful reports on inventory performance and trends.",
    img: "/assets/feature3.png",
  },
  {
    title: "👥 Role-Based Access",
    desc: "Assign roles like admin, manager, or viewer with permission control.",
    img: "/assets/feature4.png",
  },
];

const highlights = [
  {
    title: "Order Management",
    desc: "Streamline your orders with real-time tracking and updates.",
    img: "/assets/highlight1.png",
  },
  {
    title: "Stock Management",
    desc: "Manage your stock efficiently and reduce wastage.",
    img: "/assets/highlight2.png",
  },
  {
    title: "Reports & Insights",
    desc: "Analyze trends and make data-driven decisions.",
    img: "/assets/highlight3.png",
  },
];

const Landing = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`landing ${darkMode ? "dark" : ""}`}>
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">📦 SmartInventory</div>
        <nav>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/signup" className="nav-link">
            Signup
          </Link>
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </nav>
      </header>

      {/* Hero Banner */}
      <section className="hero">
        <img
          src="/assets/banner2.jpg" // <- your banner image path
          alt="Inventory Banner"
          className="hero-banner"
        />
        <div className="hero-overlay">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Manage Inventory Smarter, Not Harder
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Streamline your inventory, track stocks, and automate alerts in
            minutes.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/signup" className="cta-btn">
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              className="feature-card"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <img src={f.img} alt={f.title} />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights">
        <h2>Why Choose SmartInventory</h2>
        <div className="highlights-grid">
          {highlights.map((h, i) => (
            <motion.div
              className="highlight-card"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <img src={h.img} alt={h.title} />
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h4>Contact</h4>
            <p>Email: support@smartinventory.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </ul>
          </div>
        </div>
        <p>
          &copy; {new Date().getFullYear()} SmartInventory. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
