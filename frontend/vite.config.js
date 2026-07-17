import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Note: VITE_API_URL is a build-time environment variable.
// Vite exposes env variables prefixed with VITE_ to client code.
// The value is embedded during the build step, not at runtime.
// To change the API URL, set VITE_API_URL when running docker build:
//   docker build --build-arg VITE_API_URL=http://localhost:5000 -t frontend .
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});