import React, {Component} from 'react';
import solar from '../images/solar.jpg';
class SolarTitle extends Component {
	styles = {
		fontSize: 100,
		fontWeight : 'bold',
		textAlign: 'center',
		width: "100%",	
	}
	img = {
	  border: '1px solid #bbb',
	  display: 'block',
	  width: '35%',
	  height: '30%',
	  marginLeft: 'auto',
	  marginRight: 'auto',

	}
	buttonStyle = {
		display: 'block',
		fontWeight : 'bold',
		
		fontSize: 50,	
		marginLeft: 'auto',
	  	marginRight: 'auto',
	  	width: "25%",
	  	marginTop: "5%",
	}
	render() {
		return(
			<div>			
				<title 
					style = {
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
				<img style= {this.img} src= {solar} alt=""/>
				<button type="button" class="btn btn-primary" style={this.buttonStyle}> Go </button>
			</div>
		);
	}
}
export default SolarTitle;