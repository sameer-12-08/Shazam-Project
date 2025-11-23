FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy Maven wrapper files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Pre-download dependencies (cache layer)
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the JAR
CMD ["java", "-jar", "target/Shazam-0.0.1-SNAPSHOT.jar"]
