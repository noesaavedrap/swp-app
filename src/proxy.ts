import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function proxy(request: Request) {
  if (!auth0) return NextResponse.next();

  const authResponse = await auth0.middleware(request);
  return authResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/socios/dashboard/:path*",
    "/auth/:path*",
  ],
};