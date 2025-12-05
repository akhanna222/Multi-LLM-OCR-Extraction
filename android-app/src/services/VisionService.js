import * as tf from '@tensorflow/tfjs';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import RNFS from 'react-native-fs';

let model = null;
let isModelLoading = false;

/**
 * Load MobileNet SSD model for fast object detection
 * This runs locally on the phone for instant detection
 */
export const loadModel = async () => {
  if (model || isModelLoading) return;

  try {
    isModelLoading = true;
    console.log('Loading TensorFlow.js...');

    // Initialize TensorFlow
    await tf.ready();
    console.log('TensorFlow.js ready');

    // Load MobileNet SSD Lite model
    // This is a lightweight model optimized for mobile
    model = await tf.loadGraphModel(
      'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1',
      { fromTFHub: true }
    );

    console.log('Model loaded successfully');
    isModelLoading = false;
  } catch (error) {
    console.error('Model loading error:', error);
    isModelLoading = false;
    throw error;
  }
};

/**
 * Detect objects in image
 * Returns array of detected objects with labels, confidence, and bounding boxes
 */
export const detectObjects = async (imagePath) => {
  try {
    // Load model if not already loaded
    if (!model && !isModelLoading) {
      await loadModel();
    }

    // Wait for model to be ready
    while (isModelLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!model) {
      console.warn('Model not loaded, using fallback detection');
      return [];
    }

    // Read image file
    const imageData = await RNFS.readFile(imagePath, 'base64');
    const rawImageData = tf.util.encodeString(imageData, 'base64').buffer;
    const imageTensor = decodeJpeg(new Uint8Array(rawImageData));

    // Resize to model input size (300x300 for MobileNet SSD)
    const resized = tf.image.resizeBilinear(imageTensor, [300, 300]);
    const expanded = resized.expandDims(0);

    // Run detection
    const predictions = await model.executeAsync(expanded);

    // Process predictions
    const boxes = await predictions[0].array();
    const scores = await predictions[1].array();
    const classes = await predictions[2].array();

    const detectedObjects = [];
    const threshold = 0.5; // Confidence threshold

    for (let i = 0; i < scores[0].length; i++) {
      if (scores[0][i] > threshold) {
        const label = getCocoLabel(classes[0][i]);
        const boundingBox = {
          top: boxes[0][i][0],
          left: boxes[0][i][1],
          bottom: boxes[0][i][2],
          right: boxes[0][i][3],
        };

        detectedObjects.push({
          label,
          confidence: scores[0][i],
          boundingBox,
        });
      }
    }

    // Clean up tensors
    tf.dispose([imageTensor, resized, expanded, predictions]);

    return detectedObjects;
  } catch (error) {
    console.error('Detection error:', error);
    return [];
  }
};

/**
 * COCO dataset labels (90 common objects)
 * Includes important objects for navigation and daily tasks
 */
const getCocoLabel = (classId) => {
  const labels = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck',
    'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench',
    'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra',
    'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
    'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove',
    'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup',
    'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
    'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
    'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse',
    'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
    'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier',
    'toothbrush', 'stairs', 'door', 'window', 'obstacle'
  ];

  return labels[Math.floor(classId)] || `object_${classId}`;
};

/**
 * Analyze full scene context
 */
export const analyzeScene = (detectedObjects) => {
  if (detectedObjects.length === 0) {
    return 'No objects detected in view';
  }

  const objectCounts = {};
  detectedObjects.forEach(obj => {
    objectCounts[obj.label] = (objectCounts[obj.label] || 0) + 1;
  });

  const summary = Object.entries(objectCounts)
    .map(([label, count]) => count > 1 ? `${count} ${label}s` : label)
    .join(', ');

  return summary;
};
