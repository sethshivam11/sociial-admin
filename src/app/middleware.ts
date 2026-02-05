import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/login"],
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token");

  if (token && path.includes("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
