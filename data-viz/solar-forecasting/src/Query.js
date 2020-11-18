// Declare all variables as strings. Spaces must be replaced with '+', i.e., change 'John Smith' to 'John+Smith'.
    //Define the lat, long of the location and the year
    var lat = '33.2164';
    var lon = '-97.1292';
    var year = '2010';
    
    //Set leap year to true or false. True will return leap day data if present, false will not.
    var leap_year = 'false';

    //Set time interval in minutes, i.e., '30' is half hour intervals. Valid intervals are 30 & 60.
    var interval = '30';

    //Specify Coordinated Universal Time (UTC), 'true' will use UTC, 'false' will use the local time zone of the data.
    var utc = 'false';

//Declare URL String
let url = 'http://developer.nrel.gov/api/solar/nsrdb_psm3_download.csv?wkt=POINT ({' +
lon + '}%20{' + lat + '})&names={' + year + '}&leap_day={' + leap_year + '}&interval={' + interval +
'}&utc={' + utc + '}';
