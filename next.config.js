/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Ensure Prisma is properly bundled for serverless
  serverComponentsExternalPackages: ["@prisma/client", "@prisma/engines"],
  
  // Enable optimized loading for animations
  experimental: {
    optimizePackageImports: ['gsap', '@gsap/react'],
  },
};

export default config;
