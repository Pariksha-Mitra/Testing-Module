import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ROLE } from "./utils/types";

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

  if (token?.role === ROLE.Student && url.pathname === "/create-test") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
    "/create-test",
    "/question-bank"
  ],
};
