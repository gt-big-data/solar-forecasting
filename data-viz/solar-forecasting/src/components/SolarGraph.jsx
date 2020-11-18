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
				{/* <Link to='/'>
					<button 
						type="button" 
						class="btn btn-primary" 
						style={
							{
								display: 'block',
								fontWeight : 'bold',
								fontSize: 20,	
								backgroundColor: "orange",
								marginLeft: 'auto',
							  	marginRight: 'auto',
							  	width: "10%",
							  	marginTop: "40%",
							}
						}> 
						Back
				 	</button>
			 	</Link> */}
			</div>
		);
	}
}
export default SolarGraph;