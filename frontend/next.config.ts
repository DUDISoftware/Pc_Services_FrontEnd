import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ images: {
    domains: ["res.cloudinary.com"], // 👈 thêm dòng này
  },
};

export default nextConfig;
