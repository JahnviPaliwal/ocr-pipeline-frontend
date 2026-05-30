import DocumentUpload from './components/DocumentUpload';
import AuthGuard from './components/AuthGuard';
import Link from 'next/link';

export default function Home() {
  return <AuthGuard><HomeContent /></AuthGuard>;
}

function HomeContent() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-8">
        {/* <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"/>
          PaddleOCR · EasyOCR · Tesseract · Groq Llama 3
        </div> */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight mb-3">
          Document OCR &{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Extraction Pipeline
          </span>
        </h1>
        <p className="text-slate-500 text-base max-w-xl mx-auto">
          Upload any identity or professional document. AI extracts structured data with per-field confidence scores.
        </p>
      </div>

      {/* Upload */}
      <div className="mb-8">
        <DocumentUpload />
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: '📄', title: 'Multi-page', desc: 'All PDF pages processed' },
          { icon: '📊', title: 'Confidence', desc: 'Per-field accuracy scores' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="font-bold text-slate-800 text-sm">{f.title}</p>
            <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Supported docs */}
      <div className="bg-slate-50 rounded-2xl p-5 mb-6">
        <p className="text-sm font-semibold text-slate-700 mb-3">Supported Document Types</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['Degree Certificate','Mark Sheet / Transcript','Aadhaar Card','Passport','PAN Card','Any ID Document'].map(d => (
            <div key={d} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0"/>
              {d}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href="/history" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2">
          View processing history →
        </Link>
      </div>
    </div>
  );
}

