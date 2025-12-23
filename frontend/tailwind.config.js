/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        typing: {
          '0%, 60%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.7',
          },
          '30%': {
            transform: 'translateY(-10px)',
            opacity: '1',
          },
        },
        slideDown: {
          'from': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          'to': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in',
        typing: 'typing 1.4s infinite',
        slideDown: 'slideDown 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
