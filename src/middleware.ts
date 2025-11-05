import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('accessToken')?.value;

  const { pathname } = request.nextUrl;
  const publicPaths = ['/login', '/register'];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (pathname === '/') {
    const url = authToken ? '/cabins' : '/login';
    return NextResponse.redirect(new URL(url, request.url));
  }

  if (authToken && isPublicPath) {
    return NextResponse.redirect(new URL('/cabins', request.url));
  }

  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
