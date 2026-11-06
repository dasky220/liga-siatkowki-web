/** @type {import('next').NextConfig} */
const nextConfig = {
  // Statyczna eksportacja NIE jest włączona — strona musi działać jako SSR na Vercelu,
  // bo pobiera dane z API bota w runtime.
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Ikony gildii Discord
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      // Logo drużyn mogą być na dowolnym CDN
      { protocol: 'https', hostname: '**' },
    ],
  },
};
module.exports = nextConfig;
