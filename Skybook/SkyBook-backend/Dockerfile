# ---------- Stage 1: Build ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ---------- Stage 2: Run ----------
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# H2 database file gets written here inside the container.
# Mount a volume to this path if you want the data to survive container restarts.
VOLUME /app/data

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
