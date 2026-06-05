// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        // 본문: Pretendard(한국어 가독성). 기술 라벨/코드: JetBrains Mono.
        sans: [
          'Pretendard',
          'Pretendard Variable',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          ...fontFamily.sans,
        ],
        mono: ['var(--font-jetbrains-mono)', ...fontFamily.mono],
      },
      colors: {
        // primary(=pink)는 archive 레거시 룩 전용으로 보존(새 컴포넌트는 미사용).
        primary: colors.pink,
        gray: colors.gray,
        // 새 디자인 시스템 시맨틱 색 (로고 기반)
        ink: {
          DEFAULT: 'hsl(var(--ink))',
          2: 'hsl(var(--ink-2))',
          3: 'hsl(var(--ink-3))',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          2: 'hsl(var(--surface-2))',
        },
        coral: {
          DEFAULT: 'hsl(var(--coral))',
          2: 'hsl(var(--coral-2))',
          soft: 'hsl(var(--coral-soft))',
        },
        line: {
          DEFAULT: 'hsl(var(--line))',
          2: 'hsl(var(--line-2))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // primary2: {
        //   DEFAULT: 'hsl(var(--primary))',
        //   foreground: 'hsl(var(--primary-foreground))',
        // },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft: 'var(--shadow)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // 링크/인라인코드 색은 --link 변수(모드별 coral). .legacy-theme 에서 pink 로 복원됨.
            a: {
              color: 'hsl(var(--link))',
              '&:hover': {
                color: 'hsl(var(--coral))',
              },
              code: { color: 'hsl(var(--link))' },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: 'hsl(var(--link))',
            },
          },
        },
        invert: {
          css: {
            a: {
              color: 'hsl(var(--link))',
              '&:hover': {
                color: 'hsl(var(--coral))',
              },
              code: { color: 'hsl(var(--link))' },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
}
