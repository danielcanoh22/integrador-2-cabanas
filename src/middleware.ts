import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('accessToken')?.value;

  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    if (authToken) {
      return NextResponse.redirect(new URL('/cabins', request.url));
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authToken && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/cabins', request.url));
  }

  if (!authToken && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
