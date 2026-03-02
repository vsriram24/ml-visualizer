/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Brand palette built from user's #40798C (500) and #70A9A1 (300)
        brand: {
          50:  '#edf6f5',
          100: '#d0e9e6',
          200: '#a0d0c9',
          300: '#70A9A1',  // user's lighter teal
          400: '#589196',
          500: '#40798C',  // user's primary brand
          600: '#336170',
          700: '#264A58',
          800: '#1A3342',
          900: '#0D1D2A',
        },
        // Override specific slate shades to map user's hex codes onto the
        // existing dark:bg-slate-* / dark:text-slate-* classes in every component.
        // Tailwind deep-merges extend.colors.slate with the default palette.
        slate: {
          100: '#F6F1D1',  // warm cream  — primary headings & text
          300: '#CFD7C7',  // sage gray   — body text
          400: '#9AAEAD',  // muted teal  — placeholders, captions
          700: '#1A3D4A',  // dark teal   — borders
          800: '#0F2B35',  // deeper teal — card backgrounds
          900: '#0B2027',  // near-black  — main background (user's darkest)
        },
        accent: {
          cyan:   '#06b6d4',
          emerald:'#10b981',
          rose:   '#f43f5e',
          amber:  '#f59e0b',
          violet: '#8b5cf6',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
