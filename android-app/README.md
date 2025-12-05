# Voice Camera Guide App

A super intuitive voice-controlled camera app for visual guidance. Just say **"Guide me"** and the app starts analyzing what's in front of you!

## Features

✨ **Voice Activated** - Say "Guide me" to start, completely hands-free
📸 **Real-time Camera** - Instant visual analysis
🤖 **AI-Powered** - OpenAI LLM for natural conversation (Hindi/English/Hinglish)
⚡ **Fast Object Detection** - TensorFlow Lite for instant detection
🔊 **Audio Guidance** - Text-to-speech responses
⚠️ **Hazard Warnings** - Automatic alerts for stairs, obstacles, etc.
📍 **Spatial Awareness** - "On your left", "in front of you", etc.

## Use Cases

- **"Where is the knife?"** → "The knife is on your left, about 1 meter away"
- **Walking mode** → "Careful! Stairs ahead on your right"
- **Finding objects** → "Is the cup on the left or right?"
- **Navigation** → Continuous guidance while moving

## Quick Start

### Prerequisites

- Node.js 18+
- Android Studio
- Android device or emulator (API 24+)
- OpenAI API key

### Installation

```bash
# Navigate to app directory
cd android-app

# Install dependencies
npm install

# For iOS (if needed)
cd ios && pod install && cd ..
```

### Configuration

1. **Set OpenAI API Key**

Edit `src/config/config.js`:
```javascript
export const OPENAI_API_KEY = 'your-openai-api-key-here';
```

Or create `.env` file:
```
OPENAI_API_KEY=your-openai-api-key-here
```

### Running the App

```bash
# Start Metro bundler
npm start

# In another terminal, run on Android
npm run android

# Or build APK
npm run build-android
```

### First Run

1. Grant camera and microphone permissions
2. Say **"Guide me"** or tap the button
3. App starts camera and begins analyzing
4. Ask questions or let it guide you automatically
5. Say **"stop"** to exit

## How It Works

### Architecture

```
Voice Input (Hindi/English)
    ↓
Speech Recognition
    ↓
OpenAI LLM (GPT-4) ←→ Camera Feed
    ↓                      ↓
Text-to-Speech    TensorFlow Lite (Object Detection)
    ↓                      ↓
Audio Output      Real-time Analysis
```

### Detection Speed

- **Object Detection**: ~1 second intervals (TensorFlow Lite)
- **Voice Response**: ~2-3 seconds (includes OpenAI API)
- **Hazard Warnings**: Instant (local processing)

### Supported Languages

- English
- Hindi
- Hinglish (mixed Hindi-English)

## Voice Commands

- **"Guide me"** - Start guidance
- **"Where is [object]?"** - Find specific object
- **"What do you see?"** - Describe scene
- **"Is there [object] on the left/right?"** - Directional query
- **"Stop"** / **"Exit"** - Stop guidance

## Troubleshooting

### Camera not working
- Check permissions in Android settings
- Ensure device has back camera
- Try restarting the app

### Voice not recognized
- Check microphone permissions
- Speak clearly near the phone
- Ensure stable internet connection

### Slow detection
- Close other apps
- Ensure good lighting
- Use on newer Android devices (API 28+)

### API errors
- Verify OpenAI API key is correct
- Check internet connection
- Ensure API key has credits

## Performance Optimization

### For Best Performance:

1. **Use on mid-range or better devices** (2GB+ RAM)
2. **Ensure good lighting** for better detection
3. **Close background apps** to free resources
4. **Use WiFi** for faster API responses

### Battery Optimization:

The app uses camera + AI continuously, which drains battery. For longer use:
- Lower screen brightness
- Use power bank
- Optimize detection interval in config

## Customization

Edit `src/config/config.js` to customize:

```javascript
// Detection frequency (ms)
export const DETECTION_INTERVAL = 1000; // Default: 1 second

// Confidence threshold (0-1)
export const CONFIDENCE_THRESHOLD = 0.5; // Default: 50%

// Add custom hazards
export const HAZARD_KEYWORDS = [
  'stairs', 'step', 'hole', // Add your own
];
```

## Building for Production

```bash
# Generate release APK
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

### Install on device:
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## Tech Stack

- **React Native** - Cross-platform framework
- **React Native Vision Camera** - High-performance camera
- **@react-native-voice/voice** - Speech recognition
- **React Native TTS** - Text-to-speech
- **TensorFlow Lite** - On-device ML
- **OpenAI GPT-4** - Natural language processing

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for accessibility
