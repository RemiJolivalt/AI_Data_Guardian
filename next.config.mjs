/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  // Ship the synthetic demo data and scoring config with the serverless functions
  // that read them at runtime (otherwise ENOENT on Vercel /var/task).
  outputFileTracingIncludes: {
    "/cockpit": ["./demo_data/**", "./config/**"],
    "/customer": ["./demo_data/**", "./config/**"],
    "/runs": ["./demo_data/**", "./config/**"],
    "/api/assessments/demo": ["./demo_data/**", "./config/**"],
  },
};

export default nextConfig;
