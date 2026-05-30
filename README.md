# DocExtract — Intelligent Document OCR & Extraction Pipeline

A production-grade document processing system that extracts structured data from identity and professional documents using OCR + LLM, with user authentication and private document history.

---

## Live Demo

- **Frontend**: https://your-vercel-url.vercel.app
- **Backend API**: https://JavaPD-ocr-pipeline-backend.hf.space
- **API Docs**: https://JavaPD-ocr-pipeline-backend.hf.space/docs

---

## Features

- **User Authentication** — Register/Login, JWT tokens, private document history
- **Multi-format Support** — PDF (multi-page), JPG, JPEG, PNG
- **Triple OCR Engine** — PaddleOCR → EasyOCR → Tesseract (automatic fallback)
- **AI Extraction** — Groq Llama 3 70B for intelligent structured data extraction
- **Confidence Scores** — Per-field accuracy percentages (color-coded)
- **Multi-document Support** — Aadhaar, Passport, PAN, Degree, Marksheet, Driving License
- **Multi-page PDF** — All pages processed, page-wise OCR results shown
- **Private History** — Each user sees only their own documents
- **Docker Ready** — One command deployment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| OCR | PaddleOCR → EasyOCR → Tesseract (fallback chain) |
| LLM | Groq API — Llama 3 70B (FREE tier) |
| Auth | JWT tokens + bcrypt password hashing |
| Database | SQLite (local) / PostgreSQL (production) |
| Deployment | Hugging Face Spaces (backend) + Vercel (frontend) |

---

## Project Structure

```
ocr-extraction-pipeline/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                  # Dashboard + upload
│   │   ├── login/page.tsx            # Login page
│   │   ├── register/page.tsx         # Register page
│   │   ├── results/[id]/page.tsx     # Results page
│   │   ├── history/page.tsx          # Document history
│   │   ├── components/
│   │   │   ├── NavBar.tsx            # Auth-aware navigation
│   │   │   ├── AuthGuard.tsx         # Route protection
│   │   │   ├── DocumentUpload.tsx    # Drag-drop upload
│   │   │   ├── ProgressIndicator.tsx # Real-time progress
│   │   │   ├── ResultsCard.tsx       # Dynamic extracted data
│   │   │   ├── DocumentPreview.tsx   # Original doc viewer
│   │   │   └── HistoryList.tsx       # Past documents table
│   │   └── lib/
│   │       ├── api.ts                # API client with auth
│   │       ├── auth.ts               # Token management
│   │       └── types.ts              # TypeScript interfaces
│   ├── middleware.ts                  # Route protection
│   ├── package.json
│   └── next.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI entry point
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py           # Register/Login endpoints
│   │   │   │   ├── documents.py      # Document CRUD endpoints
│   │   │   │   └── health.py         # Health check
│   │   │   └── dependencies.py       # Auth middleware
│   │   ├── core/
│   │   │   ├── config.py             # Settings, env vars
│   │   │   └── security.py           # JWT + bcrypt
│   │   ├── services/
│   │   │   ├── preprocessing.py      # Image enhancement
│   │   │   ├── ocr_service.py        # OCR fallback chain
│   │   │   ├── llm_service.py        # Groq LLM extraction
│   │   │   └── document_processor.py # Full pipeline
│   │   ├── models/
│   │   │   ├── schemas.py            # Pydantic models
│   │   │   └── database.py           # SQLAlchemy models
│   │   └── db/
│   │       └── session.py            # DB session
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```
<img width="196" height="150" alt="Image" src="https://github.com/user-attachments/assets/b2d39dab-226a-4cd8-9cc0-ae0433c24b04" />



<img width="159" height="150" alt="Image" src="https://github.com/user-attachments/assets/3f2db2ee-0e5a-45ac-9950-d600909d5fb0" />


## Prerequisites

- Python 3.11+
- Node.js 18+
- Groq API key — FREE at [console.groq.com](https://console.groq.com)
- Tesseract OCR (for local fallback)

---

## Quick Start — Local Development

### 1. Clone / Extract project

```bash
cd ocr-extraction-pipeline
```

### 2. Set up Backend

```bash
cd backend

# Create virtual environment
py -3.11 -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
set GROQ_API_KEY=your_groq_key_here       # Windows
export GROQ_API_KEY=your_groq_key_here    # Mac/Linux

# Run backend
python -m uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API Docs at: http://localhost:8000/docs

### 3. Set up Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

Frontend runs at: http://localhost:3000

### 4. Quick Start — Docker

```bash
# Copy env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run everything
docker-compose up --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | — | Groq API key. Get free at console.groq.com |
| `DATABASE_URL` | No | `sqlite:///./app.db` | Database connection string |
| `SECRET_KEY` | No | default key | JWT signing secret. Change in production |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000` | Backend URL for frontend |

### .env.example

```bash
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=change-this-to-a-random-secret-string
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## API Documentation

### Authentication

#### POST `/api/auth/register`
Create a new account.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "eyJ...",
  "user_id": "uuid",
  "name": "John Doe",
  "email": "user@example.com"
}
```

---

#### POST `/api/auth/login`
Login to existing account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "eyJ...",
  "user_id": "uuid",
  "name": "John Doe",
  "email": "user@example.com"
}
```

---

### Documents

All document endpoints require `Authorization: Bearer <token>` header.

#### POST `/api/documents/process`
Upload a document for processing.

**Request:** `multipart/form-data` with `file` field

```bash
curl -X POST https://your-backend/api/documents/process \
  -H "Authorization: Bearer your_token" \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "jobId": "uuid-1234",
  "status": "processing"
}
```

---

#### GET `/api/documents/{job_id}/result`
Get extraction results. Poll every 2 seconds until `status` is `completed`.

```bash
curl https://your-backend/api/documents/uuid-1234/result \
  -H "Authorization: Bearer your_token"
```

**Response:**
```json
{
  "jobId": "uuid-1234",
  "status": "completed",
  "filename": "degree.pdf",
  "data": {
    "document_type": "degree_certificate",
    "fields": {
      "name": "Priya Sharma",
      "institution": "NIT Jaipur",
      "year": "2020",
      "cgpa": "8.7"
    },
    "holder": {
      "name": "Priya Sharma",
      "fatherName": "Ramesh Sharma",
      "dob": "1998-07-22"
    },
    "credential": {
      "degree": "B.Tech",
      "institution": "NIT Jaipur",
      "year": "2020",
      "cgpa": "8.7"
    },
    "issuer": {
      "name": "National Institute of Technology Jaipur"
    },
    "confidence": {
      "name": 95,
      "degree": 90,
      "institution": 88,
      "year": 98,
      "cgpa": 85
    },
    "rawText": "Full OCR text here...",
    "pageCount": 1
  },
  "processedAt": "2024-01-15T10:30:00Z"
}
```

---

#### GET `/api/documents`
List all documents for the logged-in user.

```bash
curl https://your-backend/api/documents \
  -H "Authorization: Bearer your_token"
```

---

#### DELETE `/api/documents/{job_id}`
Delete a document.

---

#### GET `/api/health`
Check system status.

```json
{
  "status": "healthy",
  "ocr": "ready",
  "llm": "ready"
}
```

---

## Supported Document Types

| Document | Fields Extracted |
|---|---|
| Degree Certificate | Name, Father's Name, DOB, Degree, Institution, Year, CGPA |
| Mark Sheet | Name, Father's Name, Roll No, Institution, Semester, CGPA, Percentage |
| Aadhaar Card | Name, DOB, Gender, UID Number, Address |
| Passport | Name, DOB, Passport Number, Nationality, Expiry Date |
| PAN Card | Name, Father's Name, DOB, PAN Number |
| Driving License | Name, DOB, DL Number, Valid Till, Vehicle Class |

---

## Processing Pipeline

```
Upload → Preprocess → OCR → LLM Extract → Confidence Score → Store
```

1. **Preprocessing** — Grayscale, Gaussian blur, Otsu threshold, deskew, CLAHE contrast
2. **OCR** — PaddleOCR first, falls back to EasyOCR, then Tesseract
3. **LLM Extraction** — Groq Llama 3 70B detects document type and extracts all fields
4. **Confidence Scoring** — Per-field scores based on OCR confidence + field validation
5. **Storage** — Results saved to SQLite/PostgreSQL, linked to user account

---



## Limitations

- Max file size: 10MB
- Groq free tier: 14,400 requests/day
- Processing time: 10–60 seconds (depends on server load)
- SQLite resets on HF Space redeploy — use PostgreSQL for persistence

---

## What I Would Improve With More Time

### 1. Better OCR Accuracy
PaddleOCR and Tesseract struggle with low-quality scans, handwritten text, and complex layouts. I would integrate **DocTR** or **TrOCR** (transformer-based OCR) which handles these cases significantly better. I would also add image quality detection upfront — if a document is too blurry or low-resolution, inform the user before processing rather than returning poor results.

### 2. Persistent Storage for Uploaded Files
Currently uploaded files are stored on the server filesystem, which resets on Hugging Face Spaces redeploy. I would integrate **Cloudflare R2** (free tier) or **Supabase Storage** (free) to persist files across deployments, and also serve document previews reliably.

### 3. Smarter Confidence Scoring
Current confidence is based on OCR detector confidence scores, which is a rough proxy. I would build a proper field-level validator — for example, checking that a DOB is a real date, that a PAN number matches the regex `[A-Z]{5}[0-9]{4}[A-Z]`, that a CGPA is between 0–10. This would give much more meaningful confidence scores.

### 4. Real-time Progress via WebSockets
Current polling every 2 seconds works but is inefficient. I would replace it with WebSocket connections so the frontend gets instant updates when processing completes, reducing unnecessary API calls.

### 5. Batch Processing UI
The batch API endpoint exists in the backend but there is no UI for it. I would add a multi-file drag-drop zone and a batch results dashboard showing all jobs in a grid.

### 6. Admin Dashboard
An admin panel to monitor system usage, total documents processed, OCR engine success rates, and Groq API usage — to stay within free tier limits and understand system health.

### 7. Password Reset & Email Verification
Currently there is no way to reset a forgotten password. I would add email verification on signup and a password reset flow using a free email service like Resend.

### 8. Automated Tests
The test suite covers basic API and OCR unit tests but lacks integration tests with real documents. I would add a test suite with sample documents of each type and assert that key fields are correctly extracted, so regressions are caught automatically.

---

## License

MIT License — free for personal and commercial use.
