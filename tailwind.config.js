/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ged-green': {
          DEFAULT: '#3B6D11',
          light: '#EAF3DE',
          mid: '#639922',
          dark: '#27500A',
        },
        'ged-teal': {
          DEFAULT: '#1D9E75',
          light: '#E1F5EE',
        },
        'ged-amber': {
          DEFAULT: '#BA7517',
          light: '#FAEEDA',
          mid: '#EF9F27',
        },
        'ged-purple': {
          DEFAULT: '#534AB7',
          light: '#EEEDFE',
        },
        'ged-coral': {
          DEFAULT: '#D85A30',
          light: '#FAECE7',
        },
        'ged-red': {
          DEFAULT: '#A32D2D',
          light: '#FCEBEB',
        },
        'ged-bg': '#F4F4EF',
      },
      borderRadius: {
        'ged': '16px',
        'ged-sm': '10px',
      }
    },
  },
  plugins: [],
}
