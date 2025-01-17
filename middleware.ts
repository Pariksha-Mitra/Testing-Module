import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    url.pathname.startsWith("/api-docs") ||
    url.pathname.startsWith("/api/swagger")
  ) {
    return NextResponse.next();
  }

  if (
    token &&
    (url.pathname === "/login" ||
      url.pathname === "/register" ||
      url.pathname === "/new-password" ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    !token &&
    (url.pathname.startsWith("/dashboard") || url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/",
    "/dashboard/:path*",
    "/new-password",
    "/api-docs",
    "/api/swagger",
  ],
};
