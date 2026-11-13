import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// the proxy sends /api calls to the express server so we don't hit CORS issues
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
