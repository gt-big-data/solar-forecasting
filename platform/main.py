from flask import Flask
from flask import request, send_file
#json or geojason
import pandas as pd
import req
app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods = ['GET'])
def hello_world():
    return request.args.get('key','')
  
@app.route('/data/csv', methods=['GET'])
def csv_data():
    url = req.return_url(year = request.args.get('year',''),attributes = request.args.get('attributes',''), location = request.args.get('location',''))
    df = pd.read_csv(url, skiprows=2)
    return df.to_csv(), 200

@app.route('/data/json', methods=['GET'])
def json_data():
    url = req.return_url(year = request.args.get('year',''),attributes = request.args.get('attributes',''), location = request.args.get('location',''))
    df = pd.read_csv(url, skiprows=2)
    return df.to_json(), 200

@app.route('/add', methods = ['PUT'])
def add():
    csv_string = request.form["data"]
    #Add to database
    
    #Check if item is in database
    if(true):
        return "Success", 200
    else:
        return "Error", 400

app.run()