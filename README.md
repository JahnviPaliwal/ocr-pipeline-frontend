# Intelligent Document OCR & Extraction Pipeline

A production-grade document processing system that extracts structured data from identity and professional documents using OCR + LLM.

## Features

- **Drag-drop upload** — PDF, JPG, PNG supported (max 10MB)
- **Image preprocessing** — Grayscale, Gaussian blur, Otsu thresholding, deskewing, CLAHE contrast enhancement
- **High-accuracy OCR** — PaddleOCR (open-source, state-of-the-art)
- **AI extraction** — Groq Llama 3 70B (FREE tier) for structured data
- **Confidence scores** — Per-field accuracy percentages (color-coded)
- **Processing history** — SQLite-backed with pagination
- **Document preview** — View original with bounding-box overlays
- **JSON export** — Download extraction results
- **Dockerized** — One-command local deployment

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| OCR | PaddleOCR (open-source) |
| LLM | Groq API — Llama 3 70B (FREE) |
| Database | SQLite (zero-config) |
| Deployment | Docker + Docker Compose |

---

## Prerequisites

1. **Node.js 18+** and **Python 3.11+** (for manual run)
2. **Docker & Docker Compose** (for containerized run)
3. **Groq API key** — FREE at [https://console.groq.com](https://console.groq.com)

---

## Quick Start (Docker — Recommended)

```bash
# 1. Unzip and enter project
unzip ocr-extraction-pipeline.zip
cd ocr-extraction-pipeline

# 2. Copy and configure environment
cp .env.example .env
# Edit .env and set: GROQ_API_KEY=gsk_...

# 3. Start all services
docker-compose up --build

# 4. Open in browser
# Frontend:   http://localhost:3000
# Backend:    http://localhost:8000
# API Docs:   http://localhost:8000/docs
```

---

## Quick Start (Manual — Development)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirements.txt

export GROQ_API_KEY=gsk_your_key_here  # Windows: set GROQ_API_KEY=...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (new terminal)

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## API Reference

### POST `/api/documents/process`
Upload a document for processing.

```bash
curl -X POST http://localhost:8000/api/documents/process \
  -F "file=@sample_degree.pdf"
# → { "jobId": "uuid-1234", "status": "processing" }
```

### GET `/api/documents/{job_id}/result`
Poll for extraction results.

```bash
curl http://localhost:8000/api/documents/uuid-1234/result
```

```json
{
  "jobId": "uuid-1234",
  "status": "completed",
  "data": {
    "holder": { "name": "Rajesh Kumar", "fatherName": "Suresh Kumar", "dob": "1995-03-15" },
    "credential": { "degree": "B.Tech", "institution": "IIT Delhi", "year": "2017", "cgpa": "8.5" },
    "issuer": { "name": "Indian Institute of Technology Delhi" },
    "confidence": { "name": 98, "fatherName": 95, "dob": 92, "degree": 88, "institution": 90, "year": 95, "cgpa": 85 },
    "rawText": "Full OCR text here..."
  },
  "processedAt": "2024-01-15T10:30:00Z"
}
```

### GET `/api/documents`
List all processed documents.

### DELETE `/api/documents/{job_id}`
Delete a document record and file.

### GET `/api/health`
```json
{ "status": "healthy", "ocr": "ready", "llm": "ready" }
```

---

## Processing Pipeline

```
Upload → Preprocessing → OCR → LLM Extraction → Confidence Scoring → Store
```

1. **Preprocessing** (`services/preprocessing.py`)
   - Grayscale conversion
   - Gaussian blur (noise removal)
   - Otsu thresholding (binarization)
   - Deskew via projection profile
   - CLAHE contrast enhancement

2. **OCR** (`services/ocr_service.py`)
   - PaddleOCR with angle classification
   - Extracts text + bounding boxes
   - Falls back to pytesseract if PaddleOCR unavailable

3. **LLM Extraction** (`services/llm_service.py`)
   - Auto-detects document type (degree, marksheet, Aadhaar, passport)
   - Groq Llama 3 70B with JSON mode
   - Normalizes DOB → YYYY-MM-DD, extracts 4-digit years, numeric CGPA
   - Rule-based fallback if no API key

4. **Confidence Scoring** (`services/document_processor.py`)
   - Base score from PaddleOCR detector confidence
   - Field validation (DOB format, year range 1950–2030, CGPA 0–10)
   - Returns per-field 0–100 scores

---

## Supported Documents

| Document Type | Fields Extracted |
|---|---|
| Degree Certificate | Name, Institution, Degree, Year, CGPA, Issuer |
| Marksheet | Name, Father's Name, Institution, Year, CGPA |
| Aadhaar Card | Name, DOB, Gender |
| Passport | Name, DOB, Nationality |
| Generic | Best-effort extraction |

---

## Testing

```bash
cd backend
pytest                          # All tests
pytest tests/test_api.py -v     # API tests only
pytest tests/test_pipeline.py -v # Pipeline tests
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | Yes | — | Groq API key (free at console.groq.com) |
| `DATABASE_URL` | No | `sqlite:///./app.db` | SQLite path |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000` | Backend URL |

---

## Project Structure

```
ocr-extraction-pipeline/
├── frontend/               # Next.js 14 App
│   ├── app/
│   │   ├── page.tsx        # Dashboard + upload
│   │   ├── results/[id]/   # Results page
│   │   ├── history/        # History page
│   │   ├── components/     # UI components
│   │   └── lib/            # API client + types
│   └── ...
├── backend/                # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── api/endpoints/  # REST endpoints
│   │   ├── services/       # OCR, LLM, preprocessing
│   │   ├── models/         # Pydantic + SQLAlchemy
│   │   └── core/           # Config, security
│   ├── tests/
│   └── requirements.txt
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Limitations

- Max file size: 10MB
- Supported: PDF, JPG, JPEG, PNG
- Groq free tier: ~30 requests/minute
- Processing time: 10–30 seconds/document
- PaddleOCR downloads models (~500MB) on first run

---

## License

MIT License — free for personal and commercial use.
