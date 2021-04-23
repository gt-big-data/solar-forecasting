import mysql.connector
import key
import json
import flask
import datetime


config = {
    "user": key.username,
    "password": key.password,
    "host": key.ip,
    "database": key.db,
}


def connect_get(query):
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor(buffered=True)
    cursor.execute(query)
    if cursor.rowcount == 0:
        return "No results found"
    return cursor


def get_all_data(county_name, start, end):
    query_string = (
        'SELECT GHI_DATA.*, COUNTIES.name FROM GHI_DATA INNER JOIN COUNTIES ON GHI_DATA.county_id=COUNTIES.county_id WHERE COUNTIES.name like "%'
        + county_name
        + '%"'
    )
    if start is not None:
        query_string += " AND GHI_DATA.time_stamp >= '" + start + "'"
    if end is not None:
        query_string += "AND GHI_DATA.time_stamp <=  '" + end + "'"
    cursor = connect_get(query_string)
    list = []
    list2 = []
    for row in cursor:
        list.append(row)
    for r in range(0, len(list)):
        list2.append(
            {
                "county_id": list[r][0],
                "location_id": list[r][1],
                "latitude": float(list[r][2]),
                "longitude": float(list[r][3]),
                "time_zone": float(list[r][4]),
                "elevation": float(list[r][5]),
                "local_time_zone": float(list[r][6]),
                "time_stamp": list[r][7].strftime("%Y/%m/%d"),
                "DHI": list[r][8],
                "DNI": list[r][9],
                "GHI": list[r][10],
                "clearsky_DHI": list[r][11],
                "clearsky_DNI": list[r][12],
                "clearsky_GHI": list[r][13],
                "cloud_type": list[r][14],
                "dew_point": float(list[r][15]),
                "solar_zenith_angle": float(list[r][16]),
                "fill_flag": float(list[r][17]),
                "surface_albedo": float(list[r][18]),
                "wind_speed": float(list[r][19]),
                "precipitable_water": float(list[r][20]),
                "wind_direction": float(list[r][21]),
                "relative_humidity": float(list[r][22]),
                "temperature": float(list[r][23]),
                "pressure": float(list[r][24]),
                "numeric_id": float(list[r][25]),
                "county_name": (list[r][26][:-1]),
            }
        )
    return json.dump(list2)


def get_ghi(county_name, start, end):
    query_string = (
        'SELECT GHI_DATA.*, COUNTIES.name FROM GHI_DATA INNER JOIN COUNTIES ON GHI_DATA.county_id=COUNTIES.county_id WHERE COUNTIES.name like "%'
        + county_name
        + '%"'
    )
    if start is not None:
        query_string += " AND GHI_DATA.time_stamp >= '" + start + "'"
    if end is not None:
        query_string += "AND GHI_DATA.time_stamp <=  '" + end + "'"
    cursor = connect_get(query_string)

    list = []
    list2 = []
    for row in cursor:
        list.append(row)
    for r in range(0, len(list)):
        list2.append(
            {
                "county_id": list[r][0],
                "location_id": list[r][1],
                "latitude": float(list[r][2]),
                "longitude": float(list[r][3]),
                "time_zone": float(list[r][4]),
                "elevation": float(list[r][5]),
                "local_time_zone": float(list[r][6]),
                "time_stamp": list[r][7].strftime("%Y/%m/%d"),
                "GHI": list[r][8],
                "county_name": (list[r][9][:-1]),
            }
        )
    return json.dump(list2)

def get_predicted_ghi(county_name, start=None, end=None):
        query_string = (
        'SELECT PREDICTED_GHI_DATA.*, COUNTIES.name FROM PREDICTED_GHI_DATA INNER JOIN COUNTIES ON PREDICTED_GHI_DATA.county_id=COUNTIES.county_id WHERE COUNTIES.name like "%'
        + county_name
        + '%"'
    )
    if start is not None:
        query_string += " AND PREDICTED_GHI_DATA.time_stamp >= '" + start + "'"
    if end is not None:
        query_string += "AND PREDICTED_GHI_DATA.time_stamp <=  '" + end + "'"
    cursor = connect_get(query_string)

    list = []
    list2 = []
    for row in cursor:
        list.append(row)
    for r in range(0, len(list)):
        list2.append(
            {
                "county_id": list[r][0],
                "latitude": float(list[r][1]),
                "longitude": float(list[r][2]),
                "time_stamp": list[r][3].strftime("%Y/%m/%d"),
                "GHI": list[r][4],
                "Predicted GHI": list[r][5],
                "county_name": (list[r][6][:-1]),
            }
        )
    return json.dump(list2)

def get_all_counties():
    query_string = 'SELECT DISTINCT COUNTIES.name, GHI_DATA.latitude, GHI_DATA.longitude FROM GHI_DATA INNER JOIN COUNTIES ON GHI_DATA.county_id=COUNTIES.county_id'
    cursor = connect_get(query_string)
    l = {}
    for r in cursor:
        county_name = r[0][:-1]
        if county_name not in l.keys():
            l[county_name] = []
        l[county_name].append({'latitude':float(r[1]), 'longitude':float(r[2])})
    return l

#get avg noon data for a specified county
def get_avg_ghi(county_name):
    query_string = (
        'SELECT latitude, longitude, AVG(GHI_DATA.GHI), COUNTIES.name FROM GHI_DATA INNER JOIN COUNTIES ON GHI_DATA.county_id=COUNTIES.county_id WHERE COUNTIES.name like "%'
        + county_name
        + '%"' + " AND TIME(GHI_DATA.time_stamp) = \"12:00:00\" GROUP BY latitude, longitude, COUNTIES.name"   
    )
    cursor = connect_get(query_string)
    list = []
    list2 = []
    for row in cursor:
        list.append(row)
    for r in range(0, len(list)):
        list2.append(
            {
                "county_name": str((list[r][3][:-1])),
                "latitude": float(list[r][0]),
                "longitude": float(list[r][1]),
                "Average Noon GHI": float(list[r][2]),
                
            }
        )
    return json.dumps(list2)

def get_all_data_by_time(time_stamp):
    query_string = "SELECT DISTINCT COUNTIES.name, GHI_DATA.latitude, GHI_DATA.longitude, GHI_DATA.ghi, GHI_DATA.time_stamp FROM GHI_DATA INNER JOIN COUNTIES ON GHI_DATA.county_id=COUNTIES.county_id WHERE GHI_DATA.time_stamp = " + time_stamp
    cursor = connect_get(query_string)
    l = {}
    for r in cursor:
        county_name = r[0][:-1]
        if county_name not in l.keys():
            l[county_name] = []
        l[county_name].append({'latitude':float(r[1]), 'longitude':float(r[2]), 'ghi':float(r[3])})
    return l

def get_all_date_by_location(lat, long):
    query_string = "SELECT DISTINCT COUNTIES.name, GHI_DATA.ghi, GHI_DATA.time_stamp FROM GHI_DATA INNER JOIN COUNTIES ON GHI_DATA.county_id=COUNTIES.county_id WHERE GHI_DATA.latitude = '" + lat + "' AND GHI_DATA.longitude = '" + long + "'"
    cursor = connect_get(query_string)
    string = ""
    for r in cursor:
        string += str(r[2].month) + "," + str(r[2].day) + "," +str(r[2].hour) + "," +str(r[2].minute) + ","+ str(r[1]) + "\n"
    return string
