import React, { Component } from 'react';
import * as d3 from 'd3';
import './SolarGraphPage.css';

const countyList = [
  "Appling",
  "Atkinson",
  "Bacon",
  "Baker",
  "Baldwin",
  "Banks",
  "Barrow",
  "Bartow",
  "Ben Hill",
  "Berrien",
  "Bibb",
  "Bleckley",
  "Brantley",
  "Brooks",
  "Bryan",
  "Bulloch",
  "Burke",
  "Butts",
  "Calhoun",
  "Camden",
  "Candler",
  "Carroll",
  "Catoosa",
  "Charlton",
  "Chatham",
  "Chattahoochee",
  "Chattooga",
  "Cherokee",
  "Clarke",
  "Clay",
  "Clayton",
  "Clinch",
  "Cobb",
  "Coffee",
  "Colquitt",
  "Columbia",
  "Cook",
  "Coweta",
  "Crawford",
  "Crisp",
  "Dade",
  "Dawson",
  "DeKalb",
  "Decatur",
  "Dodge",
  "Dooly",
  "Dougherty",
  "Douglas",
  "Early",
  "Echols",
  "Effingham",
  "Elbert",
  "Emanuel",
  "Evans",
  "Fannin",
  "Fayette",
  "Floyd",
  "Forsyth",
  "Franklin",
  "Fulton",
  "Gilmer",
  "Glascock",
  "Glynn",
  "Gordon",
  "Grady",
  "Greene",
  "Gwinnett",
  "Habersham",
  "Hall",
  "Hancock",
  "Haralson",
  "Harris",
  "Hart",
  "Heard",
  "Henry",
  "Houston",
  "Irwin",
  "Jackson",
  "Jasper",
  "Jeff Davis",
  "Jefferson",
  "Jenkins",
  "Johnson",
  "Jones",
  "Lamar",
  "Lanier",
  "Laurens",
  "Lee",
  "Liberty",
  "Lincoln",
  "Long",
  "Lowndes",
  "Lumpkin",
  "Macon",
  "Madison",
  "Marion",
  "McDuffie",
  "McIntosh",
  "Meriwether",
  "Miller",
  "Mitchell",
  "Monroe",
  "Montgomery",
  "Morgan",
  "Murray",
  "Muscogee",
  "Newton",
  "Oconee",
  "Oglethorpe",
  "Paulding",
  "Peach",
  "Pickens",
  "Pierce",
  "Pike",
  "Polk",
  "Pulaski",
  "Putnam",
  "Quitman",
  "Rabun",
  "Randolph",
  "Richmond",
  "Rockdale",
  "Schley",
  "Screven",
  "Seminole",
  "Spalding",
  "Stephens",
  "Stewart",
  "Sumter",
  "Talbot",
  "Taliaferro",
  "Tattnall",
  "Taylor",
  "Telfair",
  "Terrell",
  "Thomas",
  "Tift",
  "Toombs",
  "Towns",
  "Treutlen",
  "Troup",
  "Turner",
  "Twiggs",
  "Union",
  "Upson",
  "Walker",
  "Walton",
  "Ware",
  "Warren",
  "Washington",
  "Wayne",
  "Webster",
  "Wheeler",
  "White",
  "Whitfield",
  "Wilcox",
  "Wilkes",
  "Wilkinson",
  "Worth"
];

class SolarGraph extends Component {
  componentDidMount() {
    const dataList = [
      '/data/Merriweather_2019_wPreds.csv',
      '/data/Butler_2019_wPreds.csv',
      '/data/Dublin_2019_wPreds.csv',
      '/data/Simon_2019_wPreds.csv',
    ];

    const rowConverter = (d) => ({
      date: new Date(+d.Year, (+d.Month - 1), +d.Day, +d.Hour, +d.Minute),
      GHI: parseFloat(d.GHI),
      Prediction: +d.Predictions,
    });
    // Specifications for svg element.
    const w = 1260;
    const h = 740;

    // margin properties
    const margin = {
      top: 60, right: 10, bottom: 70, left: 50,
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
      .classed('svg-content', true)
      .attr('class', 'lineviz');

    // ASYNCHRONOUS - Load CSV file (1st Day Jan 2019 Sample)
    Promise.all(dataList.map((filePath) => d3.csv(filePath, rowConverter))).then((data) => {
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
        .attr('class', 'graph-title')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${w / 2 - margin.left}, ${-margin.top / 2})`)
        .text('Solar Predictions');

      gParent.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${w / 2 - margin.left}, ${height + margin.bottom / 2})`)
        .text('Time');

      gParent.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${-margin.left}, ${height / 2})`)
        .text('GHI');

      const gLegend = gParent.append('g')
        .attr('transform', `translate(${width - 100}, ${0})`);

      gLegend.append('circle')
        .attr('cx', 0)
        .attr('cy', -6)
        .attr('r', 6)
        .attr('fill', 'red');

      gLegend.append('circle')
        .attr('cx', 0)
        .attr('cy', -6 + 20)
        .attr('r', 6)
        .attr('fill', 'steelblue');

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

        // Create line
        gParent.append('path')
          // Bind the data appropriately
          .datum(dataset)

          .attr('class', 'line') // for later CSS purposes to reformat line
          .attr('id', 'GHIDataLine')
          .attr('d', line); // refer to previous line generator defined.

        // Create line - same thing, but for prediction!
        gParent.append('path')
          // Bind the data appropriately
          .datum(dataset)
          .attr('class', 'line') // for later CSS purposes to reformat line
          .attr('id', 'GHIPredictionLine')
          .attr('d', analysisLine); // refer to previous line generator defined.

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

      //another thing that needs to be done - add the dropdown selections: list the specific tasks to be done:
      //Add County list dropdown - alright good to go.
      //Add dropdown that is based on the county list, and should have a list of lattitudes. - should be somewhat ok, just displaying them (options there in inspector)

      //we need to append county names here. we also are dependent on the locations that platform gives us, so right now, cannot give info on the second dropdown box.
      function buildDropdowns() {
        var countyDropdown = document.getElementById("county-selector");

        // Add options
        for (var i in countyList) {
            countyDropdown.append('<option value=' + countyList[i] + " County" + '>' + countyList[i] + " County" + '</option>');
        }




        // console.log(countyDropdown);
        // countyList.forEach(function (item, index) {
        //   var tempOption = document.createElement("OPTION"); //put a class here if needed, later for css stuff
        //   tempOption.value = item + " County";
        //   // tempOption.hidden = false;
        //   // tempOption.disabled = false;
        //   console.log(tempOption.value);

        //   console.log(countyDropdown.append(tempOption));
        // })
      }

      buildDropdowns();

      //the id for that div may not be needed (check the css file for something separate to manage the div if needed.)
    });
  }

  render() {
    // this.props.latitude
    // this.props.longitude
    return (
      <div className="solar-graph-page" >
        <div className="solar-text">
          <h1 className="solar-header">Analyzing Location Solar Data</h1>
          <p className = "solar-graph-explanation">You can use this tool to observe Global Horizontal Irradiance (GHI) data for any particular location. GHI measures the total solar radiation received on a theoretical horizontal surface.</p>
          <p>
            Scroll to zoom in or out and drag-click to shift the chart!
          </p>
        </div>
        <svg id="solar-graph" />
        <div id="button-group" />
        <div id="location-selector-linechart">
          <select className="dropdown" name="county-selector" id="county-selector">
            <option selected disabled hidden>Select a County</option>
          </select>
          <select className="dropdown" name="latlong-selector" id="latlong-selector">
            <option selected disabled hidden>Select a County Sublocation</option>
          </select>
        </div> 

        <div id="date-range">
          <form>
            <label for="start">Start Date:</label>
              <input type="date" name="start" min="2015-01-01" max="2019-12-31" value="2019-01-01" />
            <label for="start">End Date:</label>
              <input type="date" name="start" min="2015-01-01" max="2019-12-31" value="2019-12-31"/>
            <button className="solarfarmbutton" type="submit">Submit</button>
          </form>
        </div>

      </div>
    );
  }
}

export default SolarGraph;
