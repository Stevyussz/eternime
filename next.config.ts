import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Commented out to reduce risk of experimental bugs in production
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "otakudesu.cloud",
      },
      {
        protocol: "https",
        hostname: "otakudesu.lol",
      },
      {
        protocol: "https",
        hostname: "wsrv.nl", // Image proxy if used
      },
      {
        protocol: "https",
        hostname: "**.wp.com", // WordPress CDN
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
