import type { NextConfig } from "next";

// const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ||
//   process.env.APP_BASE_URL ||
//   process.env.BETTER_AUTH_URL ||
//   "http://localhost:3000")
//   .split(",")
//   .map((origin) => origin.trim())
//   .filter(Boolean);

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  // allowedDevOrigins,
};

export default nextConfig;
