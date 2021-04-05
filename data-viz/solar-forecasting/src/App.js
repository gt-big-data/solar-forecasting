import React from 'react';
import logo from './logo.svg';
import './App.css';
import SolarTitle from './components/SolarTitle';
import SolarMap from './components/SolarMap';
import Navbar from './components/NavigationBar';
import Visualization from './components/Visualization';
import Contact from './components/contact';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App() {
  return (
    <Router> 
      <div className="App">
        <Navbar />
        <bf/>
        <div className="page-content">
          <Route path="/" exact component={SolarTitle} />
          <Route path="/solarmap" component={SolarMap}/>
          <Route path="/visualization" component={Visualization}/>
          <Route path="/contact" component={Contact}/>
        </div>
      </div>
    </Router>

  );
}

export default App;
