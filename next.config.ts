import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Enables local `next dev` to access Cloudflare bindings (D1, env vars, etc.)
// via getCloudflareContext() during development.
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
