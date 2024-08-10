# Use the official Maven image with Java 17
FROM maven:3.8.5-openjdk-17-slim as build

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

RUN ls -la target/

FROM maven:3.8.5-openjdk-17-slim
WORKDIR /app
# Copy the built application to the target directory
COPY --from=build /app/target/dev-0.0.1-SNAPSHOT.jar /app/DevApplication.jar

# Copy the keystore file
COPY src/main/resources/harish-keystore.p12 /app/harish-keystore.p12

# Persist the keystore file
VOLUME /app/harish-keystore.p12

# Make port 8443 available to the world outside this container
EXPOSE 8443

# Run the application with SSL configuration
ENTRYPOINT ["java", "-Djavax.net.ssl.trustStore=harish-keystore.p12", "-Djavax.net.ssl.trustStorePassword=your_password", "-Djavax.net.ssl.keyStore=harish-keystore.p12", "-Djavax.net.ssl.keyStorePassword=your_password", "-jar", "/app/DevApplication.jar"]