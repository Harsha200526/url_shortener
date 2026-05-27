/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00684A', // MongoDB Forest Green primary brand color
          600: '#005C42',
          700: '#004D36',
          800: '#003E2B',
          900: '#001E2B', // Signature deep dark forest navy
          950: '#001018',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#00ED64', // MongoDB bright neon Spring Green accent
          500: '#00D656',
          600: '#00B345',
          700: '#009033',
          800: '#006E22',
          900: '#005016',
        },
        dark: {
          // INVERTED PALETTE: Converts dark components to a light aesthetic globally
          50: '#001e2b',  // deep dark slate forest text (formerly dark-50 was light gray)
          100: '#0f2937', // dark heading text
          200: '#1c3d4a', // dark body text
          300: '#334d5c', // dark body text 2
          400: '#475f6e', // muted text
          500: '#8094a3', // border gray / secondary text
          600: '#9cb1be', // border lines
          700: '#cbdad5', // border outlines
          800: '#f0f4f2', // off-white card backgrounds
          900: '#f6f9f8', // page sub-backgrounds
          950: '#ffffff', // page main backgrounds (pure white)
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
