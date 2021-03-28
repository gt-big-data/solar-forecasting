import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-light bg-light navbar-expand-sm" style={{padding: '.5rem var(--sideMargin)', zIndex: '2'}}>
        <Link to="/" className="navbar-brand mb-0 h1">Solar Forecasting</Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
            <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="navbar-item">
            <Link to="/solargraph" className="nav-link">Visualization</Link>
            </li>
            <li className="navbar-item">
            <Link to="/contact" className="nav-link">Contact Us</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}