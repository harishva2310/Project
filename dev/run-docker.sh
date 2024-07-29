#!/bin/bash

sudo docker rmi --force harishva1910/backend || true


sudo docker build --no-cache -t harishva1910/backend:latest .


sudo docker push harishva1910/backend:latest


sudo docker run -p 8443:8443 harishva1910/backend:latest

# Note: The container will continue to run in the foreground. 
# To detach the container and run it in the background, use:
# sudo docker run -d -p 8443:8443 harishva1910/backend:latest
