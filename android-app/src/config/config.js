/**
 * Configuration for Voice Camera Guide App
 *
 * IMPORTANT: Set your OpenAI API key here or in .env file
 */

// Use environment variable or hardcode (for development only)
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE';

// Detection settings
export const DETECTION_INTERVAL = 1000; // ms - how often to detect objects
export const CONFIDENCE_THRESHOLD = 0.5; // Minimum confidence for object detection

// Voice settings
export const VOICE_LANGUAGE = 'en-IN'; // English (India) - supports Hinglish

// TTS settings
export const TTS_LANGUAGE = 'en-IN';
export const TTS_RATE = 0.5; // Speaking speed (0.5 = slower, more clear)
export const TTS_PITCH = 1.0; // Voice pitch

// Hazard detection
export const HAZARD_KEYWORDS = [
  'stairs',
  'staircase',
  'step',
  'edge',
  'hole',
  'obstacle',
  'car',
  'vehicle',
  'truck',
  'bus',
  'bicycle',
  'motorcycle'
];

// Directional thresholds (normalized 0-1)
export const DIRECTION_LEFT_THRESHOLD = 0.33;
export const DIRECTION_RIGHT_THRESHOLD = 0.67;
