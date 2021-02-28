import React, {Component} from 'react';

import {Link} from 'react-router-dom';
class SolarGraph extends Component {
	render() {
		return (
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
					Solar Graph and Map
				</title>
				
			</div>
		);
	}
}
export default SolarGraph;