import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SolarTitle from './components/SolarTitle';
import SolarGraphPage from './components/SolarGraphPage';
import SolarMapPage from './components/SolarMapPage';
import Navbar from './components/NavigationBar';
import Contact from './components/contact';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <bf />
        <div className="page-content">
          <Route path="/" exact component={SolarTitle} />
          <Route path="/solargraph" component={SolarGraphPage} />
          <Route path="/solarmap" component={SolarMapPage} />
          <Route path="/contact" component={Contact} />
        </div>
      </div>
    </Router>

  );
}

export default App;
