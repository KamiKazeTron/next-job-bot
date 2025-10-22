/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkPurple: "#42047e", // solid dark purple
        darkPurpleLight: "#5b29a1", // lighter shade for buttons
        lightGreen: "#07f49e", // page background
      },
    },
  },
  plugins: [],
};
