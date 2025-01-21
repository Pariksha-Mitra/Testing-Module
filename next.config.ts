import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (config.cache && !dev) {
      config.cache = false; // Disable caching in production
    }

    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

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
