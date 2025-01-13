import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (config.cache && !dev) {
      config.cache = false; // Disable caching in production
    }
    return config; // Return the modified config
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    MONGO_URI: process.env.MONGO_URI,
  },
  // Add any other config options
};

// Wrap your existing configuration with the bundle analyzer
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
