#!/bin/bash

echo "🚀 Voice Camera Guide - Setup Script"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check for Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo ""
    echo "⚠️  Warning: ANDROID_HOME not set"
    echo "   Please install Android Studio and set ANDROID_HOME"
    echo "   Example: export ANDROID_HOME=$HOME/Android/Sdk"
fi

# Create config from example
echo ""
echo "📝 Setting up configuration..."

if [ ! -f "src/config/config.js" ]; then
    echo "   Please edit src/config/config.js and add your OpenAI API key"
else
    echo "   ✅ Configuration file exists"
    echo "   ⚠️  Don't forget to add your OpenAI API key!"
fi

# Success message
echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add your OpenAI API key to src/config/config.js"
echo "  2. Connect your Android device or start emulator"
echo "  3. Run: npm run android"
echo ""
echo "Need help? Check README.md"
