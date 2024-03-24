/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import light from 'daisyui/src/theming/themes';
import dark from 'daisyui/src/theming/themes';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light-white': '#ffffff2b',
        'dark-grey': '#202123',
        'light-grey': '#353740',
        'glass-blue': '#799fea',
        // Define custom gradient colors
      },
      backgroundImage: {
        'custom-image': "url('./public/bg.jpeg')", // Define custom background image
      },
    },
    default: 'daisy',
  },
  daisyui: {
    darkTheme: 'light',
    themes: [
      'light',
      'dark',
      {
        light: {
          ...light['[data-theme=light]'],
          neutral: '#cbd5e1',
          'neutral-content': '#475569',
        },
        dark: {
          ...dark['[data-theme=dark]'],
          neutral: '#171c21',
          'neutral-content': '#94a3b8',
        },
      },
    ],
  },
  plugins: [daisyui],
};
