import React, { useState } from "react";
import "./dashboard.css"; // Import CSS file

const Dashboard = ({ user }) => {
  // State for account balances
  const [checking, setChecking] = useState(2500);
  const [savings, setSavings] = useState(8000);

  // State for budgets
  const [shoppingBudget, setShoppingBudget] = useState(500);
  const [entertainmentBudget, setEntertainmentBudget] = useState(200);
  const [foodBudget, setFoodBudget] = useState(400);

  // State for spending records
  const [shoppingSpending, setShoppingSpending] = useState([]);
  const [entertainmentSpending, setEntertainmentSpending] = useState([]);
  const [foodSpending, setFoodSpending] = useState([]);

  // State for user inputs
  const [shoppingInput, setShoppingInput] = useState("");
  const [entertainmentInput, setEntertainmentInput] = useState("");
  const [foodInput, setFoodInput] = useState("");

  const [shoppingDesc, setShoppingDesc] = useState("");
  const [entertainmentDesc, setEntertainmentDesc] = useState("");
  const [foodDesc, setFoodDesc] = useState("");

  // Function to determine color based on budget usage
  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 75) return "red";
    if (percentage > 50) return "yellow";
    return "green";
  };

  // Function to add spending records
  const addShoppingSpending = () => {
    if (shoppingInput) {
      setShoppingSpending([...shoppingSpending, `$${shoppingInput} (${shoppingDesc})`]);
      setShoppingInput("");
      setShoppingDesc("");
    }
  };

  const addEntertainmentSpending = () => {
    if (entertainmentInput) {
      setEntertainmentSpending([...entertainmentSpending, `$${entertainmentInput} (${entertainmentDesc})`]);
      setEntertainmentInput("");
      setEntertainmentDesc("");
    }
  };

  const addFoodSpending = () => {
    if (foodInput) {
      setFoodSpending([...foodSpending, `$${foodInput} (${foodDesc})`]);
      setFoodInput("");
      setFoodDesc("");
    }
  };

  // Calculate total spending for each category
  const getTotalSpent = (spendingList) => {
    return spendingList.reduce((total, item) => {
      const amount = parseFloat(item.match(/\$(\d+(\.\d+)?)/)[1]); // Extracts the number after "$"
      return total + amount;
    }, 0);
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Welcome, {user} 👋</h1>
        <p>Stay on top of your spending!</p>
      </header>

      {/* Account Balances - Editable */}
      <section className="account-summary">
        <div className="account-box">
          <h3>💰 Checking Account</h3>
          <input type="number" value={checking} onChange={(e) => setChecking(Number(e.target.value))} />
        </div>
        <div className="account-box">
          <h3>🏦 Savings Account</h3>
          <input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
        </div>
      </section>

      {/* Budget Overview */}
      <section className="budget-overview">
        <h2>📊 Monthly Budget</h2>

        {/* Shopping Budget */}
        <div className="budget-item">
          <span>Shopping</span>
          <input type="number" value={shoppingBudget} onChange={(e) => setShoppingBudget(Number(e.target.value))} />
          <p>Spent: ${getTotalSpent(shoppingSpending)} / ${shoppingBudget}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(getTotalSpent(shoppingSpending) / shoppingBudget) * 100}%`, backgroundColor: getProgressColor(getTotalSpent(shoppingSpending), shoppingBudget) }}></div>
          </div>
          <input type="number" placeholder="Enter spending amount" value={shoppingInput} onChange={(e) => setShoppingInput(e.target.value)} className="wide-input" />
          <input type="text" placeholder="Enter description" value={shoppingDesc} onChange={(e) => setShoppingDesc(e.target.value)} className="wide-input" />
          <button onClick={addShoppingSpending}>Add</button>
          <ul>
            {shoppingSpending.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Entertainment Budget */}
        <div className="budget-item">
          <span>Entertainment</span>
          <input type="number" value={entertainmentBudget} onChange={(e) => setEntertainmentBudget(Number(e.target.value))} />
          <p>Spent: ${getTotalSpent(entertainmentSpending)} / ${entertainmentBudget}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(getTotalSpent(entertainmentSpending) / entertainmentBudget) * 100}%`, backgroundColor: getProgressColor(getTotalSpent(entertainmentSpending), entertainmentBudget) }}></div>
          </div>
          <input type="number" placeholder="Enter spending amount" value={entertainmentInput} onChange={(e) => setEntertainmentInput(e.target.value)} className="wide-input" />
          <input type="text" placeholder="Enter description" value={entertainmentDesc} onChange={(e) => setEntertainmentDesc(e.target.value)} className="wide-input" />
          <button onClick={addEntertainmentSpending}>Add</button>
          <ul>
            {entertainmentSpending.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Food Budget */}
        <div className="budget-item">
          <span>Food</span>
          <input type="number" value={foodBudget} onChange={(e) => setFoodBudget(Number(e.target.value))} />
          <p>Spent: ${getTotalSpent(foodSpending)} / ${foodBudget}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(getTotalSpent(foodSpending) / foodBudget) * 100}%`, backgroundColor: getProgressColor(getTotalSpent(foodSpending), foodBudget) }}></div>
          </div>
          <input type="number" placeholder="Enter spending amount" value={foodInput} onChange={(e) => setFoodInput(e.target.value)} className="wide-input" />
          <input type="text" placeholder="Enter description" value={foodDesc} onChange={(e) => setFoodDesc(e.target.value)} className="wide-input" />
          <button onClick={addFoodSpending}>Add</button>
          <ul>
            {foodSpending.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
//
export default Dashboard;
