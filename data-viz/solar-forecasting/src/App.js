import React from 'react';
import logo from './logo.svg';
import './App.css';
import SolarTitle from './components/SolarTitle';
import SolarMap from './components/SolarMap';
import SolarGraph from './components/SolarGraph';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App() {
  return (
    <Router> 
      <div className="App">
        <Switch>
        <Route path="/" exact component={SolarTitle} />
        <Route path="/solarmap" component={SolarMap}/>
        <Route path="/solargraph" component={SolarGraph}/>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
