import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SolarTitle from './components/SolarTitle';
import SolarGraphPage from './components/SolarGraphPage';
import SolarMapPage from './components/SolarMapPage';
import Navbar from './components/NavigationBar';
import Contact from './components/contact';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latitude: null,
      longitude: null,
    }
  }

  updateCoordinates = (lat, long) => {
    this.setState({latitude: lat, longitude: long})
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Navbar />
          <bf />
          <div className="page-content">
            <Route path="/" exact component={SolarTitle} />
            <Route 
              path="/solargraph" 
              render={(props) => (
                <SolarGraphPage latitude={this.state.latitude} longitude={this.state.longitude}/>
              )}
            />
            <Route 
              path="/solarmap"
              render={(props) => (
                <SolarMapPage updateCoordinates={this.updateCoordinates}/>
              )}
            />
            <Route path="/contact" component={Contact} />
          </div>
        </Router>
      </div>
    );
  }
}
export default App;
