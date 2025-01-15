import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['example.com','newimage.com'], 
  },
  async rewrites() {
    return [

      {
        source: "/client/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  }
};

export default nextConfig;
