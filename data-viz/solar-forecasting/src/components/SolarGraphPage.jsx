import React, { Component } from 'react';
import * as d3 from 'd3';
import './SolarGraphPage.css';

class SolarGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordList: [],
    }
  }
  componentDidMount() {

    const rowConverter = (d) => ({
      date: new Date(+d.Year, (+d.Month - 1), +d.Day, +d.Hour, +d.Minute),
      GHI: parseFloat(d.GHI),
      Prediction: +d.Predictions,
    });

    // Specifications for svg element.
    const w = 1160;
    const h = 740;

    // margin properties
    const margin = {
      top: 60, right: 10, bottom: 70, left: 90,
    };

    // width and height of actual graph
    const width = w - margin.left - margin.right;
    const height = h - margin.top - margin.bottom;

    // create new svg element for the graph. Has larger true width and height (w, h)
    const svg = d3.select('#solar-graph')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, w, h])
      .attr('preserveAspectRatio', 'xMidYMin meet')
      .classed('svg-content', true);

    // ASYNCHRONOUS - Load CSV file (1st Day Jan 2019 Sample)
    // http://127.0.0.1:5000//data/location/32.61/-85.14.csv

    Promise.all([
      d3.csv('/data/Merriweather_2019_wPreds.csv', rowConverter),
      d3.csv('/data/Butler_2019_wPreds.csv', rowConverter), 
      d3.csv('/data/Dublin_2019_wPreds.csv', rowConverter), 
      d3.csv('/data/Simon_2019_wPreds.csv', rowConverter), 
    ]).then((data) => {
      const datasetMerriweather = data[0];
      const datasetButler = data[1];
      const datasetDublin = data[2];
      const datasetSimon = data[3];

      // line from d3.line(), public for modifying with zooming
      let line;
      let analysisLine;

      // Create rectangle for the clipping path. only graph parts inside rectangle will be shown.
      svg.append('defs').append('clipPath')
        .attr('id', 'clip') // set id, referred to in css file.
        .append('rect')
        .attr('width', width)
        .attr('height', height);

      // Scales to be used for line graph
      const timeXScale = d3.scaleTime() // time scaling for the x axis.
        .range([0, width]);

      // Linear scaling for y axis
      const lineYScale = d3.scaleLinear()
        .range([height, 0]);

      // grouping element parent (to add elements into)
      // Set the gParent variable (to group future elements inside of)
      const gParent = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      gParent.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${w / 2 - margin.left}, ${height + margin.bottom / 2})`)
        .text('Time');

      gParent.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${-margin.left / 2}, ${height / 2})`)
        .text('GHI');

      const gLegend = gParent.append('g')
        .attr('transform', `translate(${width - 100}, ${0})`);

      gLegend.append('circle')
        .attr('cx', 0)
        .attr('cy', -6)
        .attr('r', 6)
        .attr('fill', 'var(--tealBlue)');

      gLegend.append('circle')
        .attr('cx', 0)
        .attr('cy', -6 + 20)
        .attr('r', 6)
        .attr('fill', 'var(--cinnabarRed)');

      gLegend.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${15}, ${0})`)
        .text('Actual');

      gLegend.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${15}, ${20})`)
        .text('Prediction');

      // xAxis and yAxis- public for manuipulating by zooming.
      // Create x axis once, approximately estimate 20 ticks.
      const xAxis = d3.axisBottom()
        .scale(timeXScale)
        .ticks(20);

      // Create y axis once, also appx 20 ticks.
      const yAxis = d3.axisLeft()
        .scale(lineYScale)
        .ticks(20);

      // Add a group element, shift x axis to bottom.
      gParent.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height})`);

      // Add a group element, shift y axis to left side.
      gParent.append('g')
        .attr('class', 'axis axis--y');
      // use this statement to move axis to right, if desired
      // .attr("transform", "translate(" + width + ",0)")

      let merriweatherButton;
      let butlerButton;
      let dublinButton;
      let simonButton;
      let groupButton;
      let tempLol;

      // used for zooming capabilities.
      let t;
      let xt;
      let zoomPerformed = false;

      // The actions that should result from zooming.
      function zoomAction() {
        gParent.select('#GHIDataLine').attr('d', line.x((d) => xt(d.date)));
        gParent.select('#GHIPredictionLine').attr('d', analysisLine.x((d) => xt(d.date)));
        gParent.select('.axis--x').call(xAxis.scale(xt));
      }

      // Function to scale the graph appropriately, alongside the x axis.
      // Particularly responds to a d3 event.
      function zoomed(event) {
        // console.log("X " + event.transform.x);
        // console.log("Y " + event.transform.y);
        zoomPerformed = true; // Do not make false again.
        t = event.transform;
        xt = t.rescaleX(timeXScale);
        zoomAction();
      }

      function displayLineGraph(dataset) {
        // This statement is only necessary if we want to view a part of the data.
        // dataset = dataset.slice(dataset.length - 4000, dataset.length);

        //lets try to access vars appropriately

        const zoom = d3.zoom()
          .scaleExtent([1, 400]) // how much I can zoom in
          .translateExtent([[0, 0], [width, height]]) // for performing translations
          .extent([[0, 0], [width, height]])
          .on('zoom', zoomed); // refer to zoomed function

        // Time scaling for x axis
        const test = dataset.map((d) => d.date);

        timeXScale // time scaling for the x axis.
          .domain([
            d3.min(Object.values(test)),
            d3.max(Object.values(test)),
          ]);

        // Linear scaling for y axis
        lineYScale
          .domain([0, d3.max(dataset, (d) => d.GHI)]);

        gParent.select('.axis--x').call(xAxis);
        gParent.select('.axis--y').call(yAxis);

        // set value for line variable, set appropriate scaling.
        line = d3.line()
          .x((d) => timeXScale(d.date))
          .y((d) => lineYScale(d.GHI));

        // set value for analysis line using Prediction data
        analysisLine = d3.line()
          .x((d) => timeXScale(d.date))
          .y((d) => lineYScale(d.Prediction));

        gParent.selectAll('.line').remove();

        // Create line - same thing, but for prediction!
        gParent.append('path')
          // Bind the data appropriately
          .datum(dataset)
          .attr('class', 'line') // for later CSS purposes to reformat line
          .attr('id', 'GHIPredictionLine')
          .attr('d', analysisLine); // refer to previous line generator defined.

         // Create line
        gParent.append('path')
          // Bind the data appropriately
          .datum(dataset)

          .attr('class', 'line') // for later CSS purposes to reformat line
          .attr('id', 'GHIDataLine')
          .attr('d', line); // refer to previous line generator defined.

        // Needed for zooming capabilities
        svg.call(zoom);

        // Make call at any update to KEEP the zoom when changing from one solar farm to another
        // Only do if zoom has been attempted before (otherwise, what's the point, and t and xt
        // would not be defined).
        if (zoomPerformed) {
          zoomAction();
        }
      }

      function farmButtonClick(solarData, buttonEle) {
        // dataset here acts as a temp holder for whatever data we are
        // dealing with.

        const button = buttonEle;
        merriweatherButton.class = 'solarfarmbutton';
        dublinButton.class = 'solarfarmbutton';
        simonButton.class = 'solarfarmbutton';
        butlerButton.class = 'solarfarmbutton';

        merriweatherButton.id = '';
        dublinButton.id = '';
        butlerButton.id = '';
        simonButton.id = '';

        button.class = '';
        button.id = 'clickedfarmbutton';

        // buttonEle.id = "clickedfarmbutton";
        displayLineGraph(solarData);
      }

      function createButtons() {
        // Create 4 button on page.
        // Center it relative to the graph. Graph will be in center of page.
        // Thus, just two buttons left, two buttons right

        // var svg = d3.select("body")
        // .append("button")
        // .attr("width", w)
        // .attr("height", h);
        merriweatherButton = document.createElement('input');
        merriweatherButton.type = 'button';
        merriweatherButton.value = 'Merriweather';
        merriweatherButton.className = 'solarfarmbutton';
        merriweatherButton.addEventListener('click', () => {
          farmButtonClick(datasetMerriweather, merriweatherButton);
        });

        butlerButton = document.createElement('input');
        butlerButton.type = 'button';
        butlerButton.value = 'Butler';
        butlerButton.className = 'solarfarmbutton';
        butlerButton.addEventListener('click', () => {
          farmButtonClick(datasetButler, butlerButton);
        });

        dublinButton = document.createElement('input');
        dublinButton.type = 'button';
        dublinButton.value = 'Dublin';
        dublinButton.className = 'solarfarmbutton';
        dublinButton.addEventListener('click', () => {
          farmButtonClick(datasetDublin, dublinButton);
        });

        simonButton = document.createElement('input');
        simonButton.type = 'button';
        simonButton.value = 'Simon';
        simonButton.className = 'solarfarmbutton';
        simonButton.addEventListener('click', () => {
          farmButtonClick(datasetSimon, simonButton);
        });

        // To group buttons appropriately
        groupButton = document.createElement('div');
        groupButton.id = 'groupbutton';

        groupButton.appendChild(merriweatherButton);

        tempLol = document.createElement('div');
        tempLol.className = 'divider';
        groupButton.appendChild(tempLol);

        groupButton.appendChild(butlerButton);

        tempLol = document.createElement('div');
        tempLol.className = 'divider';
        groupButton.appendChild(tempLol);

        groupButton.appendChild(dublinButton);

        tempLol = document.createElement('div');
        tempLol.className = 'divider';
        groupButton.appendChild(tempLol);

        groupButton.appendChild(simonButton);
        groupButton.style.textAlign = 'center';

        const buttonDiv = document.getElementById('button-group');
        buttonDiv.appendChild(groupButton);
      }

      createButtons();
      farmButtonClick(datasetMerriweather, merriweatherButton);



      function makeAPICall(latLongArr) {
        //1. do csv stuff copy paste
        fetch(`http://127.0.0.1:5000/data/location/${latLongArr[0]}/${latLongArr[1]}`)
          .then(response => response.text())
          .then(stringData => {
            //please change prediction value accordingly! 10 is just for testing purposes to see if Prediction data is displaying properly.
            var apidata = d3.csvParseRows(stringData, (d, i) => {
              return {
                date: new Date(+2019, (+d[0] - 1), +d[1], +d[2], +d[3]),
                GHI: d[4],
                Prediction: 10,
              }
            })
            displayLineGraph(apidata);
          });
      }

      function submitSearch() {
        const latLongString = document.getElementById("latlong-selector").value;
        const latLongArr = latLongString.split(',');
        makeAPICall(latLongArr);
      }

      if (this.props.latitude !== null) {
        // load chart with prop data
        makeAPICall([this.props.latitude, this.props.longitude]);
      }

      document.getElementById("submit-linechart").onclick =() => submitSearch();
      //the id for that div may not be needed (check the css file for something separate to manage the div if needed.)
    });
  }

  updateSelectOptions = (event) => {
    const county = event.target.value;
    this.setState({coordList: this.props.sublocationList[county]});
  }

  render() {
    const { sublocationList } = this.props;
    return (
      <div className="solar-graph-page" >
        <div className="graph-container">
          <svg id="solar-graph" />
        </div>
        <div className="graph-sidebar">
          <h5>Analyzing Location Solar Data</h5>
          <p>
            You can use this tool to observe Global Horizontal Irradiance (GHI) data for any particular location.
            GHI measures the total solar radiation received on a theoretical horizontal surface. 
          </p>
          <p>Scroll to zoom in or out and drag-click to shift the chart!</p>
          <hr/>
          <p>View data from a solar farm</p>
          <div id="button-group" />
          <hr/>
          <p>View data from a sublocation in a county</p>
          <div id="location-selector-linechart">
            <select className="dropdown" name="county-selector" id="county-selector" onChange={this.updateSelectOptions}>
              <option selected disabled hidden>Select a County</option>
              {Object.keys(sublocationList).map(county => (
                  <option value={county}>{county}</option>
                ))}
            </select>
            <select className="dropdown" name="latlong-selector" id="latlong-selector">
              <option selected disabled hidden>Select a County Sublocation</option>
              {this.state.coordList.map(coord => (
                <option value={`${coord.latitude},${coord.longitude}`}>Lat: {coord.latitude}, Long: {coord.longitude}</option>
              ))}
            </select>
          </div> 
          <div id="date-range">
            <form>
              {/* <div>
                <label for="start">Start Date: </label>
                <input type="date" name="start" min="2015-01-01" max="2019-12-31" value="2019-01-01" />
              </div>
              <div>
                <label for="start">End Date: </label>
                <input type="date" name="start" min="2015-01-01" max="2019-12-31" value="2019-12-31"/>
              </div> */}
              <button className="submit-button" type="button" id="submit-linechart">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SolarGraph;
