/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongoose"],

  typescript: {
    ignoreBuildErrors: false,
  },

  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },

  images: {
    unoptimized: true,
  },

  poweredByHeader: false,
};

export default nextConfig;


