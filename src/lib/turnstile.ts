export const DEFAULT_TURNSTILE_SITE_KEY = "0x4AAAAAAE8WLgEAEsuat_uA";

export function getTurnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || DEFAULT_TURNSTILE_SITE_KEY;
}

export function getTurnstileSecret() {
  return process.env.TURNSTILE_SECRET || "";
}
