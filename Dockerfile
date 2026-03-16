# Build stage
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# Build the backend specifically since the structure is multi-module style
RUN mvn -f backend/pom.xml clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/backend/target/*.jar app.jar

# Expose the default Spring Boot port (will be overridden by $PORT on Render)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
