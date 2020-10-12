import React, {Component} from 'react';
import solar from '../images/solar.jpg';
class SolarTitle extends Component {
	render() {
		return(
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
					Solar Forecasting
				</title>
				<img style={
						{
						  	border: '1px solid #bbb',
						  	display: 'block',
							width: '35%',
						  	height: '30%',
						    marginLeft: 'auto',
						 	marginRight: 'auto',

						}
					} 
					src={solar} alt=""/>
				<button 
					type="button" 
					class="btn btn-primary" 
					style={
						{
							display: 'block',
							fontWeight : 'bold',
							fontSize: 50,	
							marginLeft: 'auto',
						  	marginRight: 'auto',
						  	width: "25%",
						  	marginTop: "5%",
						}
					}> 
					Go
				 </button>
			</div>
		);
	}
}
export default SolarTitle;