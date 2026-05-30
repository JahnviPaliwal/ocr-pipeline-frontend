'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, logout } from '../lib/auth';
import { AuthUser } from '../lib/auth';

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]); // re-check on route change

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/login');
  };

  const isAuth = pathname === '/login' || pathname === '/register';

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-800">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-black">D</div>
          <span className="hidden sm:inline">DocExtract</span>
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                Upload
              </Link>
              <Link href="/history" className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                History
              </Link>
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                <span className="text-xs text-slate-500 hidden sm:inline">{user.name}</span>
                <button onClick={handleLogout}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                  Logout
                </button>
              </div>
            </>
          ) : !isAuth ? (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                Sign Up
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
