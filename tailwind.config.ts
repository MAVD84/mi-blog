import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f5f0eb',
          100: '#e8ddd3',
          200: '#d0bba7',
          300: '#b8987a',
          400: '#9e7554',
          500: '#7c5c3e',
          600: '#5e4530',
          700: '#3f2f20',
          800: '#201810',
          900: '#100c08',
        },
        cream: {
          50:  '#fdfbf7',
          100: '#f9f4ec',
          200: '#f2e9d8',
          300: '#e8d9c0',
        },
        accent: '#c0392b',
      },
      typography: (theme: (arg: string) => string) => ({
        ink: {
          css: {
            '--tw-prose-body': theme('colors.ink.700'),
            '--tw-prose-headings': theme('colors.ink.900'),
            '--tw-prose-lead': theme('colors.ink.600'),
            '--tw-prose-links': theme('colors.accent'),
            '--tw-prose-bold': theme('colors.ink.900'),
            '--tw-prose-counters': theme('colors.ink.500'),
            '--tw-prose-bullets': theme('colors.ink.400'),
            '--tw-prose-hr': theme('colors.ink.200'),
            '--tw-prose-quotes': theme('colors.ink.900'),
            '--tw-prose-quote-borders': theme('colors.accent'),
            '--tw-prose-captions': theme('colors.ink.500'),
            '--tw-prose-code': theme('colors.ink.900'),
            '--tw-prose-pre-code': theme('colors.cream.100'),
            '--tw-prose-pre-bg': theme('colors.ink.800'),
            '--tw-prose-th-borders': theme('colors.ink.300'),
            '--tw-prose-td-borders': theme('colors.ink.200'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
