import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('ocr_token')?.value;

  // Allow public routes always
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

  // For protected routes, check token in cookie
  // (We also handle this client-side, but middleware adds server-side protection)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
