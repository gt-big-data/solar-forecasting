import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar-custom navbar navbar-light navbar-expand-sm" style={{ padding: '.5rem var(--sideMargin)', zIndex: '2' }}>
      <Link to="/" className="navbar-brand mb-0 h1">Solar Forecasting</Link>
      <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/solargraph" className="nav-link">Visualization Chart</Link>
          </li>
          <li className="navbar-item">
            <Link to="/solarmap" className="nav-link">Visualization Map</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="nav-link">Contact Us</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
