import React from 'react';
import logo from './logo.svg';
import './App.css';
import SolarTitle from './components/SolarTitle';
import SolarMap from './components/SolarMap';
import Navbar from './components/NavigationBar';
import SolarGraph from './components/SolarGraph';
import Contact from './components/contact';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App() {
  return (
    <Router> 
      <div className="App">
        <Navbar />
        <bf/>
        <Route path="/" exact component={SolarTitle} />
        <Route path="/solarmap" component={SolarMap}/>
        <Route path="/solargraph" component={SolarGraph}/>
        <Route path="/contact" component={Contact}/>
      </div>
    </Router>

  );
}

export default App;
