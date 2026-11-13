/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#0f172a",
        brand: "#2563eb",
      },
    },
  },
  plugins: [],
};
