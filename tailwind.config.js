/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          primary:  '#0e7470',
          dark:     '#0a5450',
          accent:   '#1a958b',
        },
        charcoal: {
          DEFAULT: '#3c3d3f',
          light:   '#808082',
        },
        gray: {
          50:  '#fafbfc',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0a0f1a',
        },
      },
      fontFamily: {
        sans:   ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        accent: ['var(--font-tahu)', 'cursive'],
      },
    },
  },
  plugins: [],
};
