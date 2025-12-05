FROM react native/react-native:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Set Android environment
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Build the APK
WORKDIR /app/android
RUN ./gradlew assembleRelease

# The APK will be in /app/android/app/build/outputs/apk/release/
