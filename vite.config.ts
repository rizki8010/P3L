import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.shemamusic.my.id", // Ganti dengan URL backend Anda (misal: localhost:8000 atau 5000)
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Gunakan ini jika backend tidak menggunakan prefix /api
      },
    },
  },
});
