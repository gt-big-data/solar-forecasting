from flask import Flask
from flask import request, send_file, render_template
#json or geojason
import pandas as pd
import req
app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods = ['GET'])
def main_page():
    return render_template('input.html')
@app.route('/test', methods = ['POST'])
def test():
    return "Hello"
@app.route('/data/csv', methods=['GET'])
def csv_data():
    location = ([request.args.get('nwc',''), request.args.get('swc',''), request.args.get('nec',''), request.args.get('sec',''), request.args.get('five','')]);
    start_url = req.return_url(selected_year = request.args.get('year',''),selected_email = request.args.get('email',''), location = location)
    url = start_url.replace(" ","%20")
    return "200"

@app.route('/data/json', methods=['GET'])
def json_data():
    location = []
    location.append([request.args.get('bottom_right',''), request.args.get('bottom_left',''), request.args.get('top_right',''), request.args.get('top_left','')]);
    print(location)
    url = req.return_url(selected_year = request.args.get('year',''),selected_email = request.args.get('email',''), location = location)
    return "200"


@app.route('/add', methods = ['PUT'])
def add():
    csv_string = request.form["data"]
    #Add to database
    
    #Check if item is in database
    if(True):
        return "Success", 200
    else:
        return "Error", 400

app.run()