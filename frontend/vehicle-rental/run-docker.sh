#!/bin/bash

sudo docker rmi --force harishva1910/frontend|| true

sudo docker build --no-cache -t harishva1910/frontend:latest .

sudo docker push harishva1910/frontend:latest

sudo docker run -p 80:80 harishva1910/frontend:latest
