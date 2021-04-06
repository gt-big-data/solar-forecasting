import React, { Component } from 'react';
import * as d3 from 'd3';
import './dataviz-style.css';

class SolarGraph extends Component {
  componentDidMount() {
    const { dataList } = this.props;

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
      .attr('preserveAspectRatio', 'xMidYMid meet')
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
        .text('Prediction');

      gLegend.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${15}, ${20})`)
        .text('Actual');

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
    });
  }

  render() {
    return (
      <>
        <svg id="solar-graph" />
        <div id="button-group" />
      </>
    );
  }
}

export default SolarGraph;
