// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/unauthorized'];
const AUTH_PATHS = ['/login', '/signup'];
const PROTECTED_PATHS = ['/profile', '/checkout', '/wishlist', '/products', '/cart', '/productList', '/home'];
const ADMIN_PATHS = ['/admin','/admin/banner','/admin/products','/admin/categories','/admin/orders','/admin/users','/admin/roles',];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const userData = request.cookies.get('user')?.value;

  // let user = null;
  // try {
  //   user = userData ? JSON.parse(userData) : null;
  // } catch (e) {
  //   console.error('Invalid user cookie');
  // }

  // const isAuthPath = AUTH_PATHS.includes(pathname);
  // const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  // const isAdmin = ADMIN_PATHS.some(p => pathname.startsWith(p));

  // if (!token && (isProtected || isAdmin)) {
  //   const loginUrl = new URL('/login', request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  // if (token && isAuthPath) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  // if (token && isAdmin && user?.role !== 'admin') {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
