import React from 'react';

function Contact() {
  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-title">
              <h2 style={{ textAlign: 'center' }}>Contact Us</h2>
              <h2 style={
                  {

                    textAlign: 'center',
                    marginTop: '10%',
                  }

                }
              >
                We&#39;d love to know how we can improve!
              </h2>
              <form id="contact-form">
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-6">
                      <input placeholder="Name" id="name" type="text" className="form-control" />

                    </div>
                    <div className="col-md-6">
                      <input placeholder="Email" id="email" type="text" className="form-control" />

                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <input placeholder="Subject" id="subject" type="text" className="form-control" />
                </div>
                <div className="form-group">
                  <input placeholder="Message" id="message" type="text" className="form-control" rows="1" />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    display: 'block',
                    fontWeight: 'bold',
                    fontSize: 25,
                    backgroundColor: 'orange',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '10%',
                  }}
                >
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
export default Contact;
