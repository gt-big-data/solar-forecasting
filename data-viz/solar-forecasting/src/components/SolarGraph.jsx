import React, {Component} from 'react';
import {Link} from 'react-router-dom';
class SolarGraph extends Component {
	render() {
		return (
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
					Solar Graph
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
							  	width: "10%",
							  	marginTop: "40%",
							}
						}> 
						Back
				 	</button>
			 	</Link>
			</div>
		);
	}
}
export default SolarGraph;