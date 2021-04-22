from flask import Flask
from flask import request, send_file, render_template
from flask_cors import CORS

#json or geojason
import req

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
import db_connect.db as db


@app.route("/", methods=["GET"])
def main_page():
    return render_template("input.html")


# Returns all available data at a certain county and the date filters are optional
# Call by 127.0.0.1:5000/data/all/countyname/YYYY:DD:MM/YYYY:DD:MM
@app.route("/data/all/<county>", methods=["GET"])
@app.route("/data/all/<county>/<start>/<end>", methods=["GET"])
def data_all(county, start=None, end=None):
    cursor = db.get_all_data(county, start, end)
    return str(cursor)

# Returns ghi data at a certain county and the date filters are optional
# Call by 127.0.0.1:5000/data/ghi/countyname/YYYY:DD:MM/YYYY:DD:MM
@app.route("/data/ghi/<county>", methods=["GET"])
@app.route("/data/all/<county>/<start>/<end>", methods=["GET"])
def data_ghi(county, start=None, end=None):
    cursor = db.get_ghi(county, start, end)
    return str(cursor)

# Returns ghi data at a certain county for every day at noon
# Call by 127.0.0.1:5000/data/avg_noon_ghi/countyname/
@app.route("/data/avg_noon_ghi/<county>", methods=["GET"])
def get_avg_noon_data(county):
    cursor = db.get_avg_ghi(county)
    return str(cursor)

# Return the coordinate points found in all counties
# Call by 127.0.0.1:5000/counties/all
@app.route("/counties/all", methods=["GET"])
def counties():
    cursor = db.get_all_counties()
    return str(cursor)
# Returns all data for all locations at a certain time
# Call by 127.0.0.1:5000/data/time/YYY:DD:MM/HH:MM:00
@app.route("/data/time/<date>/<time>", methods=["GET"])
def data_by_time(date, time):
    time_stamp = "'" + date + " " + time + "'"
    cursor = db.get_all_data_by_time(time_stamp)
    return cursor

# Returns all data for a certain data location point
# Call by 127.0.0.1:5000/lat/long
@app.route("/data/location/<lat>/<long>", methods=["GET", "POST"])
def data_by_location(lat, long):
    cursor = db.get_all_date_by_location(lat, long)
    return cursor


@app.route("/test", methods=["GET", "POST"])
def test():
    return "Online"


#############################################Deprecated########################################################################################
@app.route("/data/csv", methods=["GET"])
def csv_data():
    location = [
        request.args.get("nwc", ""),
        request.args.get("swc", ""),
        request.args.get("nec", ""),
        request.args.get("sec", ""),
        request.args.get("five", ""),
    ]
    start_url = req.return_url(
        selected_year=request.args.get("year", ""),
        selected_email=request.args.get("email", ""),
        location=location,
    )
    url = start_url.replace(" ", "%20")
    return "200"


@app.route("/data/json", methods=["GET"])
def json_data():
    location = []
    location.append(
        [
            request.args.get("bottom_right", ""),
            request.args.get("bottom_left", ""),
            request.args.get("top_right", ""),
            request.args.get("top_left", ""),
        ]
    )
    print(location)
    url = req.return_url(
        selected_year=request.args.get("year", ""),
        selected_email=request.args.get("email", ""),
        location=location,
    )
    return "200"


@app.route("/add", methods=["PUT"])
def add():
    csv_string = request.form["data"]
    # Add to database

    # Check if item is in database
    if True:
        return "Success", 200
    else:
        return "Error", 400


############################################################################################################################################

app.run()