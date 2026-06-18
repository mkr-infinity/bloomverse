import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  
  // Static export for GitHub Pages
  output: "export",
  
  // Base path for GitHub Pages (repo name)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable trailing slash (GitHub Pages doesn't need it)
  trailingSlash: false,
};

export default nextConfig;
