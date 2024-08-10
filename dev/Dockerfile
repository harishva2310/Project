# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim as build

# Set the working directory to /app
WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven

# Copy the Maven pom.xml file
COPY pom.xml /app/

# Download the dependencies
RUN mvn dependency:go-offline

# Copy the rest of the application code
COPY src /app/src/

# Build the application
RUN mvn package

# Use an official OpenJDK 17 runtime as a parent image for the runtime stage
FROM openjdk:17-jdk-slim

# Set the working directory to /app
WORKDIR /app

# Copy the JAR file and keystore from the build stage
COPY --from=build /app/target/*.jar /app/DevApplication.jar
COPY src/main/resources/harish-keystore.p12 /app/harish-keystore.p12

# Make port 8443 available to the world outside this container
EXPOSE 8443

# Run the application
ENTRYPOINT ["java", "-jar", "/app/DevApplication.jar"]