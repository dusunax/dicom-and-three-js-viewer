/** @type {import('tailwindcss').Config} */
const path = require("path");
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
