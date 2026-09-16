import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify/Vercel manage the Next.js runtime directly.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
