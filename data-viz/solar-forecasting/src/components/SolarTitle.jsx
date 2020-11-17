import React, {Component} from 'react';
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
							fontSize: 85,
							fontWeight : 'bold',
							textAlign: 'center',
							width: "100%",	
						}
					} 
					className="badge badge-primary">
					Solar Forecasting
				</title>
			</div>
		);
	}
}
export default SolarTitle;