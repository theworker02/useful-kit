import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so GitHub project Pages and local preview both work.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
