import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 외부 이미지 주소의 허용 설정 - CartItem.tsx 에서 이미지 주소를 전달받을 수 있게 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gzplxccswephxqokkvxj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
        search: "",
      }
    ]
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
