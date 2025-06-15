// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import "./Landing.css";

const Landing = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`landing-container ${darkMode ? "dark" : ""}`}>
      <header className="landing-header sticky">
        <div className="logo">📦 SmartInventory</div>
        <nav>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Signup</Link>
          <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Manage Inventory Smarter, Not Harder
          </motion.h1>
          <p>AI-powered inventory management with real-time tracking, alerts, and forecasts.</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/signup" className="cta-button">Get Started</Link>
          </motion.div>
        </div>
        <svg className="wave" viewBox="0 0 1440 320">
          <path fill="#fff" fillOpacity="1"
            d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,165.3C840,171,960,213,1080,229.3C1200,245,1320,235,1380,229.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
          </path>
        </svg>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          {[
            ["📋 Track Items", "Maintain accurate item records with expiry, quantity, and categories."],
            ["🔔 Alerts", "Get notified for low-stock and expired items in real-time."],
            ["📊 Smart Reports", "Generate insightful reports on inventory performance and trends."],
            ["👥 Role-Based Access", "Assign roles like admin, manager, or viewer with permission control."]
          ].map(([title, desc], i) => (
            <motion.div
              className="feature-card"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3>{title}</h3>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>“SmartInventory helped us cut inventory waste by 40%!”</p>
          <cite>— Aditi Rao, Operations Head</cite>
        </div>
        <div className="testimonial">
          <p>“Our stock alerts now save us hours every week.”</p>
          <cite>— Raj Patel, Warehouse Manager</cite>
        </div>
      </section>

      <section className="video-demo">
        <h2>Watch It in Action</h2>
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/tgbNymZ7vqY"
          title="SmartInventory Demo"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </section>

      <footer className="landing-footer">
          <div className="footer-grid">
          <div>
            <h4>About</h4>
            <p>SmartInventory is your intelligent inventory management partner — helping businesses optimize their stock with AI insights.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <p>Email: support@smartinventory.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
        <p>&copy; {new Date().getFullYear()} SmartInventory. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
