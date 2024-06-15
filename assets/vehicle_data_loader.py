# -*- coding: utf-8 -*-
"""
Created on Thu Jun 13 10:52:24 2024

@author: haris
"""

import pandas as pd
import json
from PIL import Image
from bson.binary import Binary
import base64

data = pd.read_excel('VehicleData.xls')
vehicles = []
for index, row in data.iterrows():
     # read image file
     vehicle_id = row['vehicle_id']
     vehicle_name = row['vehicle_name']
     image_path = row['vehicle_image_path']
        
     with open(image_path, 'rb') as image_file:
         image_binary = base64.b64encode(image_file.read()).decode('utf-8')
     
     vehicle={
         'vehicle_id':row['vehicle_id'],
         'vehicle_name':row['vehicle_name'],
         'vehicle_image':image_binary
         }
     vehicles.append(vehicle)

vehicles_json = json.dumps(vehicles, indent=4)

with open('vehicles.json', 'w') as json_file:
    json_file.write(vehicles_json)

