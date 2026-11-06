/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta inspirowana thestrikershub.com: ciemny granat + akcent pomarańczowy
        ink: {
          950: '#070a12',
          900: '#0c1018',
          800: '#131825',
          700: '#1c2233',
          600: '#2a3145',
          500: '#3a4258',
        },
        flame: {
          400: '#ff8a3d',
          500: '#ff6a00',
          600: '#e65a00',
        },
        court: {
          300: '#7be0c0',
          500: '#10b981',
          700: '#047857',
        },
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(255, 106, 0, 0.18)',
        card: '0 8px 32px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
};
