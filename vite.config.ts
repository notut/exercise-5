import { defineConfig } from "vite";

export default defineConfig({
  base: "/exercise-5",
  server: {
    proxy: {
      "/exercise-5/api": "http://localhost:3000",
    },
  },
});
