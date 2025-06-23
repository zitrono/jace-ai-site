/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Override Tailwind's yellow to use our brand yellow
        yellow: {
          400: '#FFDC61',
          300: '#FFE580'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        'geist': ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-video': 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(20, 184, 166))',
      }
    }
  },
  plugins: [],
}