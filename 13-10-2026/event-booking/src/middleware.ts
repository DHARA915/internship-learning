// src/middleware.ts  ← directly inside src/, next to the `app` folder (NOT inside app/)
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin";
const HOME_PATH = "/admin/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.get("admin-auth")?.value === "true";
  const isLoginPage = pathname === LOGIN_PATH || pathname === `${LOGIN_PATH}/`;

  console.log("middleware:", pathname, "logged in:", isLoggedIn); // remove once it works

  // 1) not logged in and not on the login page → send to login
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // 2) already logged in and opening the login page → send to dashboard
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL(HOME_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};