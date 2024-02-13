/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./website/index.html",
    "./website/**/*.{vue,js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      container: {
        center: true,
        padding: "1.5rem",
      },
    },
  },

  plugins: [],
};
