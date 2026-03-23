import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/claude-todo',
  images: { unoptimized: true },
};

export default nextConfig;
