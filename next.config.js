/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all domains
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "s3-ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "filipinohomes123.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "leuteriorealty.com",
      },
      {
        protocol: "https",
        hostname: "api.leuteriorealty.com",
      },
    ],
    // Alternative option if remotePatterns doesn't work:
    // unoptimized: true, // Skip image optimization
    domains: ["maps.googleapis.com"],
  },
};

module.exports = nextConfig;
