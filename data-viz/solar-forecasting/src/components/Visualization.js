import React, { Component } from 'react';
import SolarGraph from './SolarGraph';
import SolarMap from './SolarMap';

import './dataviz-style.css';
class Visualization extends Component {

  render() {
    const solarData = [
      "/data/Merriweather_2019_wPreds.csv",
      "/data/Butler_2019_wPreds.csv",
      "/data/Dublin_2019_wPreds.csv",
      "/data/Simon_2019_wPreds.csv",
    ];

    return (
      <div id="visualization-page">
        <h2 style={{textAlign: 'center'}}>Solar Graph and Map</h2>
        <SolarGraph dataList={solarData}/>
        <SolarMap/>
      </div>
    );
  }
}
export default Visualization;