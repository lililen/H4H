// Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      </div>
    </header>
  );
};

export default Header;
