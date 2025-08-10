#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Navigate to backend directory
cd backend

# Clean and build the Maven project
echo "Building Maven project..."
./mvnw clean package -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "JAR file created: target/demo-0.0.1-SNAPSHOT.jar"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "Build process completed." 