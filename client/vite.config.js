import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true, // Clear the output directory before building
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor libraries into a separate chunk
          if (id.includes("node_modules")) {
            return "vendor";
          }

          // Split components into a separate chunk
          if (id.includes("src/components")) {
            return "components";
          }

          // Split utility functions into a separate chunk
          if (id.includes("src/utils")) {
            return "utils";
          }

          // Add more custom chunk rules as needed
        },
      },
    },
  },
});
