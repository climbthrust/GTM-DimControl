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

      'gtm-ok': {
        100: '#e0f4e0',
        200: '#b4e1b4',
        300: '#7ccd7c',
        400: '#4cb84c',
        500: '#219621',
        600: '#197b19',
        700: '#126012',
        800: '#0c460c',
        900: '#072c07',
      },
      'gtm-fail': {
        100: '#fbe4e4',
        200: '#f7baba',
        300: '#f18f8f',
        400: '#ea6262',
        500: '#d93838',
        600: '#b62d2d',
        700: '#922222',
        800: '#6f1818',
        900: '#4c0f0f',
      },
      // BLUETOOTH (Neu)
      'gtm-blue': {
        100: '#e1f0ff',
        200: '#b3d9ff',
        300: '#80bfff',
        400: '#4da6ff',
        500: '#0082fc', // Hauptfarbe / aktive Verbindung
        600: '#0069cc',
        700: '#0052a3',
        800: '#003b7a',
        900: '#002652',
      },
    },
  },
  plugins: [],
};
