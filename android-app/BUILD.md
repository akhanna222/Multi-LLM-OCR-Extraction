# Building the Voice Camera Guide APK

There are **3 easy ways** to build the APK:

## Option 1: Automatic Build with GitHub Actions ⭐ (EASIEST)

**No installation required! GitHub builds it for you.**

1. Push code to GitHub
2. Go to your repository: https://github.com/akhanna222/Multi-LLM-OCR-Extraction
3. Click "Actions" tab
4. Click on the latest "Build Android APK" workflow
5. Wait for build to complete (~5-10 minutes)
6. Download the APK from "Artifacts" section

**To enable automatic builds:**
```bash
# Just push to the repository
git push origin your-branch-name

# Or trigger manually from GitHub Actions page
```

The APK will be automatically built and available for download!

---

## Option 2: Build with Docker 🐳 (RECOMMENDED)

**Requires: Docker only (no Android SDK needed)**

```bash
cd android-app

# Make build script executable
chmod +x build-with-docker.sh

# Build APK
./build-with-docker.sh

# APK will be in: output/apk/release/app-release.apk
```

Install Docker: https://docs.docker.com/get-docker/

---

## Option 3: Build Locally (Traditional)

**Requires: Node.js, Java JDK, Android SDK**

### Prerequisites:

1. **Node.js 18+**
   ```bash
   node -v  # Should be 18+
   ```

2. **Java JDK 17+**
   ```bash
   java -version  # Should be 17+
   ```

3. **Android SDK**
   - Install Android Studio: https://developer.android.com/studio
   - Set ANDROID_HOME:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

### Build Steps:

```bash
cd android-app

# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Add your OpenAI API key
# Edit: src/config/config.js
nano src/config/config.js
# Change: export const OPENAI_API_KEY = 'your-key-here';

# 3. Build APK
cd android
./gradlew assembleRelease

# 4. Find your APK
ls -lh app/build/outputs/apk/release/app-release.apk
```

The APK will be at:
```
android-app/android/app/build/outputs/apk/release/app-release.apk
```

---

## Installing the APK on Your Phone

### Method 1: USB Connection
```bash
# Connect phone via USB
# Enable USB debugging on phone

# Install APK
adb install app-release.apk
```

### Method 2: Direct Install
1. Copy `app-release.apk` to your phone
2. Open the file on your phone
3. Allow "Install from Unknown Sources" if prompted
4. Tap "Install"
5. Grant camera and microphone permissions when app opens

---

## Troubleshooting

### "Docker build failed"
- Make sure Docker is running
- Try: `docker system prune` to clean up
- Restart Docker and try again

### "Gradle build failed"
- Check Java version: `java -version` (need 17+)
- Clean build: `./gradlew clean`
- Delete `node_modules` and run `npm install` again

### "Android SDK not found"
- Make sure ANDROID_HOME is set:
  ```bash
  echo $ANDROID_HOME
  # Should print path to Android SDK
  ```
- Install Android Studio and SDK tools

### "APK not installing on phone"
- Enable "Install from Unknown Sources" in phone settings
- Make sure USB debugging is enabled
- Try restarting the phone

---

## Build Configurations

### Debug Build (for testing)
```bash
cd android
./gradlew assembleDebug
# Smaller, faster build but not optimized
```

### Release Build (for distribution)
```bash
cd android
./gradlew assembleRelease
# Optimized, smaller APK for sharing
```

### Signed Release (for Play Store)
Requires keystore setup. See: https://reactnative.dev/docs/signed-apk-android

---

## File Sizes

- **Debug APK**: ~50-60 MB
- **Release APK**: ~30-40 MB

---

## What's Included in the APK

✅ Camera functionality
✅ Voice recognition
✅ Text-to-speech
✅ TensorFlow Lite models
✅ All required libraries
✅ Optimized for Android 7.0+ (API 24+)

---

## Need Help?

- Check [README.md](README.md) for app features
- Check [QUICKSTART.md](QUICKSTART.md) for usage guide
- Open an issue on GitHub for build problems

---

**Recommended:** Use **Option 1 (GitHub Actions)** for easiest builds with zero local setup!
