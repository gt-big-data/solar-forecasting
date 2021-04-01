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
        constants= pd.read_csv(path, usecols=['Latitude', 'Longitude', 'Time Zone', 'Elevation', 'Local Time Zone'], nrows = 1, dtype={'Latitude' : np.float64, 'Longitude': np.float64,'Time Zone':np.int64, 'Elevation': np.int64, 'Local Time Zone': np.int64})
        #grab all the cols needed for datetime
        #skiprows = 2 is because if you look in Excel we need to skip the first two rows and then look for the
        #appropriate columns for date time, GHI, etc. because all of these columns start after the second row.
        DateTime= pd.to_datetime(pd.read_csv(path, skiprows=2, usecols=['Year', 'Month', 'Day', 'Hour', 'Minute']))
        #repeat this for DNI, DHI, Cloud type, etc. Make sure to double check the datatype.
        GHI = pd.read_csv(path, skiprows=2, usecols=['GHI'], dtype={'GHI':np.int64})
        
        #these are for repeating the rows in the excel sheet for the constants
        #CountyID = pd.concat([CountyID]*GHI.shape[0])
        #LatLongEle = pd.concat([LatLongEle]* GHI.shape[0])#add this back in 
        
        
        TotalData = pd.concat([CountyID, constants, DateTime, GHI], axis = 1)
        i += 1
        TotalData.to_csv("./TableData/" + CountyName + str(i)+".csv", header=None, index=False)
        
    
        
    
