import React from "react";
import "./dashboard.css"; // Import the CSS file

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header>
        <h1>Welcome, You little bitch</h1>
        <p>Stay on top of your spending!</p>
      </header>

      {/* Notifications Section */}
      <section className="notifications">
        <h2>🔔 Notifications</h2>
        <p>You spent $50 on Entertainment today. What a dumbass</p>
      </section>

      {/* Account Summary */}
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

      {/* Budget Overview */}
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
