import { createAuthgearHandlers } from "@authgear/nextjs";
import { authgearConfig } from "@/lib/authgear";

export const dynamic = "force-dynamic";

export const { GET, POST } = createAuthgearHandlers(authgearConfig);
