import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as d3 from 'd3';
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
      sublocationList: [],
    }
  }

  componentDidMount() {
    d3.json('/data/latlong-list.json')
      .then(data => this.setState({sublocationList: data}));
  }

  updateCoordinates = (lat, long, sublocationList) => {
    this.setState({latitude: lat, longitude: long});
  }

  setSublocationList = (list) => {
    this.setState({sublocationList: list});
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
                <SolarGraphPage latitude={this.state.latitude} longitude={this.state.longitude} sublocationList={this.state.sublocationList}/>
              )}
            />
            <Route 
              path="/solarmap"
              render={(props) => (
                <SolarMapPage updateCoordinates={this.updateCoordinates} sublocationList={this.state.sublocationList}/>
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
