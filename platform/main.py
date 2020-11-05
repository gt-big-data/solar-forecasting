from flask import Flask
app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods = ['GET'])
def hello_world():
    return 'Welcome to BDBI Platform!'

@app.route('/all', methods=['GET'])
def returnAll():
    #return all data that exists
    return {}     

app.run()