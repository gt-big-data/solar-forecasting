import React from 'react';
import logo from './logo.svg';
import './App.css';
import SolarTitle from './components/SolarTitle';
import SolarMap from './components/SolarMap';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App() {
  return (
    <Router> 
      <div className="App">
        <Switch>
        <Route path="/" exact component={SolarTitle} />
        <Route path="/solarmap" component={SolarMap}/>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
