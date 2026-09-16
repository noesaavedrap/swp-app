import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "La autenticación de socios no está configurada. Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:") {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL debe usar HTTPS.");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("debe usar HTTPS")) throw error;
    throw new Error("NEXT_PUBLIC_SUPABASE_URL no es una URL válida.");
  }

  if (!client) {
    client = createBrowserClient(url, publishableKey);
  }
  return client;
}