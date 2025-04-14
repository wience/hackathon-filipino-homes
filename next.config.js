/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Skip image optimization, allowing ALL domains

    // Keeping these commented for reference if needed later
    /* 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This approach wasn't working
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
    domains: ["maps.googleapis.com", "lh3.googleusercontent.com"],
    */
  },
};

module.exports = nextConfig;
