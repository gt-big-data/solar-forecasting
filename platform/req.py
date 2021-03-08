import pandas as pd
import numpy as np

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


def return_url(year, attributes, location):
    lat, lon = locations[location]
    url = ("https://developer.nrel.gov/api/solar/nsrdb_psm3_download.csv?wkt="
           "POINT({lon}%20{lat})"
           "&names={year}"
           "&leap_day={leap}"
           "&interval={interval}"
           "&utc={utc}"
           "&full_name={name}"
           "&email={email}"
           "&affiliation={affiliation}"
           "&mailing_list={mailing_list}"
           "&reason={reason}"
           "&api_key={api_key}"
           "&attributes={attr}").format(
        year=year,
        lat=lat, lon=lon,
        leap=leap_year,
        interval=interval,
        utc=utc,
        name=your_name,
        email=your_email,
        mailing_list=mailing_list,
        affiliation=your_affiliation,
        reason=reason_for_use,
        api_key=api_key,
        attr=attributes)
    return url