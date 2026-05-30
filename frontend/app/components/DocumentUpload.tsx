'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { uploadDocument } from '../lib/api';

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};
const MAX_SIZE = 10 * 1024 * 1024;

export default function DocumentUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (accepted: File[], rejected: any[]) => {
    setError(null);
    if (rejected.length > 0) {
      const code = rejected[0].errors[0]?.code;
      if (code === 'file-too-large') setError('File exceeds 10MB limit.');
      else if (code === 'file-invalid-type') setError('Only PDF, JPG, and PNG files are accepted.');
      else setError('File rejected. Check format and size.');
      return;
    }
    if (!accepted.length) return;
    setUploading(true);
    try {
      const res = await uploadDocument(accepted[0]);
      router.push(`/results/${res.jobId}`);
    } catch (e: any) {
      setError(e.message || 'Upload failed. Is the backend running?');
      setUploading(false);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop, accept: ACCEPTED_TYPES, maxSize: MAX_SIZE, maxFiles: 1, disabled: uploading,
  });

  const borderColor = isDragReject ? 'border-red-400 bg-red-50'
    : isDragActive ? 'border-indigo-500 bg-indigo-50'
    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50';

  return (
    <div className="w-full">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${borderColor} ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <svg className="animate-spin w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <p className="font-semibold text-slate-700">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-slate-700">
                {isDragActive ? 'Drop to upload' : 'Drag & drop or click to browse'}
              </p>
              <p className="text-slate-500 text-sm mt-1">PDF, JPG, PNG · Max 10MB · Multi-page PDFs supported</p>
            </div>
            <div className="flex gap-2">
              {['PDF','JPG','PNG'].map(t => (
                <span key={t} className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <p className="text-center text-xs text-slate-400 mt-3">
        Low-quality or blurry scans will show lower confidence scores. Use 300+ DPI scans for best results.
      </p>
    </div>
  );
}
