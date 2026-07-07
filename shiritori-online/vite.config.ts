import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expose on LAN so you can test from your phone during dev
  },
  build: {
    // Split heavy vendors into separate, long-cached chunks so repeat visits
    // only re-download app code — faster loads and smaller rebuild diffs.
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/database"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
