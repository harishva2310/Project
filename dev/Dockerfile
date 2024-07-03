# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory to /app
WORKDIR /app

# Copy the JAR file and keystore into the container
COPY target/*.jar /app/DevApplication.jar
COPY src/main/resources/harish-keystore.p12 /app/harish-keystore.p12

# Make port 8443 available to the world outside this container
EXPOSE 8443

# Run the application
ENTRYPOINT ["java", "-jar", "/app/DevApplication.jar"]
