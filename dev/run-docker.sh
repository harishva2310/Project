#!/bin/bash

# Remove existing image (if any)
echo "Removing existing image harishva1910/backend..."
sudo docker rmi --force harishva1910/backend || true

# Build a new image with no cache
echo "Building new image harishva1910/backend:latest..."
sudo docker build --no-cache -t harishva1910/backend:latest .

# Push the image to a registry (replace with your actual registry details)
echo "Pushing image harishva1910/backend:latest to registry..."
sudo docker push harishva1910/backend:latest

# Run the container and map port 8443 to the container port
echo "Running container harishva1910/backend:latest..."
sudo docker run -p 8443:8443 harishva1910/backend:latest

# Note: The container will continue to run in the foreground. 
# To detach the container and run it in the background, use:
# sudo docker run -d -p 8443:8443 harishva1910/backend:latest
