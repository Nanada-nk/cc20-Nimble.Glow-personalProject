/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': 'var(--color-primary-green)',
        'accent-green': 'var(--color-accent-green)',
        'accent-tan': 'var(--color-accent-tan)',
        'background-main': 'var(--color-background-main)',
        'background-alt': 'var(--color-background-alt)',
        'text-dark': 'var(--color-text-dark)',
        'text-light': 'var(--color-text-light)',
      }
    },
  },
}