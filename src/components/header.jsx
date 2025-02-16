// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

const Header = ({ onLinkBank, onLogout }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1>BCLS</h1>
      </div>
      <div className="header-right">
        <button onClick={onLinkBank}>Link to Bank</button>
        <button onClick={onLogout}>Exit</button>
        <Link to="/credit" className="credit-link">
          <button>Credit</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;

