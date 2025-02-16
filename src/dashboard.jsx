import React from "react";
import "./dashboard.css"; // Import CSS file

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-container">
      <header>
        <h1>Welcome, {user} 👋</h1>
        <p>Stay on top of your spending!</p>
      </header>

      <section className="account-summary">
        <div className="account-box">
          <h3>💰 Checking Account</h3>
          <p>$2,500.00</p>
        </div>
        <div className="account-box">
          <h3>🏦 Savings Account</h3>
          <p>$8,000.00</p>
        </div>
      </section>

      <section className="budget-overview">
        <h2>📊 Monthly Budget</h2>
        <div className="budget-item">
          <span>Shopping</span> <span>$300 / $500</span>
          <div className="progress-bar">
            <div className="progress shopping"></div>
          </div>
        </div>
        <div className="budget-item">
          <span>Entertainment</span> <span>$120 / $200</span>
          <div className="progress-bar">
            <div className="progress entertainment"></div>
          </div>
        </div>
        <div className="budget-item">
          <span>Food</span> <span>$250 / $400</span>
          <div className="progress-bar">
            <div className="progress food"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
