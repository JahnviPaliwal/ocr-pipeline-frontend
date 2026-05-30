'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '../../components/AuthGuard';
import { getDocumentResult } from '../../lib/api';
import { DocumentResult } from '../../lib/types';
import ProgressIndicator from '../../components/ProgressIndicator';
import ResultsCard from '../../components/ResultsCard';
import DocumentPreview from '../../components/DocumentPreview';

export default function ResultsPage() {
  return <AuthGuard><ResultsContent /></AuthGuard>;
}

function ResultsContent() {
  const { id: jobId } = useParams() as { id: string };
  const router = useRouter();
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    getDocumentResult(jobId)
      .then(r => { setResult(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, [jobId]);

  const downloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `extraction-${jobId.slice(0,8)}.json` });
    a.click();
  };

  if (loading) return <div className="max-w-xl mx-auto"><ProgressIndicator jobId={jobId} onComplete={setResult} /></div>;

  if (!result) return (
    <div className="text-center py-20">
      <p className="text-slate-500 mb-4">Document not found.</p>
      <Link href="/" className="bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl">Go Home</Link>
    </div>
  );

  if (result.status === 'processing') return <div className="max-w-xl mx-auto"><ProgressIndicator jobId={jobId} onComplete={setResult} /></div>;

  if (result.status === 'failed') return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Extraction Failed</h2>
      <p className="text-slate-500 text-sm mb-2">{result.error}</p>
      <p className="text-slate-400 text-xs mb-6">Try a clearer scan at 300+ DPI with good lighting.</p>
      <Link href="/" className="bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl">Try Another</Link>
    </div>
  );

  const data = result.data!;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"/>
            <span className="text-sm font-semibold text-emerald-600">Extraction Complete</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 break-all">{result.filename || 'Document'}</h1>
          {result.processedAt && (
            <p className="text-slate-500 text-xs mt-1">
              {new Date(result.processedAt).toLocaleString('en-IN')}
              {data.pageCount && data.pageCount > 1 && ` · ${data.pageCount} pages`}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <DocumentPreview jobId={jobId} filename={result.filename} boundingBoxes={data.boundingBoxes} />
          <button onClick={downloadJson} className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            JSON
          </button>
          <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl transition-colors text-sm">
            + New
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main results */}
        <div className="lg:col-span-2">
          <ResultsCard data={data} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Raw OCR text */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <button onClick={() => setShowRaw(!showRaw)} className="w-full flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">Raw OCR Text</span>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${showRaw ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            {showRaw && (
              <div className="mt-3 bg-slate-50 rounded-xl p-3 max-h-72 overflow-y-auto">
                <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">
                  {data.rawText || 'No text extracted'}
                </pre>
              </div>
            )}
          </div>

          {/* Page-wise results (multi-page PDF) */}
          {data.pageResults && data.pageResults.length > 1 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="font-bold text-slate-800 text-sm mb-3">Page-wise OCR</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {data.pageResults.map((pr: any) => (
                  <div key={pr.page} className="bg-slate-50 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-600">Page {pr.page}</span>
                      <span className="text-xs text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">{pr.engine}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{pr.text.slice(0, 80)}…</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="font-bold text-slate-800 text-sm mb-3">Job Details</p>
            <div className="space-y-1.5 text-xs">
              {[
                ['Job ID', jobId.slice(0, 12) + '…'],
                ['Status', 'Completed'],
                ['Characters', data.rawText.length.toLocaleString()],
                ['Pages', (data.pageCount || 1).toString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-semibold text-slate-700 font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
