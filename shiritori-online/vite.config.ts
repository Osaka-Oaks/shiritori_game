import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    target: "es2020",
    sourcemap: false,
    reportCompressedSize: false,
    cssMinify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/database"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
