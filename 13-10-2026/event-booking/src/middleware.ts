import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin";
const HOME_PATH = "/admin/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.get("admin-auth")?.value === "true";
  const isLoginPage = pathname === LOGIN_PATH || pathname === `${LOGIN_PATH}/`;


  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL(HOME_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};