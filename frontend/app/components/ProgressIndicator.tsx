'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDocumentResult } from '../lib/api';
import { DocumentResult } from '../lib/types';

const STAGES = [
  { label: 'Uploading document', progress: 10 },
  { label: 'Enhancing image quality', progress: 30 },
  { label: 'Running OCR analysis', progress: 55 },
  { label: 'AI extracting structured data', progress: 80 },
  { label: 'Finalising results', progress: 95 },
];

export default function ProgressIndicator({ jobId, onComplete }: { jobId: string; onComplete?: (r: DocumentResult) => void }) {
  const router = useRouter();
  const [stageIdx, setStageIdx] = useState(0);
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Advance fake stage every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(e => e + 1);
      setStageIdx(i => Math.min(i + 1, STAGES.length - 2));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Poll backend
  useEffect(() => {
    let attempts = 0;
    const poll = setInterval(async () => {
      try {
        attempts++;
        const result = await getDocumentResult(jobId);
        if (result.status === 'completed') {
          clearInterval(poll);
          setStageIdx(STAGES.length - 1);
          setStatus('completed');
          onComplete?.(result);
          setTimeout(() => router.push(`/results/${jobId}`), 600);
        } else if (result.status === 'failed') {
          clearInterval(poll);
          setStatus('failed');
          setError(result.error || 'Processing failed.');
        }
        if (attempts > 90) {
          clearInterval(poll);
          setStatus('failed');
          setError('Timed out after 3 minutes. The document may be too complex — try a clearer scan.');
        }
      } catch (_) {}
    }, 2000);
    return () => clearInterval(poll);
  }, [jobId, router, onComplete]);

  const progress = status === 'completed' ? 100 : STAGES[stageIdx].progress;

  if (status === 'failed') return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
      <h3 className="font-bold text-slate-800 text-lg mb-2">Processing Failed</h3>
      <p className="text-slate-500 text-sm mb-2">{error}</p>
      <p className="text-slate-400 text-xs mb-6">Tips: Use a clear 300+ DPI scan, good lighting, minimal skew.</p>
      <button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
        Try Another Document
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <svg className="animate-spin w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-800">Processing Document</p>
          <p className="text-slate-400 text-xs">Job: {jobId.slice(0, 8)}… · {elapsed}s elapsed</p>
        </div>
      </div>

      {/* Bar */}
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stages */}
      <div className="space-y-2.5">
        {STAGES.map((s, i) => {
          const done = i < stageIdx;
          const active = i === stageIdx;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : active ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                {done
                  ? <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                  : <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white animate-pulse' : 'bg-slate-400'}`}/>
                }
              </div>
              <span className={`text-sm ${done ? 'text-emerald-600 font-medium' : active ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-400 text-center mt-5">Multi-page PDFs may take longer · OCR → EasyOCR → Tesseract fallback active</p>
    </div>
  );
}
