import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { analyzeScene, detectObjects } from './src/services/VisionService';
import { processQuery } from './src/services/OpenAIService';

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentObjects, setCurrentObjects] = useState([]);
  const [statusText, setStatusText] = useState('Say "Guide me" to start');

  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef(null);
  const detectionInterval = useRef(null);

  useEffect(() => {
    setupPermissions();
    setupVoice();
    setupTTS();
    return cleanup;
  }, []);

  const setupPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
    const cameraPermission = await Camera.requestCameraPermission();
    const micPermission = await Camera.requestMicrophonePermission();

    if (cameraPermission === 'denied' || micPermission === 'denied') {
      Alert.alert('Permissions required', 'Please grant camera and microphone permissions');
    }
  };

  const setupVoice = () => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = handleSpeechResults;
    Voice.onSpeechError = (e) => console.error('Speech error:', e);
  };

  const setupTTS = () => {
    Tts.setDefaultLanguage('en-IN'); // English (India) for Hindi-English mix
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);
  };

  const cleanup = () => {
    Voice.destroy().then(Voice.removeAllListeners);
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
  };

  const speak = async (text) => {
    console.log('Speaking:', text);
    await Tts.speak(text);
  };

  const handleSpeechResults = async (e) => {
    const spokenText = e.value[0].toLowerCase();
    console.log('Heard:', spokenText);

    // Activate on "guide me"
    if (spokenText.includes('guide me') && !isActive) {
      activateGuidance();
      return;
    }

    // Stop on "stop" or "exit"
    if ((spokenText.includes('stop') || spokenText.includes('exit')) && isActive) {
      deactivateGuidance();
      return;
    }

    // Process queries when active
    if (isActive) {
      setStatusText(`Processing: "${spokenText}"`);
      await handleQuery(spokenText);
    }
  };

  const activateGuidance = async () => {
    setIsActive(true);
    setStatusText('Guidance Active - Scanning...');
    await speak('Guidance activated. I am watching and ready to help.');
    startContinuousDetection();
    startVoiceListening();
  };

  const deactivateGuidance = async () => {
    setIsActive(false);
    setStatusText('Say "Guide me" to start');
    await speak('Guidance stopped');
    stopContinuousDetection();
    Voice.stop();
  };

  const startVoiceListening = async () => {
    try {
      // Continuous listening mode
      await Voice.start('en-IN');
    } catch (e) {
      console.error('Voice start error:', e);
    }
  };

  const startContinuousDetection = () => {
    // Detect objects every 1 second for fast guidance
    detectionInterval.current = setInterval(async () => {
      if (camera.current && isActive) {
        await performDetection();
      }
    }, 1000);
  };

  const stopContinuousDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
  };

  const performDetection = async () => {
    try {
      // Capture frame
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'speed',
        flash: 'off',
        enableShutterSound: false,
      });

      // Fast object detection using TensorFlow Lite
      const detectedObjects = await detectObjects(photo.path);
      setCurrentObjects(detectedObjects);

      // Proactive hazard warnings
      checkForHazards(detectedObjects);
    } catch (error) {
      console.error('Detection error:', error);
    }
  };

  const checkForHazards = (objects) => {
    const hazards = ['stairs', 'staircase', 'step', 'edge', 'hole', 'obstacle'];

    for (const obj of objects) {
      const isHazard = hazards.some(h => obj.label.toLowerCase().includes(h));

      if (isHazard && obj.confidence > 0.6) {
        const direction = getDirection(obj.boundingBox);
        speak(`Careful! ${obj.label} ${direction}`);
        break; // Only warn about one hazard at a time
      }
    }
  };

  const handleQuery = async (query) => {
    try {
      // Send query + current scene to OpenAI for intelligent response
      const sceneDescription = currentObjects
        .map(obj => `${obj.label} at ${getDirection(obj.boundingBox)}`)
        .join(', ');

      const response = await processQuery(query, sceneDescription);

      setStatusText(response);
      await speak(response);

      // Restart listening after response
      setTimeout(() => {
        if (isActive) {
          Voice.start('en-IN');
        }
      }, 500);
    } catch (error) {
      console.error('Query error:', error);
      await speak('Sorry, I could not process that');
    }
  };

  const getDirection = (boundingBox) => {
    if (!boundingBox) return '';

    const centerX = (boundingBox.left + boundingBox.right) / 2;
    const imageWidth = 1; // Normalized coordinates

    if (centerX < 0.33) {
      return 'on your left';
    } else if (centerX > 0.67) {
      return 'on your right';
    } else {
      return 'in front of you';
    }
  };

  if (device == null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.statusText}>Loading camera...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      <View style={styles.overlay}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusText}</Text>
          {isListening && (
            <View style={styles.listeningIndicator}>
              <Text style={styles.listeningText}>🎤 Listening...</Text>
            </View>
          )}
        </View>

        {isActive && (
          <View style={styles.objectsContainer}>
            <Text style={styles.objectsTitle}>Detected Objects:</Text>
            {currentObjects.slice(0, 5).map((obj, idx) => (
              <Text key={idx} style={styles.objectText}>
                • {obj.label} ({Math.round(obj.confidence * 100)}%) - {getDirection(obj.boundingBox)}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isActive && styles.buttonActive]}
          onPress={() => {
            if (isActive) {
              deactivateGuidance();
            } else {
              activateGuidance();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'STOP' : 'TAP or SAY "GUIDE ME"'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  statusContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listeningIndicator: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  listeningText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  objectsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
    maxHeight: 200,
  },
  objectsTitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  objectText: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonActive: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;
