#!/bin/bash

echo "🐳 Building APK with Docker"
echo "============================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker found"
echo ""

# Build Docker image
echo "📦 Building Docker image..."
docker build -t voice-camera-guide-builder .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

echo ""
echo "🔨 Building APK in container..."

# Run container and build APK
docker run --rm -v "$(pwd)/output:/app/android/app/build/outputs" voice-camera-guide-builder

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📱 APK location: output/apk/release/app-release.apk"
    echo ""
    echo "To install:"
    echo "  adb install output/apk/release/app-release.apk"
else
    echo ""
    echo "❌ Build failed"
    exit 1
fi
