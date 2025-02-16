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


   // notification state
   const [showNotification, setShowNotification] = useState(true);


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
        if (!token) {
          console.log("No JWT token found, skipping link token fetch");
          return;
        }
        const response = await fetch("http://localhost:5000/api/plaid/create_link_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Link token fetch status:", response.status);
        const data = await response.json();
        console.log("Fetched link token data:", data);
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
    console.log("Link to Bank button clicked");
    console.log("linkToken:", linkToken);
    console.log("ready:", ready);
    if (ready && linkToken) {
      console.log("Opening Plaid Link...");
      open();
    } else {
      console.log("Plaid Link not ready yet (or no linkToken).");
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
  const [categories, setCategories] = useState([
    {
      name: "Shopping",
      budget: 500,
      spending: [],       
      tempAmount: "",  
      tempDesc: " ",   
    
    },
    {
      name: "Entertainment",
      budget: 200,
      spending: [],       
      tempAmount: "",
    },
    {
      name: "Food-Yum!",
      budget: 400,
      spending: [],
      tempAmount: "",
      tempDesc: "",
    },
  ]);

  function updateBudget(index, newBudget) {
    setCategories((prevCategories) => {
      const updated = [...prevCategories];
      updated[index] = { ...updated[index], budget: newBudget };
      return updated;
    });
  }
  
  function updateTempAmount(index, amount) {
    setCategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], tempAmount: amount };
      return updated;
    });
  }
  
  function updateTempDesc(index, desc) {
    setCategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], tempDesc: desc };
      return updated;
    });
  }
  
  function addSpending(index) {
    setCategories((prevCategories) => {
      const updated = [...prevCategories];
      const cat = updated[index];
      if (cat.tempAmount) {
        const record = `$${cat.tempAmount} (${cat.tempDesc || "No description"})`;
        cat.spending = [...cat.spending, record];
        cat.tempAmount = "";
        cat.tempDesc = "";
      }
      return updated;
    });
  }
  
  function addNewCategory() {
    setCategories((prev) => [
      ...prev,
      {
        name: "New Category",
        budget: 100,
        spending: [],
        tempAmount: "",
        tempDesc: "",
      },
    ]);
  }
  function getTotalSpent(spendingArray) {
    return spendingArray.reduce((total, record) => {
      const match = record.match(/\$(\d+(\.\d+)?)/);
      return match ? total + parseFloat(match[1]) : total;
    }, 0);
  }
  
  
  return (
    <div className="dashboard-container">
      <div>
        <Header onLinkBank={handleLinkBank} onLogout={handleLogout} />
      </div>

      <header>
        <h1>Welcome, {user}</h1>
        <p>Stay on top of your spending!</p>
      </header>

      {showNotification && (
        <div className="notification">
          <span>Welcome to BCLS! Let's set up your budget!</span>
          <button className="close-btn" onClick={() => setShowNotification(false)}>X</button>
        </div>
      )}

      {/* Account Balances - dynamic */}
      <section className="account-summary">
        <div className="account-box">
          <h3>💰 Checking Account</h3>
          <input
            type="number"
            value={checking}
            onChange={(e) => setChecking(Number(e.target.value))}
          />
        </div>
        <div className="account-box">
          <h3>🏦 Savings Account</h3>
          <input
            type="number"
            value={savings}
            onChange={(e) => setSavings(Number(e.target.value))}
          />
        </div>
      </section>

    {/* Budget Overview */}
    <section className="budget-overview">
      <h2>📊 Monthly Budget</h2>
      {categories.map((cat, index) => {
        const totalSpent = getTotalSpent(cat.spending);
        return (
          <div key={index} className="budget-item">
            <span>{cat.name}</span>
            <input
              type="number"
              value={cat.budget}
              onChange={(e) => updateBudget(index, Number(e.target.value))}
            />
            <p>Spent: ${totalSpent} / ${cat.budget}</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${(totalSpent / cat.budget) * 100}%`,
                  backgroundColor: getProgressColor(totalSpent, cat.budget),
                }}
              ></div>
            </div>
            <input
              type="number"
              placeholder="Enter spending amount"
              value={cat.tempAmount || ""}
              onChange={(e) => updateTempAmount(index, e.target.value)}
              className="wide-input"
            />
            <input
              type="text"
              placeholder="Enter description"
              value={cat.tempDesc || ""}
              onChange={(e) => updateTempDesc(index, e.target.value)}
              className="wide-input"
            />
            <button onClick={() => addSpending(index)}>Add</button>
            <ul>
              {cat.spending.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        );
      })}
      <button onClick={addNewCategory} className="add-category-btn">
        + Add Category
      </button>
    </section>
    </div>
  );
};
export default Dashboard;
