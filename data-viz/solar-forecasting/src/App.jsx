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
      selectedCoordinate: null,
      sublocationList: [],
      dataLoaded: false,
    }
  }

  componentDidMount() {
    d3.json('/data/latlong-new.json')
      .then(data => {
        this.setState({sublocationList: data, dataLoaded: true})
      });
  }

  updateCoordinates = (lat, long, county) => {
    this.setState({
      selectedCoordinate: {
        latitude: lat,
        longitude: long,
        county: county,
      }
    });
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
              render={(props) => {
                if (this.state.dataLoaded) {
                  return (
                    <SolarGraphPage selectedCoordinate={this.state.selectedCoordinate} sublocationList={this.state.sublocationList}/>
                  )
                }
              }}
            />
            <Route 
              path="/solarmap"
              render={(props) => {
                if (this.state.dataLoaded) {
                  return (
                    <SolarMapPage updateCoordinates={this.updateCoordinates} sublocationList={this.state.sublocationList}/>
                  )
                }
               }}
            />
            <Route path="/contact" component={Contact} />
          </div>
        </Router>
      </div>
    );
  }
}
export default App;
