#go into CountiesGHI Folder
#Go into each county folder
#go into each file and grab the 

#For each file read Latitude, Longitude, elevation, time stamp, GHI
#Attach county folder name, and then go into each file and grab latitude, longitude, elevation
#Read Year, Month, Day, Hour, Minute column and use that to make a time stamp
#Read GHI value
#store this dataframe into csv


#read into a dataframe CountiesTable.csv now we have id corresponding to name


import os
import pandas as pd
from pandas import DataFrame
import numpy as np
#read counties and the county ID that is in csv and DB
rootdir = './CountiesGHI'

counties = pd.read_csv(r'CountiesTable.csv', header=None, usecols=[0,1], names=["ID", "County"]) 
counties.reset_index(drop=True, inplace=True)
counties["County"] = counties["County"].str.strip()




i = 0
for subdir, dirs, files in os.walk(rootdir):
    for file in files:

        path = os.path.join(subdir, file) 
        if(".DS_Store" in path):
            continue
        print(path)        
        CountyName = os.path.basename(os.path.dirname(path))
        
        CountyID = pd.DataFrame(counties.loc[counties['County']==CountyName]["ID"]).reset_index(drop=True).astype({'ID':'int64'})
        
        #Grab constants: latitude, longitude, time zone, elevation, local time zone
        constants= pd.read_csv(path, usecols=['Location ID', 'Latitude', 'Longitude', 'Time Zone', 'Elevation', 'Local Time Zone'], nrows = 1, dtype={'Location ID': np.int64, 'Latitude' : np.float64, 'Longitude': np.float64,'Time Zone':np.int64, 'Elevation': np.int64, 'Local Time Zone': np.int64})
        #grab all the cols needed for datetime
        #skiprows = 2 is because if you look in Excel we need to skip the first two rows and then look for the
        #appropriate columns for date time, GHI, etc. because all of these columns start after the second row.
        DateTime= pd.to_datetime(pd.read_csv(path, skiprows=2, usecols=['Year', 'Month', 'Day', 'Hour', 'Minute']))
        #repeat this for DNI, DHI, Cloud type, etc. Make sure to double check the datatype.
        DHI = pd.read_csv(path, skiprows=2, usecols=['DHI'], dtype={'DHI':np.int64})
        DNI = pd.read_csv(path, skiprows=2, usecols=['DNI'], dtype={'DNI':np.int64})
        GHI = pd.read_csv(path, skiprows=2, usecols=['GHI'], dtype={'GHI':np.int64})
        clearsky_DHI = pd.read_csv(path, skiprows=2, usecols=['Clearsky DHI'], dtype={'Clearksy DHI':np.int64})
        clearsky_DNI = pd.read_csv(path, skiprows=2, usecols=['Clearsky DNI'], dtype={'Clearksy DNI':np.int64})
        clearsky_GHI = pd.read_csv(path, skiprows=2, usecols=['Clearsky GHI'], dtype={'Clearksy GHI':np.int64})
        cloud_type = pd.read_csv(path, skiprows=2, usecols=['Cloud Type'], dtype={'Cloud Type':np.int64})
        dew_point = pd.read_csv(path, skiprows=2, usecols=['Dew Point'], dtype={'Dew Point':np.float64})
        solar_zenith_angle = pd.read_csv(path, skiprows=2, usecols=['Solar Zenith Angle'], dtype={'Solar Zenith Angle':np.float64})
        fill_flag = pd.read_csv(path, skiprows=2, usecols=['Fill Flag'], dtype={'Fill Flag':np.int64})
        surface_albedo = pd.read_csv(path, skiprows=2, usecols=['Surface Albedo'], dtype={'Surface Albedo':np.float64})
        wind_speed = pd.read_csv(path, skiprows=2, usecols=['Wind Speed'], dtype={'Wind Speed':np.float64})
        precipitable_water = pd.read_csv(path, skiprows=2, usecols=['Precipitable Water'], dtype={'Precipitable Water':np.float64})
        wind_direction = pd.read_csv(path, skiprows=2, usecols=['Wind Direction'], dtype={'Wind Direction':np.int64})
        relative_humidity = pd.read_csv(path, skiprows=2, usecols=['Relative Humidity'], dtype={'Relative Humidity':np.float64})
        temperature = pd.read_csv(path, skiprows=2, usecols=['Temperature'], dtype={'Temperature':np.float64})
        pressure = pd.read_csv(path, skiprows=2, usecols=['Pressure'], dtype={'Pressure':np.int64})
        
        
        #concat all of the columns together        
        TotalData = pd.concat([CountyID, constants, DateTime, DHI, DNI, GHI, clearsky_DHI, clearsky_DNI, clearsky_GHI, cloud_type, dew_point, solar_zenith_angle, fill_flag, surface_albedo, wind_speed, precipitable_water, wind_direction, relative_humidity, temperature, pressure], axis = 1)

        #Some rows (constants, ID's need to get repeated for every row for that entire col because IDs and lat/long are only
        #present once per excel file but need to be present in every entry we insert into DB
        TotalData["ID"] = TotalData["ID"].iloc[0]
        TotalData["Location ID"] = TotalData["Location ID"].iloc[0]
        TotalData["Latitude"] = TotalData["Latitude"].iloc[0]
        TotalData["Longitude"] = TotalData["Longitude"].iloc[0]
        TotalData["Time Zone"] = TotalData["Time Zone"].iloc[0]
        TotalData["Elevation"] = TotalData["Elevation"].iloc[0]
        TotalData["Local Time Zone"] = TotalData["Local Time Zone"].iloc[0]

        #increment loop
        i += 1

        #place in CSV
        TotalData.to_csv("./TableData/" + CountyName + str(i)+".csv", header=None, index=False)
        
    
        
    
