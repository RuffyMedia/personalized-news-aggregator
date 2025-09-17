/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark & Chill vibes color scheme
        'midnight': '#0f172a',
        'charcoal': '#1e293b',
        'slate': '#334155',
        'moonlight': '#64748b',
        'lavender': '#a78bfa',
        'mint': '#10b981',
        'coral': '#f97316',
        'neon-blue': '#06b6d4',
        'warm-gray': '#6b7280',
        'soft-white': '#f8fafc',
        'dark-card': '#1e293b',
        'darker-card': '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
