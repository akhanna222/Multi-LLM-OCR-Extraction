# Multi-LLM OCR Extraction System

Production-ready FastAPI application for extracting structured information from AIB mortgage documents using multiple vision-enabled LLMs.

## Features

- Multi-LLM Support (OpenAI GPT-4, Google Gemini, Anthropic Claude)
- 21 Document Templates (bank statements, payslips, tax returns, etc.)
- 94% Test Coverage with 250+ test scenarios
- Sequential & Parallel extraction modes
- Heuristic classification with LLM fallback

## Quick Start

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

## API Documentation

Once running, visit: http://localhost:8000/docs

## Repository

https://github.com/akhanna222/Multi-LLM-OCR-Extraction
