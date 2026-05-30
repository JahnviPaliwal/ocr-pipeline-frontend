import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import NavBar from './components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DocExtract — OCR & AI Extraction Pipeline',
  description: 'Extract structured data from documents using OCR + Groq Llama 3',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">{children}</main>
        <footer className="text-center py-6 text-slate-400 text-xs border-t border-slate-100 mt-8">
          DocExtract · PaddleOCR + Tesseract · Groq Llama 3 · Private & Secure
        </footer>
      </body>
    </html>
  );
}
