import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16211b',
        field: '#f5f7f3',
        accent: '#176b4d',
        warning: '#9a4f16',
        danger: '#9f2d2d',
      },
    },
  },
  plugins: [],
} satisfies Config;
