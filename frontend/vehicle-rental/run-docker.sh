#!/bin/bash

sudo docker rmi --force harishva1910/frontend|| true

sudo docker build --no-cache -t --network=host harishva1910/frontend:latest .

sudo docker push harishva1910/frontend:latest

sudo docker run -p 80:80 -p 443:443 --network my-network --name frontend harishva1910/frontend:latest