
api_key = 'sAPoz5XEVqaCq30LmasEWKk0ZV81gi4Vlf4cwONW'
leap_year = 'false'
interval = '30'
utc = 'false'
your_name = 'Udit+Subramanya'
reason_for_use = 'solar+forecasting'
your_affiliation = 'georgia+tech'
your_email = 'usubramanya3@gatech.edu'
mailing_list = 'false'

locations = {}
locations['Butler Solar Farm'] = [32.55, -84.27]
locations['Simon Solar Farm'] = [33.677, -83.676]
locations['Meriweather Solar Farm'] = [32.965, -84.543]
locations['Dublin Solar Farm'] = [32.52, -82.944]


def return_url(selected_year, selected_email, location):
    url = "https://developer.nrel.gov/api/nsrdb/v2/solar/psm3-tmy-download.json?names=tmy-{year}&full_name=Pranav%20Khorana&email={email}&affiliation=Georgia%20Tech&api_key=MI2om3iIBdxXTE2NNVaXlErMTkZfQfvhzcE2v5v8&wkt=POLYGON(({top_left},{top_right},{bottom_left},{bottom_right},{five}))&attributes=ghi".format(year=selected_year, email = selected_email, top_left = location[0], top_right = location[1], bottom_right = location[2], bottom_left = location[3], five= location[4] )
    return url
