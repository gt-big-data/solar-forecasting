import mysql.connector
import key
import json
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
        'SELECT GHI_DATA.*, COUNTIES.county_name FROM GHI_DATA INNER JOIN COUNTIES ON GHI_DATA.county_id=COUNTIES.county_id WHERE COUNTIES.county_name like "%'
        + county_name
        + '%"'
    )
    if start is not None:
        query_string += " AND GHI_DATA.time_stamp >= " + start
    if end is not None:
        query_string += "AND GHI_DATA.time_stamp <= " + start
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
    return list2


def get_ghi(county_name, start, end):
    query_string = (
        'SELECT GHI_DATA.*, COUNTIES.county_name FROM GHI_DATA INNER JOIN COUNTIES ON GHI_DATA.county_id=COUNTIES.county_id WHERE COUNTIES.county_name like "%'
        + county_name
        + '%"'
    )
    if start is not None:
        start = datetime.strptime(start, "%m-%d-%Y")
        query_string += " AND GHI_DATA.time_stamp >= " + start
    if end is not None:
        end = datetime.strptime(end, '%m-%d-%Y')
        query_string += "AND GHI_DATA.time_stamp <= " + start
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
    return list2
