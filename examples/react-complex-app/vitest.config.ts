import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      services: resolve(__dirname, "src/services"),
      domains: resolve(__dirname, "src/domains"),
      components: resolve(__dirname, "src/components"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
