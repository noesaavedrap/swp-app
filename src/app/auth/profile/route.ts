import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth0.getSession();

  return NextResponse.json(
    {
      user: session?.user
        ? {
            email: session.user.email ?? null,
            name: session.user.name ?? null,
            picture: session.user.picture ?? null,
          }
        : null,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
