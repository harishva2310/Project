# Use the official Maven image with Java 17
FROM maven:3.8.6-openjdk-17

# Set the working directory to /app
WORKDIR /app

# Copy the pom.xml file
COPY pom.xml /app/

# Download the dependencies
RUN mvn dependency:go-offline

# Copy the rest of the application code
COPY src /app/src/

# Build the application
RUN mvn package

# Copy the built application to the target directory
COPY target/*.jar /app/app.jar

# Copy the JAR file and keystore from the build stage
COPY --from=build /app/target/*.jar /app/DevApplication.jar
COPY src/main/resources/harish-keystore.p12 /app/harish-keystore.p12

# Persist the keystore file
VOLUME /app/harish-keystore.p12

# Make port 8443 available to the world outside this container
EXPOSE 8443

# Run the application
ENTRYPOINT ["java", "-jar", "/app/DevApplication.jar"]