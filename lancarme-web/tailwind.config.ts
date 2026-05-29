import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#1a56db',
        'brand-light': '#2f80ed',
        'brand-dark': '#1341b8',
        'brand-surface': '#eef4ff',
        'sidebar-bg': '#16347a',
        'sidebar-text': '#c8d9f5',
        'sidebar-active': '#1a56db',
        'sidebar-hover': '#1e4fc2',
        surface: '#f8fafc',
        'surface-card': '#ffffff',
        border: '#e2e8f0',
        ink: '#0f172a',
        'ink-muted': '#64748b',
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
