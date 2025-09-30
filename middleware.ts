import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;

  // اگر در صفحه login هست و توکن داریم → بفرست dashboard
  if (pathname.startsWith('/auth') && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // اگر در صفحه dashboard هستیم و توکن نداریم → بفرست login
  if (pathname.startsWith('/dashboard') && !accessToken) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // اگر در صفحه اصلی هستیم و توکن داریم → بفرست dashboard
  if (pathname === '/' && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
