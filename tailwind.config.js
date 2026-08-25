/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        page: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: {
          card: 'var(--color-border)',
        },
        primary: {
          DEFAULT: 'var(--color-accent)',
          navy: 'var(--color-primary)',
          'navy-light': 'var(--color-primary-light)',
        },
        chart: {
          revenue: 'var(--color-chart-revenue)',
          expenses: 'var(--color-chart-expenses)',
        },
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
        muted: {
          DEFAULT: 'var(--color-text-muted)',
          foreground: 'var(--color-text-secondary)',
        },
        foreground: {
          DEFAULT: 'var(--color-text-primary)',
        },
        header: {
          bg: 'var(--color-header-bg)',
          title: 'var(--color-header-title)',
        },
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
