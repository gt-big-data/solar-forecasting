import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCalendar, faBullseye } from '@fortawesome/free-solid-svg-icons';
import cloud from '../images/cloud.svg';
import solarImage from '../images/solar.jpg';
import './SolarTitle.css';

const Card = ({ icon, subheading, content }) => (
  <div className="home-card">
    <h6>
      <FontAwesomeIcon icon={icon} />
      {' '}
      {subheading}
    </h6>
    <hr className="horizontal-line"/>
    <p>{content}</p>
  </div>
);

const GraphCard = ({subheading, content, image}) => (
  <div>
    <h5>{subheading}</h5>
    <p>{content}</p>
    <img className="graph-image" src={image} alt="solar panel"/>
  </div>
)

function SolarTitle() {
  return (
    <div className="home-page">
      <img className="home-image" src={cloud} alt="solar panel"></img>
      <div className="title-blurb">
        <h3>Increased solar power usage means more challenges</h3>
        <p>
          Incoming solar energy tends to fluctuate a lot during the day due to weather conditions.
          This makes it harder for operators to balance the input and output of electricity in an
          electric grid. If there is an imbalance, major issues like a blackout could occur.
        </p>
        <Link to="/solarmap">
          <button type="button">View Solar Map</button>
        </Link>
      </div>
      <div className="predictions-container">
        <h3 className="subheading">Solar Predictions</h3>
        <div className="grid-container">
          <Card
            icon={faCheck}
            subheading="Easier and simpler"
            content="Accurate predictions of solar energy can make this task easier and could also increase the
              amount of solar energy used every day."
          />
          <Card
            icon={faCalendar}
            subheading="Schedule electricity production"
            content="Since the operators know which times incoming solar energy will be high or low, they can
              schedule electricity production from power plants accordingly without having to worry about imbalances
              in the electric grid."
          />
          <Card
            icon={faBullseye}
            subheading="Optimal placement"
            content="With the ability to make these predictions in numerous locations, one can also determine the
              optimal placements for new solar farms. "
          />
        </div>
      </div>
      <h3 className="subheading" style={{textAlign: 'center'}}>Solar Forecasting</h3>
      <hr className=""/>
      <div className="grid-container forecasting-container">
        <GraphCard
          subheading="Solar Map"
          content="hello, this is a description of the solar map"
          image={solarImage}
        />
        <GraphCard
          subheading="Solar Chart"
          content="hello, this is a description of the solar chart"
          image={solarImage}
        />
      </div>
    </div>
  );
}
export default SolarTitle;
