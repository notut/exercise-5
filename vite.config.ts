import { defineConfig } from "vite";

export default defineConfig({
  //base: "/exercise-5",
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
