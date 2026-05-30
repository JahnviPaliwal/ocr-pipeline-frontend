'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DocumentListItem } from '../lib/types';
import { deleteDocument } from '../lib/api';

const PAGE_SIZE = 10;

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    processing: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function HistoryList({ documents, onDeleted }: { documents: DocumentListItem[]; onDeleted: (id: string) => void }) {
  const [page, setPage] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const pages = Math.ceil(documents.length / PAGE_SIZE);
  const shown = documents.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleDelete = async (jobId: string) => {
    if (!confirm('Delete this document?')) return;
    setDeletingId(jobId);
    try { await deleteDocument(jobId); onDeleted(jobId); }
    catch { alert('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  if (!documents.length) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <p className="font-semibold text-slate-600 mb-1">No documents yet</p>
      <p className="text-slate-400 text-sm mb-5">Upload your first document to get started</p>
      <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm">Upload Document</Link>
    </div>
  );

  return (
    <div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-slate-50">
          {shown.map(doc => (
            <div key={doc.jobId} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold text-slate-800 text-sm truncate flex-1">{doc.filename}</p>
                <Badge status={doc.status} />
              </div>
              <p className="text-slate-400 text-xs mb-3">{doc.createdAt ? new Date(doc.createdAt).toLocaleString('en-IN') : '—'}</p>
              <div className="flex gap-2">
                {doc.status === 'completed' && (
                  <Link href={`/results/${doc.jobId}`} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">View</Link>
                )}
                <button onClick={() => handleDelete(doc.jobId)} disabled={deletingId === doc.jobId}
                  className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg disabled:opacity-50">
                  {deletingId === doc.jobId ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <table className="hidden sm:table w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Filename','Uploaded','Status','Actions'].map(h => (
                <th key={h} className={`px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(doc => (
              <tr key={doc.jobId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{doc.filename}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">
                  {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                </td>
                <td className="px-5 py-4"><Badge status={doc.status} /></td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {doc.status === 'completed' && (
                      <Link href={`/results/${doc.jobId}`} className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">View</Link>
                    )}
                    <button onClick={() => handleDelete(doc.jobId)} disabled={deletingId === doc.jobId}
                      className="text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                      {deletingId === doc.jobId ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">{page * PAGE_SIZE + 1}–{Math.min((page+1)*PAGE_SIZE, documents.length)} of {documents.length}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
              className="text-sm font-medium px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors">Prev</button>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pages - 1}
              className="text-sm font-medium px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
