/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2172b3',
        secondary: '#4c97bb',
        grey: '#5c5c5c',
        dark: '#343a40',
        light: '#f0f0f0',
        alert: '#b31610',
        success: '#4caf50',
        border: '#dee2e6'
      },
      borderRadius: {
        DEFAULT: '8px',   // corresponde ao --default-border-radius do style-base
        custom: '10px'    // corresponde ao --custom-border-radius
      },
      fontSize: {
        title: '2.5rem',
        subtitle1: '2rem',
        subtitle2: '1.75rem',
        subtitle3: '1.5rem',
        text: '1rem'
      }
    },
  },
  plugins: [],
}
