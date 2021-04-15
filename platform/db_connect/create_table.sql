SET FOREIGN_KEY_CHECKS = 0;
drop table if exists COUNTIES;
drop table if exists GHI_DATA;
SET FOREIGN_KEY_CHECKS = 1;

DROP TABLE IF EXISTS COUNTIES;
CREATE TABLE COUNTIES(
	county_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (county_id)
);


DROP TABLE if EXISTS GHI_DATA;
CREATE TABLE GHI_DATA(
	county_id INT NOT NULL,
	location_id INT NOT NULL,
	latitude decimal(10,7) NOT NULL,
	longitude decimal(10,7) NOT NULL,
	time_zone INT NOT NULL,
	elevation INT NOT NULL,
	local_time_zone INT NOT NULL,
	time_stamp date NOT NULL,
	DHI INT NOT NULL,
	DNI INT NOT NULL,
	GHI INT NOT NULL,
	clearksy_DHI INT NOT NULL,
	clearsky_DNI INT NOT NULL,
	clearksy_GHI INT NOT NULL,
	cloud_type INT NOT NULL,
	dew_point decimal(4,2) NOT NULL,
	solar_zenith_angle decimal(5,2) NOT NULL,
	fill_flag INT NOT NULL,
	surface_albedo decimal(4,2) NOT NULL,
	wind_speed decimal(3,2) NOT NULL,
	precipitable_water decimal(2,1) NOT NULL,
	wind_direction INT NOT NULL,
	relative_humidity decimal(5,2) NOT NULL,
	temperature decimal(4,1) NOT NULL,
	pressure INT NOT NULL,
	
	-- still need relative humidity, etc: https://gtvault.sharepoint.com/:w:/s/BigDataBigImpact/EZq5PWvwcLJNjR2QrchbaloBKiZQnO-VJAL2uG4ZT1cySQ?e=AgMevV 
	numeric_id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (numeric_ID),
	CONSTRAINT ghi_constraint FOREIGN KEY (county_id) REFERENCES COUNTIES(county_id)
	
);

