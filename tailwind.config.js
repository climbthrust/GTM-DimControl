/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',

      // Haupt-Akzentfarbe (ehemals gtm-yellow)
      'gtm-accent': {
        100: '#fff7da',
        200: '#ffeaa3',
        300: '#ffd85c',
        400: '#ffcb39',
        500: '#ffc027', // Hauptfarbe / Accent
        600: '#e6ab22',
        700: '#cc961e',
        800: '#b3811a',
        900: '#996c16',
      },

      // Neutrales Grau
      'gtm-gray': {
        100: '#f5f5f5',
        200: '#e6e6e6',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#2e2e2e',
        900: '#1c1c1c',
      },

      // Textfarben
      'gtm-text': {
        100: '#f5f5f5',
        200: '#e6e6e6',
        300: '#bfbfbf',
        400: '#808080',
        500: '#3c3c3b', // Standard-Textfarbe
        600: '#2e2e2d',
        700: '#222221',
        800: '#181817',
        900: '#0f0f0e',
      },
    },
  },
  plugins: [],
};
