/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xl': '1920px',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}