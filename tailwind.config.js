/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        heading: "#00493e",
      },
      // Tambahkan animasi di sini
      animation: {
        marquee: "marquee 25s linear infinite",
      },
      // Tambahkan keyframes untuk mengatur pergerakannya
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
