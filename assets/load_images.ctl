LOAD DATA
INFILE 'data_file.dat'
INTO TABLE your_table
FIELDS TERMINATED BY ','
(
    vehicle_id,
    vehicle_name,
    vehicle_image LOBFILE (vehicle_image_filename) TERMINATED BY EOF
)