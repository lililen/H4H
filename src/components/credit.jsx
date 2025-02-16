import React from "react";
import { useNavigate } from "reac-router-dom";
import "./Credit.css";

const Credit = ({ totalSpent, totalBudget}) => {
    const navigate = useNavigate();
    const spendingPercentage = totalBudget > 0 ? Math.min((totalSpent/totalBudget)*100,100) : 0;

    return (
        <div className="credit-container">
        <h1>Credit Payment</h1>
        <div className="wheel-container">
          <svg viewBox="0 0 150 150" className="progress-wheel">
            <circle cx="50" cy="50" r="45" className="wheel-bg" />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="wheel-progress"
              style={{
                strokeDasharray: "282.74", 
                strokeDashoffset: '${282.74 - (spendingPercentage / 100) * 282.74}',
              }}
            />
          </svg>
          <div className="wheel-text">{Math.round(spendingPercentage)}%</div>
        </div>
        <p>Total Spent: ${totalSpent.toFixed(2)} / Budget: ${totalBudget.toFixed(2)}</p>
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    );
};