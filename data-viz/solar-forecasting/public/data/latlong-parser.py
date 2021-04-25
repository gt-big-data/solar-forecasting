import json
import requests
import time

import copy


f = open("latlong-list.json",)


latlong = json.load(f)

print(latlong)

testcounter = 0

def endanddump():
    with open('latlong-new.json', 'w') as outfile:
        json.dump(latlong, outfile)
    quit()


tempJson = copy.deepcopy(latlong)

for county in tempJson:
    for locObject in tempJson[county]:
        # if (testcounter == 5):
        #     endanddump()
        print("Start Iteration")
        print(county)


        print(locObject)
        # print(locObject['latitude'])
        lat = locObject['latitude']
        lon = locObject['longitude']


        resp = requests.get("https://geo.fcc.gov/api/census/area?lat=" + str(lat) + "&lon=" + str(lon) + "&format=json")

        counter = 0
        while (resp.status_code != 200):
            print("WAITING!")
            counter += 1
            time.sleep(1)
            if (counter == 20):
                break

        if (resp.status_code == 200):

            data = resp.json()

            print(data['results'][0]['county_name'])

            if(county != data['results'][0]['county_name']):
                # delete the object
                print(len(latlong[county]))
                (latlong[county]).remove({"latitude": lat, "longitude": lon})
                print(len(latlong[county]))



        time.sleep(0.1)

        print("")

        testcounter += 1


endanddump()

