/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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
    domains: ["maps.googleapis.com"],
  },
};

module.exports = nextConfig;
