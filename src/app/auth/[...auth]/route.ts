import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function handleAuthRequest(request: Request) {
  if (!auth0) {
    const url = new URL(request.url);
    return NextResponse.redirect(new URL("/", url.origin));
  }

  return auth0.middleware(request);
}

export async function GET(request: Request) {
  return handleAuthRequest(request);
}

export async function POST(request: Request) {
  return handleAuthRequest(request);
}
