# Stage 1: Build the react app
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . ./

# Build the application
RUN npm run build

# Stage 2: Serve the react app
FROM nginx:alpine

# Copy built application from Stage 1
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY nginx-selfsigned.crt /etc/nginx/ssl/nginx-selfsigned.crt
COPY nginx-selfsigned.key /etc/nginx/ssl/nginx-selfsigned.key

# Expose ports 80 and 443
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
