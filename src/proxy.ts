import { NextResponse } from "next/server";

export async function proxy(request: Request) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/socios/dashboard/:path*",
    "/api/auth/:path*",
  ],
};