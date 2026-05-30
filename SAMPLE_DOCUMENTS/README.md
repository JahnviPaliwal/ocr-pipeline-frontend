# Sample Test Documents

These sample documents are included for testing the OCR extraction pipeline.

## Files

### `sample_degree.jpg`
A synthetic degree certificate from NIT Jaipur containing:
- **Student Name**: Priya Sharma
- **Father's Name**: Ramesh Kumar Sharma
- **Date of Birth**: 22nd July 1998
- **Degree**: Bachelor of Technology (B.Tech)
- **Branch**: Computer Science and Engineering
- **CGPA**: 8.7 / 10.0
- **Year**: 2020
- **Institution**: National Institute of Technology, Jaipur

### `sample_marksheet.jpg`
A synthetic final semester marksheet from Rajasthan Technical University containing:
- **Student Name**: Arjun Mehta
- **Father's Name**: Sunil Mehta
- **Date of Birth**: 10/05/1999
- **Roll Number**: 19CSE4521
- **CGPA**: 9.2
- **Percentage**: 88.8%
- **Year**: 2020

## Usage

```bash
# Test via API directly
curl -X POST http://localhost:8000/api/documents/process \
  -F "file=@sample_degree.jpg"

# Or drag-drop into the web UI at http://localhost:3000
```

## Adding Real Documents

For best results, use clear, high-resolution scans of:
- Degree certificates
- Mark sheets / transcripts
- Aadhaar cards
- Passports

Supported formats: **PDF, JPG, JPEG, PNG** (max 10MB)
