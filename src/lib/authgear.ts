import type { AuthgearConfig } from "@authgear/nextjs";

const endpoint = process.env.AUTHGEAR_ENDPOINT?.replace(/\/$/, "");
const clientID = process.env.AUTHGEAR_CLIENT_ID;
const sessionSecret = process.env.SESSION_SECRET;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

if (!endpoint || !clientID || !sessionSecret) {
  console.warn(
    "Authgear no está configurado. Define AUTHGEAR_ENDPOINT, AUTHGEAR_CLIENT_ID y SESSION_SECRET.",
  );
}

export const authgearConfig: AuthgearConfig = {
  endpoint: endpoint || "https://invalid.authgear.cloud",
  clientID: clientID || "invalid-client-id",
  redirectURI: process.env.AUTHGEAR_REDIRECT_URI || `${appUrl}/api/auth/callback`,
  postLogoutRedirectURI: process.env.AUTHGEAR_POST_LOGOUT_REDIRECT_URI || `${appUrl}/socios/login`,
  sessionSecret: sessionSecret || "development-session-secret-change-me-32-chars",
  isSSOEnabled: false,
};
