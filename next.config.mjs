/** @type {import('next').NextConfig} */
import { dirname } from "path";
import { fileURLToPath } from "url";

const nextConfig = {
  serverRuntimeConfig: {
    PROJECT_ROOT: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
