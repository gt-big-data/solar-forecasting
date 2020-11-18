import React, {Component} from 'react';
import styles from './Paragraph.module.css';
import solar from '../images/solar.jpg';
import solarMap from './SolarMap';
import {Link} from 'react-router-dom';

class SolarTitle extends Component {
	render() {
		return(
			<div>			
				<title 
					style={
						{
							fontSize: 30,
							fontWeight : 'bold',
							textAlign: 'center',
							width: "100%",
							backgroundColor: "orange",	
						}
					} 
					className="badge badge-primary">
					Solar Forecasting
				</title>
				<h3>
					Problem
				</h3>
				<text className={styles.Paragraph}>
					As the use of solar power increases, so does the challenge for electricity grid operators. Incoming solar energy tends to fluctuate a lot during the day due to weather conditions, which makes it harder for operators to balance the input and output of electricity in an electric grid. If there is an imbalance, a blackout or other major issues could occur. Accurate predictions of solar energy can make this task easier and could also increase the amount of solar energy used every day. Since the operators know which times incoming solar energy will be high or low, they can schedule electricity production from power plants accordingly without having to worry about imbalances in the electric grid. With the ability to make these predictions in numerous locations, one can also determine the optimal placements for new solar farms. 
				</text>
			</div>
		);
	}
}
export default SolarTitle;