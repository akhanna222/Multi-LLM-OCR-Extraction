#!/bin/bash

echo "🔨 Building Voice Camera Guide APK"
echo "=================================="
echo ""

# Check if Android SDK is configured
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set"
    echo "   Please set it to your Android SDK location"
    echo "   Example: export ANDROID_HOME=$HOME/Android/Sdk"
    exit 1
fi

echo "✅ Android SDK: $ANDROID_HOME"
echo ""

# Navigate to android directory
cd android

echo "🧹 Cleaning previous builds..."
./gradlew clean

echo ""
echo "📦 Building release APK..."
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📱 APK location:"
    echo "   app/build/outputs/apk/release/app-release.apk"
    echo ""
    echo "To install on connected device:"
    echo "   adb install app/build/outputs/apk/release/app-release.apk"
    echo ""

    # Copy APK to easier location
    cp app/build/outputs/apk/release/app-release.apk ../VoiceCameraGuide.apk
    echo "📋 Also copied to: VoiceCameraGuide.apk"
else
    echo ""
    echo "❌ Build failed"
    echo "   Check the error messages above"
    exit 1
fi

cd ..
