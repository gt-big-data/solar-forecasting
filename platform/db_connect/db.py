import mysql.connector
import key
config = {
    'user': key.username,
    'password': key.password,
    'host': key.ip,
    'database' : key.db
}
def connect_get(county_name): 
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor(buffered=True)
    cursor.execute('SELECT GHI_DATA.*, COUNTIES.name FROM GHI_DATA INNER JOIN COUNTIES ON GHI_DATA.county_id=COUNTIES.county_id WHERE COUNTIES.name =\'' + county_name + '\'')
    if cursor.rowcount == 0:
        return 'No results found'
    return cursor



