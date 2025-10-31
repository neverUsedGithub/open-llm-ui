import { defineConfig } from "vite";
import { resolve } from "node:path";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
});
