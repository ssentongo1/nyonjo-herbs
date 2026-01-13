import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        cream: '#fffaf5',
        white: '#ffffff',
        text: {
          primary: '#4a044e',
          secondary: '#7c2d5e',
          light: '#9d4b8c'
        }
      },
      backgroundImage: {
        'gradient-feminine': 'linear-gradient(135deg, #fdf2f8 0%, #fffaf5 50%, #fce7f3 100%)',
        'gradient-cta': 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
        'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
      },
      boxShadow: {
        'soft': '0 10px 40px rgba(236, 72, 153, 0.1)',
        'medium': '0 20px 60px rgba(236, 72, 153, 0.15)',
        'bold': '0 30px 80px rgba(236, 72, 153, 0.2)',
      }
    },
  },
  plugins: [],
}
export default config