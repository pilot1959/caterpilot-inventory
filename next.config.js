/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // This is a commonly used setting to enforce best practices with React
  // Add any other configurations your app requires below
  webpack(config) {
    // Custom webpack configuration can go here
    return config;
  },
};

module.exports = nextConfig;
