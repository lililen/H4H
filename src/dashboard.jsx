import React, { useEffect, useState } from "react";
import "./dashboard.css"; 
import Header from './components/header';
import { useNavigate } from "react-router-dom";
import { usePlaidLink } from "react-plaid-link";




const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  //plaid +jwt
  const [linkToken, setLinkToken] = useState(null);
  const token = localStorage.getItem("access_token");
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

  ////palid fetch w flask

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        // fetch if the user has a valid JWT
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/plaid/create_link_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch link token");
        }
        const data = await response.json();
        // The backend should return { link_token: "..." }
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };
    fetchLinkToken();
  }, [token]);

  // onSuccess callback for Plaid Link
  const onSuccess = async (public_token, metadata) => {
    try {
      const response = await fetch("http://localhost:5000/api/plaid/exchange_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ public_token }),
      });
      if (!response.ok) {
        throw new Error("Token exchange failed");
      }
      const result = await response.json();
      console.log("Exchange result:", result);
      //  fetch updated account data 
      // update checking/savings with real data from the backend
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // onExit callback if the user closes Plaid Link
  const onExit = (error, metadata) => {
    if (error) {
      console.error("Plaid Link error:", error);
    }
   
  };

  // Config. the react-plaid-link hook
  const config = {
    token: linkToken,
    onSuccess,
    onExit,
  };

  const { open, ready } = usePlaidLink(config);

  //  open Plaid Link
  const handleLinkBank = () => {
    if (ready) {
      open();
    } else {
      console.log("Plaid Link not ready yet");
    }
  };

  //exit button
  

  const handleLogout = () => {
    // Remove the JWT from localStorage
    localStorage.removeItem("access_token");
    // Redirect to login page (assuming '/' is your login route)
    navigate("/");
  };



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
      <div>
      <Header onLinkBank={handleLinkBank} onLogout={handleLogout} />
      </div>
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

        {/* Enntertainment Budget */}
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
