import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SolarTitle from './components/SolarTitle';
import SolarMap from './components/SolarMap';
import Navbar from './components/NavigationBar';
import Visualization from './components/Visualization';
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
          <Route path="/solarmap" component={SolarMap} />
          <Route path="/visualization" component={Visualization} />
          <Route path="/contact" component={Contact} />
        </div>
      </div>
    </Router>

  );
}

export default App;
