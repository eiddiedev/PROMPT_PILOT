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
        bg: '#e8e6e1',
        panel: '#f0f0e8',
        line: '#c9c2b8',
        'line-strong': '#5a534b',
        text: '#000000',
        muted: '#666666',
        accent: '#ff5e19',
        'accent-soft': '#ffd4b8',
      },
      fontFamily: {
        pixel: ['var(--font-pixel)', 'monospace'],
        display: ['var(--font-pixel)', 'monospace'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
