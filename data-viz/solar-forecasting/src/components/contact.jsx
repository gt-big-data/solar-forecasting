import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import solar from '../images/solar.jpg';

export default class Contact extends Component {

  render() {
    return (
      <div className = "section">
        <div className ="container">
          <div className = "row">
            <div className="col-md-12">
              <div className="section-title">
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
                Contact Us
              </title>
                <h2 style = 
                {
                  {
                    
                    textAlign: 'center',
                    marginTop: "10%",
                  }
                  
                }
                  >We'd love to know how we can improve!</h2>
                
                <form id = "contact-form">
                  <div className = "form-group">
                  <div className = "row">
                  <div className = "col-md-6">
                    <input placeholder = "Name" id = "name" type = "text" className="form-control" >            
                    </input>
              
                  </div>
                  <div className = "col-md-6">
                    <input placeholder = "Email" id = "email" type = "text" className="form-control"  >            
                    </input>
              
                  </div>
                  </div>
                  </div>
                  <div className = "form-group">
                    <input placeholder = "Subject" id = "subject" type = "text" className="form-control"  >            
                    </input>
                  </div>
                  <div className = "form-group">
                    <input placeholder = "Message" id = "message" type = "text" className="form-control" rows="1"  >            
                    </input>
                  </div>
                  <button 
						type="button" 
						class="btn btn-primary" 
						style={
							{
								display: 'block',
								fontWeight : 'bold',
                fontSize: 25,
                backgroundColor: "orange",	
								marginLeft: 'auto',
							  	marginRight: 'auto',
							  	width: "10%",
							  	
							}
						}> 
						Submit
				 	</button>
                </form>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}