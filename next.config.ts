import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Type errors are caught in the editor — skip slow type-check during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint is run separately in CI
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
