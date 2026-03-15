import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        
        <div className="logo">
          Franchise<span>Chain</span>
        </div>

        <nav className="nav">
          <a href="#">Home</a>
          <a href="#">Suppliers</a>
          <a href="#">Warehouse</a>
          <a href="#">Inventory</a>
          <a href="#">Contact</a>
        </nav>

        <div className="header-actions">
          <button className="login" onClick={() => navigate('/login')}>Login</button>
          <button className="signup">Sign Up</button>
        </div>

      </div>
    </header>
  );
};

export default Header;