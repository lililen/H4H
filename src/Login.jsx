import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({setUser}) =>{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setUser(username); 
      navigate("/dashboard");
    } else {
      alert("Please enter a valid username and password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="website-name">Website Name</h1>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In </button>
        </form>
      </div>
    </div>
  );
};

export default Login;