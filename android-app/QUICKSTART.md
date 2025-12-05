# Quick Start Guide - Voice Camera Guide

Get the app running in 5 minutes! 🚀

## Step 1: Prerequisites (2 min)

Install these if you don't have them:
- [Node.js 18+](https://nodejs.org/)
- [Android Studio](https://developer.android.com/studio)
- An Android device or emulator

## Step 2: Setup (1 min)

```bash
cd android-app
chmod +x setup.sh
./setup.sh
```

## Step 3: Add API Key (1 min)

Open `src/config/config.js` and add your OpenAI API key:

```javascript
export const OPENAI_API_KEY = 'sk-your-key-here';
```

Get your key from: https://platform.openai.com/api-keys

## Step 4: Run (1 min)

```bash
# Terminal 1: Start Metro
npm start

# Terminal 2: Run on Android
npm run android
```

## Done! 🎉

The app will install and launch on your device.

### First Use:

1. Grant camera and microphone permissions
2. Say **"Guide me"** or tap the big green button
3. The app starts analyzing what the camera sees
4. Try asking: **"What do you see?"** or **"Where is [object]?"**
5. Say **"Stop"** when done

## Troubleshooting

**Can't run npm install?**
- Make sure Node.js 18+ is installed: `node -v`

**Can't run on Android?**
- Make sure device is connected: `adb devices`
- Or start Android emulator from Android Studio

**"OpenAI API error"?**
- Check your API key is correct
- Ensure you have credits: https://platform.openai.com/usage

**Camera not working?**
- Grant permissions in Android settings
- Try restarting the app

## Need More Help?

Read the full [README.md](README.md) for detailed instructions.

---

**Pro Tip:** For your mom, install the APK directly on her phone and create a shortcut on the home screen. She can just tap and say "Guide me"!
