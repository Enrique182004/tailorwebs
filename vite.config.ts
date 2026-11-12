import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  server: { host: "::", port: 8080 },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        v2: path.resolve(__dirname, "v2/index.html"),
      },
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
