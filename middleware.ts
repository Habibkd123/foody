// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const PUBLIC_PATHS = ['/', '/login', '/signup', '/unauthorized'];
// const AUTH_PATHS = ['/login', '/signup'];
// const PROTECTED_PATHS = ['/profile', '/checkout', '/wishlist', '/products', '/cart', '/productList', '/home'];
// const ADMIN_PATHS = ['/admin','/admin/banner','/admin/products','/admin/categories','/admin/orders','/admin/users','/admin/roles',];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get('token')?.value;
//   const userData = request.cookies.get('user')?.value;

//   let user = null;
//   try {
//     user = userData ? JSON.parse(userData) : null;
//   } catch (e) {
//     console.error('Invalid user cookie');
//   }

//   // const isAuthPath = AUTH_PATHS.includes(pathname);
//   // const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));
//   // const isAdmin = ADMIN_PATHS.some(p => pathname.startsWith(p));

//   // if (!token && (isProtected || isAdmin)) {
//   //   const loginUrl = new URL('/login', request.url);
//   //   return NextResponse.redirect(loginUrl);
//   // }

//   // if (token && isAuthPath) {
//   //   return NextResponse.redirect(new URL('/', request.url));
//   // }

//   // if (token && isAdmin && user?.role !== 'admin') {
//   //   return NextResponse.redirect(new URL('/unauthorized', request.url));
//   // }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("token")?.value;
  let userRole = request.cookies.get("user-role")?.value as string | undefined; // "user" or "admin"
  if (!userRole) {
    const userCookie = request.cookies.get("user")?.value;
    if (userCookie) {
      try {
        const parsed = JSON.parse(userCookie);
        userRole = parsed?.role;
      } catch {
        userRole = undefined;
      }
    }
  }

  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Path:", path, "Token:", !!token, "Role:", userRole);

  // Skip static files, APIs, uploads, and public assets
  if (
    path.startsWith("/_next/") ||
    path.startsWith("/api/") ||
    path.startsWith("/uploads/") ||
    path.startsWith("/public/") ||
    path.startsWith("/favicon.ico") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // Publicly accessible routes
  const publicRoutes = [
    "/",
    "/login",
    "/auth",
    "/home",
    "/contact",
    "/faqs",
    "/features",
    "/howitworks",
    "/pricing",
  ];

  if (publicRoutes.some((route) => path === route || path.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // Redirect to /login if not logged in
  if (!token) {
    if (path === "/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based allowed routes
  const roleRoutes: { [key: string]: string[] } = {
    admin: [
      "/admin",
      "/admin/banner",
      "/admin/categories",
      "/admin/orders",
      "/admin/products",
      "/admin/settings",
      "/admin/users",
    ],
    user: [
      "/add-address",
      "/checkout",
      "/confirm-location",
      "/contact",
      "/faqs",
      "/feedback",
      "/home",
      "/productlist",
      "/products",
      "/profile",
      "/wishlist",
    ],
  };

  const allowedRoutes = roleRoutes[userRole || ""] || [];
  const hasAccess = allowedRoutes.some((route) => path.startsWith(route));

  // Restrict access for unauthorized roles
  if (!hasAccess) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  // Prevent logged-in users from visiting /login or /auth
  if ((path.startsWith("/login") || path.startsWith("/auth")) && token && userRole) {
    const redirectPath = userRole === "admin" ? "/admin" : "/home";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Optional: auto-redirects for better UX
  if (path === "/admin") {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  if (path === "/home") {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

// Match all routes except static, API, uploads, or public assets
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|uploads|public|favicon.ico|.*\\..*).*)",
  ],
};
