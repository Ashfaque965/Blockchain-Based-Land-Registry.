import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaFileContract, FaExchangeAlt, FaShieldAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaFileContract className="logo-icon" />
          Land Registry
        </Link>

        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <FaHome /> Dashboard
              </Link>
              <Link to="/properties" className="nav-link">
                <FaFileContract /> Properties
              </Link>
              <Link to="/transfers" className="nav-link">
                <FaExchangeAlt /> Transfers
              </Link>
              <Link to="/verify" className="nav-link">
                <FaShieldAlt /> Verify
              </Link>
              <div className="nav-user">
                <Link to="/profile" className="nav-link user-profile">
                  <FaUser /> {user?.username}
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
