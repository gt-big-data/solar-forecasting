import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCalendar, faBullseye } from '@fortawesome/free-solid-svg-icons';
import solarpanelsImage from '../images/solarpanels.jpg';
import './SolarTitle.css';

const Card = ({ icon, subheading, content }) => (
  <div className="home-card">
    <h6>
      <FontAwesomeIcon icon={icon} />
      {' '}
      {subheading}
    </h6>
    <p>{content}</p>
  </div>
);

function SolarTitle() {
  return (
    <div className="content">
      <img src={solarpanelsImage} alt="solar panel" />
      <div className="title-blurb">
        <h3>Increased solar power usage means more challenges</h3>
        <p>
          Incoming solar energy tends to fluctuate a lot during the day due to weather conditions.
          This makes it harder for operators to balance the input and output of electricity in an
          electric grid. If there is an imbalance, major issues like a blackout could occur.
        </p>
      </div>
      <h3>Solar Predictions</h3>
      <div className="flex-container">
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
      {/* Just to add some space quickly */}
      <h3>Solar Predictions</h3>
      <h3>Solar Predictions</h3>
      <div className="title-blurb" margin-top="50px">
        <h3>Under construction!</h3>
        <p>
          More content to be added here. Under construction.
        </p>
      </div>
    </div>
  );
}
export default SolarTitle;
