export interface AuthgearConfig {
  issuer: string;
  clientId: string;
  redirectUri: string;
  discoveryUrl: string;
}

export function getAuthgearConfig(): AuthgearConfig | null {
  const issuer = process.env.NEXT_PUBLIC_AUTHGEAR_ISSUER?.replace(/\/$/, "");
  const clientId = process.env.NEXT_PUBLIC_AUTHGEAR_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!issuer || !clientId) return null;

  return {
    issuer,
    clientId,
    redirectUri: `${appUrl}/authgear/callback`,
    discoveryUrl: `${issuer}/.well-known/openid-configuration`,
  };
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function arrayBufferToBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function createPkcePair() {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const verifier = bytesToBase64Url(randomBytes);
  const challengeBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = arrayBufferToBase64Url(challengeBuffer);

  return { verifier, challenge };
}

export async function getAuthgearDiscovery() {
  const config = getAuthgearConfig();
  if (!config) return null;

  const response = await fetch(config.discoveryUrl, { cache: "no-store" });
  if (!response.ok) return null;

  return (await response.json()) as {
    authorization_endpoint?: string;
    token_endpoint?: string;
    userinfo_endpoint?: string;
    issuer?: string;
  };
}

export function makeAuthgearAuthorizeUrl(params: {
  state: string;
  nonce: string;
  codeChallenge: string;
  redirectUri: string;
  mode: "login" | "signup";
  clientId: string;
  authorizationEndpoint: string;
}) {
  const url = new URL(params.authorizationEndpoint);
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid profile email");
  url.searchParams.set("state", params.state);
  url.searchParams.set("nonce", params.nonce);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "login");

  if (params.mode === "signup") {
    url.searchParams.set("screen_hint", "signup");
  }

  return url.toString();
}

export function decodeJwtPayload<T = Record<string, unknown>>(jwt: string): T | null {
  const parts = jwt.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const binary = atob(padded);
    return JSON.parse(binary) as T;
  } catch {
    return null;
  }
}

export function getAuthgearSessionCookie() {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("swp_authgear_session="));

  if (!cookie) return null;

  try {
    return JSON.parse(decodeURIComponent(cookie.split("=")[1])) as {
      sub?: string;
      email?: string;
      name?: string;
      picture?: string;
      given_name?: string;
      family_name?: string;
    };
  } catch {
    return null;
  }
}
