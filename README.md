# Multi-LLM OCR Extraction System

Production-ready vision AI applications leveraging multiple LLMs for document extraction and real-time visual guidance.

## Projects

### 1. Document OCR Extraction (FastAPI Backend)
Production-ready FastAPI application for extracting structured information from AIB mortgage documents using multiple vision-enabled LLMs.

**Features:**
- Multi-LLM Support (OpenAI GPT-4, Google Gemini, Anthropic Claude)
- 21 Document Templates (bank statements, payslips, tax returns, etc.)
- 94% Test Coverage with 250+ test scenarios
- Sequential & Parallel extraction modes
- Heuristic classification with LLM fallback

### 2. Voice Camera Guide (Android App) 🆕
Real-time voice-controlled visual guidance app for accessibility. Just say "Guide me" and get instant AI-powered assistance!

**Features:**
- ✨ Voice-activated (Hindi/English/Hinglish support)
- 📸 Real-time camera with fast object detection
- 🤖 OpenAI GPT-4 for natural conversation
- ⚡ TensorFlow Lite for instant on-device detection
- 🔊 Proactive hazard warnings (stairs, obstacles)
- 📍 Spatial awareness ("on your left", "2 meters ahead")

**Perfect for:** Visually impaired users, hands-free navigation, finding objects, hazard detection

👉 **[Get Started with Android App](android-app/QUICKSTART.md)**

## Quick Start

### Backend OCR Service

```bash
# Install dependencies
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env with your API keys

# Run tests
pytest

# Start server
uvicorn src.main:app --reload
```

### Android App (Voice Camera Guide)

```bash
cd android-app

# Run setup
chmod +x setup.sh
./setup.sh

# Add OpenAI API key to src/config/config.js

# Run on Android
npm run android
```

📖 **Full Android app guide:** [QUICKSTART.md](android-app/QUICKSTART.md)

## API Documentation

Once running, visit: http://localhost:8000/docs

## Repository

https://github.com/akhanna222/Multi-LLM-OCR-Extraction
