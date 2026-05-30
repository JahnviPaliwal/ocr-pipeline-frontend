'use client';

import { useState } from 'react';

interface Props {
  jobId: string;
  filename?: string;
  boundingBoxes?: number[][][];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DocumentPreview({ jobId, filename, boundingBoxes }: Props) {
  const [open, setOpen] = useState(false);
  const ext = filename?.split('.').pop()?.toLowerCase();
  const isPdf = ext === 'pdf';

  // Build URL to the original uploaded file via backend
  const fileUrl = `${API_BASE}/api/documents/${jobId}/file`;

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View Original
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800">Original Document</h3>
                <p className="text-slate-500 text-xs mt-0.5">{filename}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-auto flex-1 bg-slate-50 p-4">
              {isPdf ? (
                <div className="bg-white rounded-xl p-6 text-center text-slate-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-medium">PDF Document</p>
                  <p className="text-sm mt-1 text-slate-400">
                    {filename}
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block btn-primary text-sm"
                  >
                    Open PDF
                  </a>
                </div>
              ) : (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileUrl}
                    alt="Document"
                    className="max-w-full rounded-xl shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk0YTNiOCI+UHJldmlldyBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  {/* Bounding box overlays */}
                  {boundingBoxes && boundingBoxes.length > 0 && (
                    <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                      {boundingBoxes.slice(0, 20).map((box, i) => {
                        if (!box || box.length < 4) return null;
                        const xs = box.map((p) => p[0]);
                        const ys = box.map((p) => p[1]);
                        const minX = Math.min(...xs);
                        const minY = Math.min(...ys);
                        const w = Math.max(...xs) - minX;
                        const h = Math.max(...ys) - minY;
                        return (
                          <rect
                            key={i}
                            x={minX}
                            y={minY}
                            width={w}
                            height={h}
                            fill="rgba(99,102,241,0.15)"
                            stroke="#6366f1"
                            strokeWidth="1.5"
                          />
                        );
                      })}
                    </svg>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
