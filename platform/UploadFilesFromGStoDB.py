import os
import subprocess
import time
import sys
file1 = open('GSCSVNames.txt', 'r')
names = file1.readlines()

for name in names:
  #remove endline
  name = name.strip()  
  #command
  var = "gcloud sql import csv --async bdbi-solar-platform " + name + " --database=SolarForecasting --table=GHI_DATA"
  #split at spaces subprocess needs each command split at spaces as an array
  var = var.split(" ")
  #provide the yes input to gcloud asking if we would like to go ahead with import, input must be in binary thus b"y"
  subprocess.run(var, input=b"y")
  #sleep to give time for it to finish uploading before uploading next file
  time.sleep(50)
  #test