import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Otakudesu CDN domains
      { protocol: "https", hostname: "otakudesu.cloud" },
      { protocol: "https", hostname: "otakudesu.lol" },
      { protocol: "https", hostname: "otakudesu.best" },
      // Kuramanime CDN
      { protocol: "https", hostname: "**.kuramanime.tel" },
      { protocol: "https", hostname: "**.kuramanime.run" },
      { protocol: "https", hostname: "kuramanime.tel" },
      { protocol: "https", hostname: "i.kuramanime.tel" },
      // AnimeSail
      { protocol: "https", hostname: "154.26.137.28" },
      { protocol: "https", hostname: "animesail.mov" },
      // Samehadaku
      { protocol: "https", hostname: "**.samehadaku.how" },
      { protocol: "https", hostname: "samehadaku.how" },
      // WordPress CDN (shared by many anime sites)
      { protocol: "https", hostname: "**.wp.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i1.wp.com" },
      { protocol: "https", hostname: "i2.wp.com" },
      { protocol: "https", hostname: "i3.wp.com" },
      // Image proxies
      { protocol: "https", hostname: "wsrv.nl" },
      { protocol: "https", hostname: "images.weserv.nl" },
      // Local dev
      { protocol: "http",  hostname: "localhost" },
    ],
  },
  // Experimental compiler for auto-optimization
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
