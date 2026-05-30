'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDocumentsList } from '../lib/api';
import { DocumentListItem } from '../lib/types';
import HistoryList from '../components/HistoryList';
import AuthGuard from '../components/AuthGuard';

export default function HistoryPage() {
  return <AuthGuard><HistoryContent /></AuthGuard>;
}

function HistoryContent() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDocumentsList()
      .then(setDocuments)
      .catch(() => setError('Failed to load history. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Documents</h1>
          <p className="text-slate-500 text-sm mt-1">Only your documents — private to you</p>
        </div>
        <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors">
          + Upload New
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-14 text-center">
          <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"/>
          <p className="text-slate-500 text-sm">Loading your documents…</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-10 text-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : (
        <HistoryList documents={documents} onDeleted={(id) => setDocuments(prev => prev.filter(d => d.jobId !== id))} />
      )}
    </div>
  );
}
