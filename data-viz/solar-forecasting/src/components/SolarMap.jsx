import React, {Component} from 'react';
import {Link} from 'react-router-dom';
class SolarMap extends Component {
	render() {
		return (
			<div> 
				<title 
					style={
						{
							fontSize: 100,
							fontWeight : 'bold',
							textAlign: 'center',
							width: "100%",	
						}
					} 
					className="badge badge-primary">
					Solar Map
				</title>
				<Link to='/'>
					<button 
						type="button" 
						class="btn btn-primary" 
						style={
							{
								display: 'block',
								fontWeight : 'bold',
								fontSize: 25,	
								marginLeft: 'auto',
							  	marginRight: 'auto',
							  	width: "5%",
							  	marginTop: "35%",
							}
						}> 
						Back
				 	</button>
			 	</Link>
			</div>
		);
	}
}
export default SolarMap;