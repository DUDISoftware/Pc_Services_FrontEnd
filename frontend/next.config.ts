import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Cho phép import SVG thành React component
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/, // chỉ apply cho file TS/JS/TSX/JSX
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
