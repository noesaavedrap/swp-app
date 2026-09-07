import { auth0 } from "@/lib/auth0";

export async function proxy(request: Request) {
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